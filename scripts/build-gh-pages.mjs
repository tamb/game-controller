import { spawnSync } from "node:child_process";
import { copyFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist-site");

rmSync(dist, { recursive: true, force: true });

function run(cmd, args, extraEnv) {
  const res = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
    shell: process.platform === "win32",
  });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

run("npx", ["storybook", "build", "-o", "dist-site/storybook"], {
  STORYBOOK_BASE_PATH: process.env.STORYBOOK_BASE_PATH ?? "/game-controller/storybook/",
});

run("npx", ["vite", "build", "--config", "vite.demo.config.ts"], {
  DEMO_BASE_PATH: process.env.DEMO_BASE_PATH ?? "/game-controller/demo/",
});

copyFileSync(join(root, "pages", "index.html"), join(dist, "index.html"));
copyFileSync(join(root, "pages", "credits.html"), join(dist, "credits.html"));
