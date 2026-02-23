import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: 'ITD Extended Client',
                namespace: 'http://tampermonkey.net/',
                version: '1.1.9',
                description: 'Extended client for ITD social network with modular system',
                author: 'Kirill',
                match: [
                    'https://итд.com/*',
                    'https://xn--d1ah4a.com/*'
                ],
                grant: [
                    'GM_addStyle',
                    'GM_getValue',
                    'GM_setValue'
                ],
                'run-at': 'document-start',
                updateURL: 'https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/refs/heads/main/itd-extended.user.js',
                downloadURL: 'https://github.com/kirillsql1kaa11/ITD-EXT-V2/raw/refs/heads/main/itd-extended.user.js',
            },
            build: {
                fileName: 'itd-extended.user.js'
            }
        }),
    ],
    build: {
        outDir: './',
        emptyOutDir: false,
        minify: false // ВЫКЛЮЧАЕМ МИНИФИКАЦИЮ ДЛЯ ДЕБАГА
    }
});
