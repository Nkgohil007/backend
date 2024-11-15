import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from 'typescript-eslint'
export default [
  {
    files: ["src/**/*.ts"],
    languageOptions:{
        parser: typescriptParser,
    },
    plugins: {
            "typescript-eslint": {}
    },
    rules:{
      "no-unused-vars": ["error", {
            "argsIgnorePattern": "^_" ,
            "vars": "all",
            "args": "after-used",
            "caughtErrors": "all",
            "ignoreRestSiblings": false,
            "reportUsedIgnorePattern": false
        }]
    }
  }
];