import { supabase } from "./supabaseClient.js";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const { data: { session }, } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Not logged in");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`http://localhost:3001${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}
