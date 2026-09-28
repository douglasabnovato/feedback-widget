/* Jest com SWC para TypeScript; cobertura só quando pedida (npm run test:coverage) */
module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: ["**/tests/**/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};
/* Fim de jest.config.ts */
