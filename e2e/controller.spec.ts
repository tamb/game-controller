import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => Boolean(customElements.get("game-controller")));
  const el = page.locator("game-controller");
  await expect(el).toBeVisible();
  await page.waitForFunction(() => {
    const host = document.querySelector("game-controller") as HTMLElement & {
      updateComplete?: Promise<void>;
    };
    return host?.shadowRoot?.querySelector("button") != null;
  });
});

test("defines controller tags", async ({ page }) => {
  const tags = await page.evaluate(() => ({
    gc: Boolean(customElements.get("game-controller")),
    dpad: Boolean(customElements.get("gc-dpad")),
    face: Boolean(customElements.get("gc-face-buttons")),
    stick: Boolean(customElements.get("gc-joystick")),
    anc: Boolean(customElements.get("gc-ancillary-buttons")),
  }));
  expect(tags.gc).toBe(true);
  expect(tags.dpad).toBe(true);
  expect(tags.face).toBe(true);
  expect(tags.stick).toBe(true);
  expect(tags.anc).toBe(true);
});

test("face button A press and release", async ({ page }) => {
  const types = await page.evaluate(() => {
    const seen: string[] = [];
    const host = document.querySelector("game-controller");
    if (!host) return seen;
    host.addEventListener("gamecontroller:action:a", (e) => {
      seen.push((e as CustomEvent).type);
    });
    host.addEventListener("gamecontroller:action:a:released", (e) => {
      seen.push((e as CustomEvent).type);
    });
    (window as unknown as { __gcSeen: string[] }).__gcSeen = seen;
    return seen;
  });
  expect(types).toEqual([]);
  await page.getByRole("button", { name: "A", exact: true }).click();
  const seen = await page.evaluate(() => (window as unknown as { __gcSeen: string[] }).__gcSeen);
  expect(seen).toContain("gamecontroller:action:a");
  expect(seen).toContain("gamecontroller:action:a:released");
});

test("d-pad up press and release", async ({ page }) => {
  await page.evaluate(() => {
    const seen: string[] = [];
    const host = document.querySelector("game-controller");
    host?.addEventListener("gamecontroller:dpad:up", (e) => {
      seen.push((e as CustomEvent).type);
    });
    host?.addEventListener("gamecontroller:dpad:up:released", (e) => {
      seen.push((e as CustomEvent).type);
    });
    (window as unknown as { __gcSeen: string[] }).__gcSeen = seen;
  });
  await page.getByRole("button", { name: "Up" }).click();
  const seen = await page.evaluate(() => (window as unknown as { __gcSeen: string[] }).__gcSeen);
  expect(seen).toContain("gamecontroller:dpad:up");
  expect(seen).toContain("gamecontroller:dpad:up:released");
});

test("joystick pointerdown and move", async ({ page }) => {
  await page.locator("#left-control").selectOption("joystick");
  await page.waitForFunction(() =>
    Boolean(document.querySelector("game-controller")?.shadowRoot?.querySelector(".gcjoystick")),
  );
  await page.evaluate(() => {
    const seen: string[] = [];
    const host = document.querySelector("game-controller");
    host?.addEventListener("gcjoystick:pointerdown", (e) => seen.push((e as CustomEvent).type));
    host?.addEventListener("gcjoystick:move", (e) => seen.push((e as CustomEvent).type));
    (window as unknown as { __gcSeen: string[] }).__gcSeen = seen;
  });
  const knob = page.getByRole("slider", { name: "Joystick" });
  const box = await knob.boundingBox();
  expect(box).toBeTruthy();
  if (!box) return;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 30, cy);
  await page.mouse.up();
  const seen = await page.evaluate(() => (window as unknown as { __gcSeen: string[] }).__gcSeen);
  expect(seen).toContain("gcjoystick:pointerdown");
  expect(seen).toContain("gcjoystick:move");
});

test("keyboard ArrowUp fires d-pad", async ({ page }) => {
  await page.evaluate(() => {
    const seen: string[] = [];
    const host = document.querySelector("game-controller");
    host?.addEventListener("gamecontroller:dpad:up", (e) => {
      seen.push((e as CustomEvent).type);
    });
    (window as unknown as { __gcSeen: string[] }).__gcSeen = seen;
  });
  await page.keyboard.down("ArrowUp");
  const seen = await page.evaluate(() => (window as unknown as { __gcSeen: string[] }).__gcSeen);
  expect(seen).toContain("gamecontroller:dpad:up");
  await page.keyboard.up("ArrowUp");
});

test("shell stays within the mobile viewport", async ({ page }) => {
  const box = await page.locator("game-controller").boundingBox();
  expect(box).toBeTruthy();
  if (!box) return;
  expect(box.width).toBeLessThanOrEqual(390 + 2);
  expect(box.height).toBeLessThanOrEqual(844 + 2);
});

test.fixme("fullscreen / orientation lock in headless", async () => {
  // iOS Safari often has no Fullscreen API; headless Chromium/WebKit is unreliable here.
});
