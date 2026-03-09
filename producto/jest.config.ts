import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "./tsconfig.jest.json",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["./src/test/setupTests.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

export = config;
