/** Локальный профиль (браузер), общий для account / checkout */

export const PROFILE_STORAGE_KEY = "btt-profile";
export const LEGACY_PROFILE_PHONE_KEY = "btt-profile-phone";

export type LocalProfile = {
  email: string;
  phone: string;
};

const empty: LocalProfile = { email: "", phone: "" };

export function readLocalProfile(): LocalProfile {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as unknown;
      if (p && typeof p === "object" && !Array.isArray(p)) {
        const o = p as Record<string, unknown>;
        return {
          email: typeof o.email === "string" ? o.email : "",
          phone: typeof o.phone === "string" ? o.phone : "",
        };
      }
    }
    const legacy = localStorage.getItem(LEGACY_PROFILE_PHONE_KEY);
    if (legacy) return { email: "", phone: legacy };
  } catch {
    /* ignore */
  }
  return empty;
}

export function writeLocalProfile(profile: LocalProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        email: profile.email.trim(),
        phone: profile.phone.trim(),
      })
    );
    localStorage.removeItem(LEGACY_PROFILE_PHONE_KEY);
  } catch {
    /* ignore */
  }
}
