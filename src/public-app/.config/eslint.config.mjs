import babelParser from '@babel/eslint-parser';
import boundaries from 'eslint-plugin-boundaries';
import react from 'eslint-plugin-react';
import sonarjs from 'eslint-plugin-sonarjs';
import architecture from '../../packages/tools/eslint/architecture-plugin.mjs';

const sourceFiles = ['**/*.{ts,tsx}'];
const uiFiles = ['src/components/ui/**/*.{ts,tsx}'];
const sectionUiFiles = ['src/components/sections/*/ui/**/*.{ts,tsx}'];
const visualFiles = [...uiFiles, ...sectionUiFiles];
const generatedFiles = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.next/**',
  '**/.tanstack/**',
  '**/audits/**',
  'src/data/api/generated/**',
  'src/routeTree.gen.ts',
];

const languageOptions = {
  parser: babelParser,
  parserOptions: {
    requireConfigFile: false,
    babelOptions: { parserOpts: { plugins: ['typescript', 'jsx'] } },
  },
};

export default [
  { ignores: generatedFiles },
  {
    files: sourceFiles,
    languageOptions,
    plugins: { architecture, boundaries, react, sonarjs },
    settings: {
      react: { version: '19.1' },
      'boundaries/root-path': '.',
      'boundaries/files': [
        { category: 'route-entry', pattern: 'src/route-view*.tsx' },
        { category: 'route-entry', pattern: 'src/router.tsx' },
        { category: 'route-entry', pattern: 'src/start.ts' },
        { category: 'route-entry', pattern: 'src/routeTree.gen.ts' },
      ],
      'boundaries/elements': [
        {
          type: 'route-composition',
          pattern: 'src/components/content/route-renderers',
          partialMatch: false,
        },
        {
          type: 'ui',
          pattern: 'src/components/ui',
          partialMatch: false,
        },
        {
          type: 'section-ui',
          pattern: 'src/components/sections/*/ui',
          capture: ['feature'],
          partialMatch: false,
        },
        {
          type: 'shared',
          pattern: [
            'src/components/analytics',
            'src/components/contact',
            'src/components/content',
            'src/components/data',
            'src/components/layouts',
            'src/components/navigation',
            'src/components/primitives',
          ],
          partialMatch: false,
        },
        {
          type: 'feature',
          pattern: 'src/components/sections/*',
          capture: ['feature'],
          partialMatch: false,
        },
        {
          type: 'infrastructure',
          pattern: 'src/data',
          partialMatch: false,
        },
        {
          type: 'route',
          pattern: 'src/routes',
          partialMatch: false,
        },
        {
          type: 'infrastructure',
          pattern: ['src/app', 'src/i18n', 'src/test', 'tools'],
          partialMatch: false,
        },
      ],
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
      },
    },
    rules: {
      ...boundaries.configs.strict.rules,
      'architecture/component-props-contract': 'error',
      'architecture/conditional-rendering-delegation': 'error',
      'architecture/map-to-imported-component': 'error',
      'architecture/no-class-component': 'error',
      'architecture/no-complex-inline-handler': 'error',
      'architecture/no-explicit-any': 'error',
      'architecture/no-generic-identifiers': 'error',
      'architecture/no-generic-props-type-name': 'error',
      'architecture/no-inline-object-type-in-parameters': 'error',
      'architecture/one-function-per-file': 'error',
      'architecture/padding-around-type-statements': 'error',
      'architecture/no-unsafe-double-cast': 'error',
      'architecture/no-unjustified-suppression': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'ui' } },
              allow: {
                to: { element: { types: ['ui', 'shared', 'infrastructure'] } },
              },
            },
            {
              from: { element: { type: 'section-ui' } },
              allow: {
                to: {
                  element: [
                    {
                      type: 'section-ui',
                      captured: { feature: '{{from.feature}}' },
                    },
                    {
                      type: 'feature',
                      captured: { feature: '{{from.feature}}' },
                    },
                    { types: ['ui', 'shared', 'infrastructure'] },
                  ],
                },
              },
            },
            {
              from: { element: { type: 'shared' } },
              allow: {
                to: { element: { types: ['shared', 'ui', 'infrastructure'] } },
              },
            },
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: {
                  element: [
                    {
                      type: 'feature',
                      captured: { feature: '{{from.feature}}' },
                    },
                    {
                      type: 'section-ui',
                      captured: { feature: '{{from.feature}}' },
                    },
                    { types: ['shared', 'ui', 'infrastructure'] },
                  ],
                },
              },
            },
            {
              from: { element: { type: 'route' } },
              allow: {
                to: [
                  {
                    element: {
                      types: ['feature', 'shared', 'ui', 'infrastructure', 'route'],
                    },
                  },
                  { file: { categories: 'route-entry' } },
                ],
              },
            },
            {
              from: { element: { type: 'route-composition' } },
              allow: {
                to: {
                  element: { types: ['feature', 'shared', 'ui', 'infrastructure'] },
                },
              },
            },
            {
              from: { file: { categories: 'route-entry' } },
              allow: {
                to: [
                  { element: { types: ['feature', 'shared', 'ui', 'infrastructure', 'route'] } },
                  { element: { type: 'route-composition' } },
                  { file: { categories: 'route-entry' } },
                ],
              },
            },
            {
              from: { element: { type: 'infrastructure' } },
              allow: { to: { element: { type: 'infrastructure' } } },
            },
          ],
        },
      ],
      'react/jsx-max-depth': ['error', { max: 3 }],
      'react/jsx-uses-vars': 'error',
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/no-unstable-nested-components': 'error',
      complexity: ['error', 5],
      'max-depth': ['error', 2],
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 35, skipBlankLines: true, skipComments: true }],
      'max-nested-callbacks': ['error', 2],
      'architecture/max-function-parameters': ['error', 3],
      'max-statements': ['error', 15],
      'no-nested-ternary': 'error',
      'no-constant-condition': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'error',
      'no-implicit-coercion': 'error',
      'no-labels': 'error',
      'no-redeclare': 'error',
      'no-shadow': 'error',
      'no-unreachable': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-unneeded-ternary': 'error',
      eqeqeq: ['error', 'always'],
      'consistent-return': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['export', 'const', 'function'] },
        { blankLine: 'always', prev: ['export', 'const', 'function'], next: '*' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'always', prev: '*', next: 'import' },
        { blankLine: 'never', prev: 'import', next: 'import' },
      ],
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/cognitive-complexity': ['error', 7],
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-identical-functions': ['error', 5],
      'sonarjs/no-nested-conditional': 'error',
      'sonarjs/no-redundant-assignments': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/no-useless-increment': 'error',
    },
  },
  {
    files: sourceFiles,
    ignores: visualFiles,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/*', '@emotion/*', 'motion/react-m'],
              message: 'Visual implementation dependencies are only allowed in UI layers.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXOpeningElement > JSXIdentifier[name=/^[a-z]/]',
          message: 'Native HTML and SVG elements are only allowed in UI layers.',
        },
      ],
      'architecture/no-visual-props-outside-ui': 'error',
    },
  },
  {
    files: visualFiles,
    rules: {
      'architecture/no-mui-reexport': 'error',
    },
  },
  {
    files: ['global.d.ts', 'vite.config.ts'],
    rules: {
      'boundaries/dependencies': 'off',
      'boundaries/no-ignored-dependencies': 'off',
      'boundaries/no-unknown-dependencies': 'off',
      'boundaries/no-unknown-files': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ignores: generatedFiles,
    rules: {
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          vars: 'all',
        },
      ],
    },
  },
];
