import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  content: [...baseConfig.content, "../../packages/ui/src/**/*.{ts,tsx}"], // TODO - is this causing issues on first load?
  presets: [baseConfig],
} satisfies Config;
