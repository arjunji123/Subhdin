const API_BASE = "https://subhdin-be.onrender.com/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;

  console.log(`[API Request] ${options.method ?? "GET"} ${url}`, options.body ? JSON.stringify(options.body, null, 2) : "");

  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(`[API Error] ${response.status} ${url}`, payload);
      throw new Error(payload?.message ?? "Request failed");
    }

    console.log(`[API Success] ${url}`, payload);
    return payload as T;
  } catch (err: any) {
    console.error(`[Network/API Error] ${url}`, err.message);
    throw err;
  }
}
