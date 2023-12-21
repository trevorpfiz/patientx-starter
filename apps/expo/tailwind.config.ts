// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  // content: ["./src/**/*.{ts,tsx}"],
  content: [...baseConfig.content],
  presets: [baseConfig, nativewind],
} satisfies Config;
