import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  test: {
    environment: "jsdom",
    include: ["client/src/**/*.test.ts", "client/src/**/*.spec.ts"],
  },
});
