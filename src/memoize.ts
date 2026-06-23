export function memoizeWithExpiry<T>(fn: () => Promise<T>, maxAge: number) {
  let cached: { value: Promise<T>; expiresAt: number } | null = null;

  async function memoized(): Promise<T> {
    if (cached && Date.now() < cached.expiresAt) return cached.value;
    const value = fn();
    cached = { value, expiresAt: Date.now() + maxAge };
    return value;
  }

  memoized.clear = () => {
    cached = null;
  };

  return memoized;
}
