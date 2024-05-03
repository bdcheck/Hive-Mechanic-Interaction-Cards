import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery,
        ...globals.node,
        ...globals.amd,
      }
    }
  },
  pluginJs.configs.recommended,
];