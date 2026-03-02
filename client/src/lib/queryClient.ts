import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    let message = `${res.status}: ${res.statusText}`;
    try {
      const body = JSON.parse(text);
      if (body.error) message = body.error;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
}

export async function apiRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  await throwIfResNotOk(res);
  return res;
}

type QueryFnContext = { queryKey: readonly unknown[] };

export function getQueryFn({ on401 }: { on401: "returnNull" | "throw" }) {
  return async ({ queryKey }: QueryFnContext) => {
    const path = queryKey[0] as string;
    const res = await fetch(path, { credentials: "include" });
    if (on401 === "returnNull" && res.status === 401) return null;
    await throwIfResNotOk(res);
    return res.json();
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      staleTime: 1000 * 60,
      retry: false,
    },
  },
});
