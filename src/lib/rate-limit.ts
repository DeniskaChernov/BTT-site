/**
 * Простой in-memory rate limit для API (один инстанс / один регион).
 * За балансировщиком берём первый IP из x-forwarded-for.
 */

const WINDOW_MS = 60_000;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.trim() ?? "";
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? "";

type Bucket = { at: number[] };

const postOrders = new Map<string, Bucket>();
const postLeads = new Map<string, Bucket>();
const getOrders = new Map<string, Bucket>();
const getOrdersByPhone = new Map<string, Bucket>();
const adminList = new Map<string, Bucket>();

function prune(bucket: number[], now: number): number[] {
  return bucket.filter((t) => now - t < WINDOW_MS);
}

function hit(map: Map<string, Bucket>, key: string, max: number, now: number): boolean {
  const b = map.get(key);
  const prev = b ? prune(b.at, now) : [];
  if (prev.length >= max) return false;
  prev.push(now);
  map.set(key, { at: prev });
  if (map.size > 5000) {
    for (const k of map.keys()) {
      map.delete(k);
      if (map.size < 2000) break;
    }
  }
  return true;
}

async function remoteHit(key: string, max: number): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return true;
  const redisKey = `ratelimit:${key}`;
  try {
    const incrRes = await fetch(`${UPSTASH_URL}/incr/${encodeURIComponent(redisKey)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    if (!incrRes.ok) return true;
    const incrJson = (await incrRes.json()) as { result?: number };
    const count = Number(incrJson.result ?? 0);
    if (count === 1) {
      await fetch(
        `${UPSTASH_URL}/expire/${encodeURIComponent(redisKey)}/${Math.ceil(WINDOW_MS / 1000)}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
          cache: "no-store",
        },
      );
    }
    return count <= max;
  } catch {
    return true;
  }
}

export function clientKeyFromRequest(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  const first = fwd?.split(",")[0]?.trim();
  return (
    first ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

/** POST /api/orders: не более max за минуту с одного ключа */
export async function allowPostOrder(key: string, max = 25): Promise<boolean> {
  const local = hit(postOrders, key, max, Date.now());
  if (!local) return false;
  return remoteHit(`post_orders:${key}`, max);
}

/** POST /api/leads: защита от спама */
export async function allowPostLead(key: string, max = 18): Promise<boolean> {
  const local = hit(postLeads, key, max, Date.now());
  if (!local) return false;
  return remoteHit(`post_leads:${key}`, max);
}

/** GET /api/orders: двойной лимит по IP и по хэшу телефона */
export async function allowGetOrders(
  key: string,
  phoneNorm: string,
  maxByIp = 90,
  maxByPhone = 16,
): Promise<boolean> {
  const now = Date.now();
  if (!hit(getOrders, key, maxByIp, now)) return false;
  const phoneKey = `${key}:${phoneNorm}`;
  if (!hit(getOrdersByPhone, phoneKey, maxByPhone, now)) return false;
  const remoteIp = await remoteHit(`get_orders_ip:${key}`, maxByIp);
  if (!remoteIp) return false;
  return remoteHit(`get_orders_phone:${phoneKey}`, maxByPhone);
}

/** GET /api/admin/orders: строже — только с валидным Bearer */
export async function allowAdminList(key: string, max = 40): Promise<boolean> {
  const local = hit(adminList, key, max, Date.now());
  if (!local) return false;
  return remoteHit(`admin_list:${key}`, max);
}
