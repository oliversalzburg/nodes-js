import eslintConfig from "@oliversalzburg/eslint-config";
export default [...eslintConfig(import.meta.dirname), { rules: { "no-console": "off" } }];
