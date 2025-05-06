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
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "docs/vite.config.ts",
      },
    },
  },
  docs: {
    autodocs: true,
    defaultName: "Documentation",
  },
  staticDirs: ["../public"],
  core: {
    disableTelemetry: true,
  },
  features: {
    storyStoreV7: true,
  },
  viteFinal: async (config) => {
    return {
      ...config,
      base: "./",
      build: {
        ...config.build,
        sourcemap: true,
      },
    };
  },
};

export default config;
