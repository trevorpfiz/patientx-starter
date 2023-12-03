import { env } from "../env.mjs";
import { createApiClient } from "./canvas-client";

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

let token: string | null = null;
let tokenExpires: Date | null = null;

const baseUrl = env.FUMAGE_BASE_URL.replace("fumage-", "");
const clientId = env.CANVAS_API_CLIENT_ID;
const clientSecret = env.CANVAS_API_CLIENT_SECRET;
const TOKEN_EXPIRATION_BUFFER = 300; // Buffer time in seconds, e.g., 5 minutes

// TODO - use post_GetAnOauthToken?
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: TokenResponse = await response.json();
  token = data.access_token;
  tokenExpires = new Date(new Date().getTime() + data.expires_in * 1000);
  return token;
}

export async function ensureValidToken(): Promise<string> {
  if (
    !token ||
    !tokenExpires ||
    new Date() >=
      new Date(tokenExpires.getTime() - TOKEN_EXPIRATION_BUFFER * 1000)
  ) {
    return getNewAuthToken();
  }
  return token;
}

export const api = createApiClient(async (method, url, params) => {
  const canvasToken = await ensureValidToken();
  const headers = {
    Authorization: `Bearer ${canvasToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const options: RequestInit = { method, headers };

  if (params) {
    if (method === "post" || method === "put") {
      options.body = JSON.stringify(params.body);
      console.log(options.body, "body");
    } else if (method === "get") {
      // console.log(method, url, params, "parameters");
    }
  }

  if (params?.path) {
    Object.entries(params.path).forEach(([key, value]) => {
      if (typeof value === "string") {
        url = url.replace(`{${key}}`, value);
      }
    });
  }

  console.log(method, url, params, "parameters");
  console.log(options, "options");
  return fetch(url, options).then((res) => res.json());
}, env.FUMAGE_BASE_URL);
