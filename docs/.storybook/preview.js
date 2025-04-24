import React from "react";
import customTheme from "./theme";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Introduction", "Hooks"],
      },
    },
    docs: {
      theme: customTheme,
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFFFFF" },
        { name: "neutral", value: "#F8F8F8" },
        { name: "dark", value: "#333333" },
      ],
    },
    // Group hooks by category
    sidebar: {
      showRoots: true,
    },
  },
  // Organize hooks by category
  title: "React-Use-Wisely",
  layout: "centered",
};

// Add categories to hook stories
export const decorators = [
  (Story, context) => {
    // Extract hook name from the title
    const hookName = context.title.split("/").pop();

    // Assign categories based on hook name
    let category = "Other";
    if (/^use(Map|Set|LocalStorage|ReducerWithMiddleware)/.test(hookName)) {
      category = "Data Management";
    } else if (
      /^use(ClickOutside|Hover|KeyPress|ResizeObserver|IntersectionObserver)/.test(
        hookName
      )
    ) {
      category = "UI & Events";
    } else if (/^use(Async|Debounce|Throttle)/.test(hookName)) {
      category = "Async & Effects";
    } else if (/^use(Geolocation|Online|Clipboard|Media|Idle)/.test(hookName)) {
      category = "Browser APIs";
    } else if (/^use(WhyDidYouUpdate|Previous)/.test(hookName)) {
      category = "Development";
    }

    // Add category to context
    context.parameters.categories = [category];

    return React.createElement(Story, context);
  },
];

export default preview;
