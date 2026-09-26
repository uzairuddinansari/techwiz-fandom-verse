import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    "dist",
    // Legacy prototype modules (admin dashboard, browser extension) that are
    // not part of the FandomVerse app entry graph.
    "src/luna-extension/**",
    "src/components/{AI,ImageShowcase,Reviews,ReviewsPanel,Robot,RobotModel,ShowPopup}.jsx",
    "src/components/techwizjourney/Journey_Nav.jsx",
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
