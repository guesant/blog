export default {
  input: '../../src/laravel/openapi/public-site.json',
  output: {
    path: process.env.PORTFOLIO_API_GENERATED_OUTPUT ?? 'src/data/api/generated',
    clean: true,
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    '@hey-api/client-fetch',
    {
      name: '@tanstack/react-query',
      queryKeys: { enabled: true },
      queryOptions: { enabled: true, exported: true },
      mutationOptions: { enabled: true, exported: true },
      includeInEntry: true,
    },
  ],
};
