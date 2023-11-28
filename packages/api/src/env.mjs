import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CANVAS_API_CLIENT_ID: z.string().min(1),
    CANVAS_API_CLIENT_SECRET: z.string().min(1),
    FUMAGE_BASE_URL: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    CANVAS_API_CLIENT_ID: process.env.CANVAS_API_CLIENT_ID,
    CANVAS_API_CLIENT_SECRET: process.env.CANVAS_API_CLIENT_SECRET,
    FUMAGE_BASE_URL: process.env.FUMAGE_BASE_URL,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
