# dual-mode-recognition-slack-bot

A Slack bot prototype (Bolt-compatible) that recognizes small developer wins and delivers notifications in two modes — real-time and daily digest — using event webhooks from tools like GitHub and Trello.

## Quick links

- Main server entry: [`src/app/index.ts`](src/app/index.ts) — exposes the HTTP server and endpoints (see [`app`](src/app/index.ts) and [`PORT`](src/app/index.ts)).
- Package scripts: [package.json](package.json)
- TypeScript config: [tsconfig.json](tsconfig.json)
- Example environment: [.env.example](.env.example)
- License: [LICENSE](LICENSE)

## Prerequisites

- Node.js (recommend Node 18+)
- npm

## Install

```sh
npm install
```

## Build

```sh
npm run build
```
