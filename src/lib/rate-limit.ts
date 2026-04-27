/**
 * Простой in-memory rate limit для API (один инстанс / один регион).
 * За балансировщиком берём первый IP из x-forwarded-for.
 */

const WINDOW_MS = 60_000;

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
export function allowPostOrder(key: string, max = 25): boolean {
  return hit(postOrders, key, max, Date.now());
}

/** POST /api/leads: защита от спама */
export function allowPostLead(key: string, max = 18): boolean {
  return hit(postLeads, key, max, Date.now());
}

/** GET /api/orders: двойной лимит по IP и по хэшу телефона */
export function allowGetOrders(key: string, phoneNorm: string, maxByIp = 90, maxByPhone = 16): boolean {
  const now = Date.now();
  if (!hit(getOrders, key, maxByIp, now)) return false;
  const phoneKey = `${key}:${phoneNorm}`;
  return hit(getOrdersByPhone, phoneKey, maxByPhone, now);
}

/** GET /api/admin/orders: строже — только с валидным Bearer */
export function allowAdminList(key: string, max = 40): boolean {
  return hit(adminList, key, max, Date.now());
}
