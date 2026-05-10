const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function buildHeaders(requestHeaders) {
  const headers = new Headers(requestHeaders);
  headers.delete("host");
  return headers;
}

export async function getServerSession(requestHeaders) {
  try {
    const response = await fetch(`${API_URL.replace(/\/$/, "")}/api/auth/get-session`, {
      headers: buildHeaders(requestHeaders),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}