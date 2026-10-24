import { createFileRoute } from '@tanstack/react-router';
import '@tanstack/react-start';

export const Route = createFileRoute('/health')({
  server: {
    handlers: {
      GET: () =>
        new Response('ok', {
          headers: {
            'cache-control': 'no-store',
            'content-type': 'text/plain; charset=utf-8',
          },
        }),
    },
  },
});
