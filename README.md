# Sourdough-ing It! V2

Clean rebuild of the Bunnywood sourdough learning game.

## Main adventure

1. Raise Your Starter
2. Bake Your First Loaf
3. Start a Home Bakery
4. Open Bunnywood Bakery
5. Build the Bakery Company

The app is designed for ages 8–12. Bunny always shows one clear next action. Real sourdough teaching is part of the adventure, not a separate dashboard.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Output folder: `dist`

## Bunnywood artwork

Place the approved Bunnywood town image at:

`public/resources/bunnywood-town-master.png`

The app uses a simple fallback town until that file is present.

## Cloudflare Pages

Create a Pages project from the GitHub repository.

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

Cloudflare will then build from GitHub whenever an approved commit reaches the deployment branch.

## Build discipline

Do not use deployment as the design workspace. Work locally or in a feature branch, test the complete flow, then merge a coherent update.

The source of truth is the five-chapter progression. Every screen, game, coin reward, lesson, and building should help the player advance through those chapters or support real-life sourdough learning.
