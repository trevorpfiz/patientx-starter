// canvasClient.ts
import { env } from "./env.mjs";

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

class CanvasClient {
  private token: string | null = null;
  private tokenExpires: Date | null = null;

  constructor(
    private baseUrl: string,
    private clientId: string,
    private clientSecret: string,
  ) {}

  private async getNewAuthToken(): Promise<string> {
    const url = this.baseUrl.replace("fumage-", "");
    const payload = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await fetch(`${url}/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
    });

    if (!response.ok) {
      throw new Error(
        `Could not acquire new auth token: ${response.statusText}`,
      );
    }

    const data: TokenResponse = await response.json();
    this.token = data.access_token;
    this.tokenExpires = new Date(new Date().getTime() + data.expires_in * 1000);
    return this.token;
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    if (!this.token || !this.tokenExpires || this.tokenExpires <= new Date()) {
      await this.getNewAuthToken();
    }
  }

  async makeCanvasRequest<T>(path: string): Promise<T> {
    await this.refreshTokenIfNeeded();

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (response.status === 401) {
      // If token is expired, retry once
      await this.getNewAuthToken();
      return this.makeCanvasRequest(path); // Retry the request
    }

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }
}

// Create an instance of the CanvasClient
const canvasClient = new CanvasClient(
  env.FUMAGE_BASE_URL,
  env.CANVAS_API_CLIENT_ID,
  env.CANVAS_API_CLIENT_SECRET,
);

export default canvasClient;
