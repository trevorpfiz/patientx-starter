// canvasApi.ts
import { env } from "./env.mjs";

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

let token: string | null = null;
let tokenExpires: Date | null = null;

const baseUrl = env.FUMAGE_BASE_URL.replace("fumage-", "");
const clientId = env.CANVAS_API_CLIENT_ID;
const clientSecret = env.CANVAS_API_CLIENT_SECRET;

async function getNewAuthToken(): Promise<string> {
  const payload = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(`${baseUrl}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });

  if (!response.ok) {
    throw new Error(`Could not acquire new auth token: ${response.statusText}`);
  }

  const data: TokenResponse = await response.json();
  token = data.access_token;
  tokenExpires = new Date(new Date().getTime() + data.expires_in * 1000);
  return token;
}

async function ensureValidToken(): Promise<string> {
  if (!token || !tokenExpires || tokenExpires <= new Date()) {
    return getNewAuthToken();
  }
  return token;
}

async function makeCanvasRequest<T>(path: string): Promise<T> {
  const validToken = await ensureValidToken();
  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${validToken}` },
  });

  if (response.status === 401) {
    const newToken = await getNewAuthToken();
    return makeCanvasRequest(path); // Retry the request with a new token
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export { ensureValidToken, makeCanvasRequest };
