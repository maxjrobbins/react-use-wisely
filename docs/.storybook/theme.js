import { create } from "@storybook/theming/create";

export default create({
  base: "light",

  // Brand
  brandTitle: "React-Use-Wisely",
  brandUrl: "https://github.com/your-username/react-use-wisely",
  brandTarget: "_blank",

  // UI
  appBg: "#F8F8F8",
  appContentBg: "#FFFFFF",
  appBorderColor: "#E6E6E6",
  appBorderRadius: 6,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: "monospace",

  // Text colors
  textColor: "#333333",
  textInverseColor: "#FFFFFF",
  textMutedColor: "#666666",

  // Toolbar colors
  barTextColor: "#999999",
  barSelectedColor: "#2196F3",
  barBg: "#FFFFFF",

  // Form colors
  inputBg: "#FFFFFF",
  inputBorder: "#E6E6E6",
  inputTextColor: "#333333",
  inputBorderRadius: 4,

  // Colors
  colorPrimary: "#2196F3",
  colorSecondary: "#4CAF50",
});
