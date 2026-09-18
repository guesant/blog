import globals from 'globals';

export default [
    {
        ignores: ['public/build/**'],
    },
    {
        files: ['resources/js/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            eqeqeq: ['error', 'smart'],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-shadow': 'error',
        },
    },
    {
        files: ['resources/js/protected-email-worker.js'],
        languageOptions: {
            globals: {
                ...globals.worker,
            },
        },
    },
];
