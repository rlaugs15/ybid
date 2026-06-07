export async function fetcher<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "요청에 실패했습니다.");
  }

  return result.data;
}
