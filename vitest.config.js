import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Most of the game logic is plain JS with no DOM dependency, so the
    // default environment is the lightweight "node" one. The input-handler
    // tests opt into jsdom individually via a `@vitest-environment` docblock.
    environment: "node",
  },
});
