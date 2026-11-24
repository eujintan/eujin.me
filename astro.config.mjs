import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
export default defineConfig({ site: 'https://eujin.me', output: 'static', integrations: [react()] });
