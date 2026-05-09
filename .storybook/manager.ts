import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Game controller",
    brandUrl: "https://github.com/tamb/game-controller/blob/main/README.md",
    brandTarget: "_blank",
  }),
});
