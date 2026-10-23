import { defineConfig } from '@playwright/test'
import { globSync } from 'node:fs'
import { homedir } from 'node:os'

const orbChromium = process.env.AMP_ORB
  ? globSync(`${homedir()}/.agent-browser/browsers/chrome-*/chrome`)[0]
  : undefined

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH ?? orbChromium },
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'narrow', use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
  },
})
