import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dir = dirname(fileURLToPath(import.meta.url));

describe("package entries", () => {
  it("main entry imports register", () => {
    const src = readFileSync(join(dir, "index.ts"), "utf8");
    expect(src).toMatch(/from ["']\.\/register["']/);
  });

  it("react entry does not import register", () => {
    const src = readFileSync(join(dir, "react.ts"), "utf8");
    expect(src).not.toMatch(/register/);
  });
});
