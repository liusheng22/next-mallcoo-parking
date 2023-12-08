const { defineConfig } = require('@sujian/eslint-config')

module.exports = defineConfig(
  {
    typescript: true,
    jsonc: true,
    prettier: true,
    react: true
  },
  {
    rules: {
      '@next/next/no-async-client-component': 0,
      '@next/next/no-document-import-in-page': 0,
      '@typescript-eslint/no-var-requires': 0,
      'import/order': 0,
      // 每行末尾不允许有空格
      'no-trailing-spaces': 2,
      // react/display-name
      'react/display-name': 0,
      // 重复多余的空格
      'no-multi-spaces': 2,
      // 暂时加上
      'react-hooks/rules-of-hooks': 0
    }
  }
)
