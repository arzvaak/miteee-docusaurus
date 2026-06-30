import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".docusaurus/**", "build/**", "deploy-artifacts/**", "src/**", "docusaurus.config.ts", "sidebars.ts"]
  },
  ...nextVitals
];

export default config;
