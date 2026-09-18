import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/home-fonts.css',
                'resources/css/home.css',
                'resources/js/home-email-reveal.js',
                'resources/js/home.js',
                'resources/js/nav-drawer.js',
                'resources/js/dropdown.js',
                'resources/js/content-actions.js',
                'resources/js/snippet-viewer.js',
            ],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0',
        origin: 'http://localhost:5173',
        cors: true,
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
