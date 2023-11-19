// vitest.config.integration.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./tests/**/*.test.ts'],
    threads: false,
    setupFiles: ['src/tests/helpers/setup.ts'],
  },
  resolve: {
    alias: {
      controller: './src/server/controller',
      services: './src/server/services',
      database: './src/database',
    },
  },
});
