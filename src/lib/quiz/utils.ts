/**
 * Quiz utilities to isolate TypeScript logic from JSX parsing.
 */

export type Opt = { t: string; ok: boolean };

export function shuffle<T>(a: T[]): T[] {
  return a
    .map((x) => [Math.random(), x] as const)
    .sort((p, q) => p[0] - q[0])
    .map((p) => p[1]);
}

export function buildDeck(track: string, questions: any[]): Opt[][] {
  return questions.map(({ answers }) =>
    shuffle(answers.map((t: string, k: number) => ({ t, ok: k === 0 })))
  );
}
