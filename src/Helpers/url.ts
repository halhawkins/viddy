type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export function buildUrl(base: string, params: QueryParams): string {
  const url = new URL(base);

  url.search = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  return url.toString();
}
