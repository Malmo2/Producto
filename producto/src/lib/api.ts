export async function apiFetch(path: string, token: string, options: RequestInit = {}) {
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
