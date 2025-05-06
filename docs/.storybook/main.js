/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/hooks/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/Introduction.mdx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-links",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: "Documentation",
  },
  staticDirs: ["../public"],
  core: {
    disableTelemetry: true,
  },
  build: {
    test: {
      disabledAddons: ["@storybook/addon-docs"],
    },
  },
  viteFinal: async (config) => {
    return {
      ...config,
      base: "./",
    };
  },
};

export default config;
