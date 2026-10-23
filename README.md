# dot / sudotx

Personal portfolio built with React, Vite, and Motion.

## Development

Use the Node.js version in `.node-version`, then:

```sh
npm ci
npm run dev
```

`src/App.jsx` contains the page sections and project data. `src/styles.css` owns
the responsive layout and theme colors. Motion is available from `motion/react`;
the root `MotionConfig` respects the visitor's reduced-motion preference.

## Build and checks

```sh
npm run build
npm run preview
npx playwright install chromium  # once on a machine without Chromium
npm test
```

Tests exercise the production build. To use an existing browser instead of
downloading one, set `CHROMIUM_PATH` to its executable path when running tests.
In Amp orbs, tests automatically reuse agent-browser's installed Chromium.

## Amp orbs

`.agents/setup` ensures the pinned Node.js version and installs the lockfile's
dependencies. Start the supervised, hot-reloading preview with:

```sh
amp orb services ensure
```

No database, secrets, or resume hook is required.

## GitHub Pages

The production files are generated in `dist/`; the source root is no longer a
deployable static site. Before publishing this migration, change the repository's
**Settings → Pages → Build and deployment → Source** to **GitHub Actions**.
The Pages workflow tests and builds pull requests, and deploys `dist/` on pushes
to `master`. The Vite base path is `/` for `sudotx.github.io`.
