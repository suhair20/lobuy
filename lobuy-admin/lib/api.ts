export type ApiError = Error & { status?: number; data?: { message?: string } };

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;

  const response = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      "X-Requested-With": "XMLHttpRequest",
      ...(init.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed") as ApiError;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
