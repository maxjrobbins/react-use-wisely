import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import fs from "fs";
import path from "path";

// Get all hook files for individual bundling
const hooksDir = path.resolve(__dirname, "src/hooks");
const hookFiles = fs
  .readdirSync(hooksDir)
  .filter(
    (file) =>
      !file.includes("index.") &&
      !file.includes(".test.") &&
      !file.includes(".d.ts") &&
      file.endsWith(".ts") &&
      fs.statSync(path.join(hooksDir, file)).isFile()
  )
  .map((file) => `src/hooks/${file}`);

// Main bundle configuration
const mainBundle = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      exclude: ["**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"],
      outputToFilesystem: true,
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    terser(),
  ],
  external: ["react", "react-dom"],
};

// Individual hook bundle configurations
const individualHookBundles = hookFiles.map((input) => {
  const fileName = path.basename(input, path.extname(input));
  return {
    input,
    output: [
      {
        file: `dist/hooks/${fileName}.js`,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: `dist/hooks/${fileName}.esm.js`,
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"],
        outputToFilesystem: true,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      terser(),
    ],
    external: ["react", "react-dom"],
  };
});

// Category bundle configurations
const categories = ["browser", "dom", "utilities", "async"];
const categoryBundles = categories.map((category) => {
  return {
    input: `src/categories/${category}.ts`,
    output: [
      {
        file: `dist/categories/${category}.js`,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: `dist/categories/${category}.esm.js`,
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"],
        outputToFilesystem: true,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      terser(),
    ],
    external: ["react", "react-dom", /^\.\.\/hooks\//],
  };
});

// Export all bundle configurations
export default [mainBundle, ...individualHookBundles, ...categoryBundles];
