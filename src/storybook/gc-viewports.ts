/** Storybook viewports that match the shell’s portrait / landscape layouts. */
export const GC_STORY_VIEWPORTS = {
  "gc-portrait": {
    name: "GC Portrait",
    styles: { width: "390px", height: "844px" },
    type: "mobile",
  },
  "gc-landscape": {
    name: "GC Landscape",
    styles: { width: "844px", height: "390px" },
    type: "mobile",
  },
} as const;
