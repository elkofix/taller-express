/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  coveragePathIgnorePatterns: [
    "/src/lib/connectionDB.ts",
    "/src/index.ts" // Ignora este archivo específico
  ]
};