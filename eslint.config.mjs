import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// Next 16 removed `next lint`, so `npm run lint` runs ESLint directly with the
// flat configs that eslint-config-next ships (the old FlatCompat bridge crashes
// on ESLint 9 + eslint-config-next 16).
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Explicit `any` is visible but not blocking in app code; the remaining
      // sites are boundary parsers (WATI webhooks, tool inputs) awaiting real types.
      '@typescript-eslint/no-explicit-any': 'warn',
      // React Compiler readiness rules (eslint-plugin-react-hooks 7): the
      // flagged sync-state-from-props effects predate them and need a
      // dedicated refactor pass; keep them visible without blocking lint.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      // Underscore-prefixed names are the project's "intentionally unused" marker.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Tests and one-off scripts stub external payloads freely.
    files: ['**/*.test.ts', '**/*.test.tsx', 'scripts/**'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
    // ESLint 9 lints dot-folders by default: keep worktrees and tool scratch out.
    '.worktrees/**',
    '.claude/**',
    '.superpowers/**',
    '.vercel/**',
    // Mirrors tsconfig.json "exclude": Finder duplicate copies ("page 2.tsx") and spikes.
    '**/* *.*',
    'scripts/spikes/**',
  ]),
])
