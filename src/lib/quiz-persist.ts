const KEY = "btt-quiz-v1";

export const QUIZ_PERSIST_VERSION = 1 as const;

export type QuizPersistedV1 = {
  v: typeof QUIZ_PERSIST_VERSION;
  step: number;
  workGoal: "furniture" | "planter" | null;
  furnitureUse: "seating" | "other" | null;
  planterPath: "ready" | "weave" | null;
  productKind: "material" | "planter" | null;
  vol: "12" | "5" | "10" | "unknown" | null;
  when: string | null;
  endMode: "idle" | "result" | "quote" | "done";
  contact: { phone: string; city: string; company: string };
};

export function loadQuizPersisted(): QuizPersistedV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object") return null;
    const o = p as Record<string, unknown>;
    if (o.v !== QUIZ_PERSIST_VERSION) return null;
    if (typeof o.step !== "number") return null;
    return p as QuizPersistedV1;
  } catch {
    return null;
  }
}

export function saveQuizPersisted(state: QuizPersistedV1): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function clearQuizPersisted(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
