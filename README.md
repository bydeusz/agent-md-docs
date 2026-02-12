# byDeusz agent MD docs

A CLI tool that downloads up-to-date framework documentation and generates a minified docs index for your `AGENTS.md` or `CLAUDE.md` file -- so AI coding agents always know where to find the right docs.

## Supported Frameworks

### Frontend
- **React** - Full documentation from [reactjs/react.dev](https://github.com/reactjs/react.dev/tree/main/src/content)
- **Next.js** - Full documentation from [vercel/next.js](https://github.com/vercel/next.js/tree/canary/docs)

### Backend
- **NestJS** - Full documentation from [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com/tree/master/content)
- **Django** - Full documentation from [django/django](https://github.com/django/django/tree/main/docs)
- **FastAPI** - Full documentation from [fastapi/fastapi](https://github.com/fastapi/fastapi/tree/master/docs/en/docs)
- **Django REST Framework** - Full documentation from [encode/django-rest-framework](https://github.com/encode/django-rest-framework/tree/main/docs)
- **Express** - Full documentation from [expressjs/expressjs.com](https://github.com/expressjs/expressjs.com/tree/gh-pages/en)

## Usage

The CLI will:
1. Ask which AI tool you use (GitHub Copilot, Cursor, or Claude Code)
2. Ask which framework documentation to download (frontend / backend)
3. Clear the `.docs/` folder and download fresh docs
4. Generate a minified index and insert it into `AGENTS.md` or `CLAUDE.md`
5. Save a manifest (`.docs/manifest.json`) to track installed docs

### Via npx

```bash
npx @bydeusz/agent-md-docs
```

### Upgrade existing docs

To re-download and update all previously installed docs without going through the prompts:

```bash
npx @bydeusz/agent-md-docs --upgrade
```

This reads the manifest and re-downloads everything in one go.

### Local development

```bash
npm install
npm run build
node dist/index.js
```

## What it does

The tool downloads markdown documentation from a framework's GitHub repository and saves it locally in a `.docs/` folder. It then scans the downloaded docs and generates a compact, single-line index wrapped in HTML comment markers, like:

```
<!-- NESTJS-AGENTS-MD-START -->[NestJS Docs Index]|root: ./.docs/nestjs|...|cli:{libraries.md,overview.md,...}|...<!-- NESTJS-AGENTS-MD-END -->
```

This index is inserted into your `AGENTS.md` or `CLAUDE.md` file. AI agents can use this index to quickly locate and read the relevant documentation for the framework being used in the project.

## Adding more frameworks

To add a new framework, create a config file in `src/frameworks/` and register it in `src/frameworks/registry.ts`. Each framework config specifies:

- Category (`frontend` or `backend`)
- GitHub repository and branch
- Path to the documentation content
- File extensions to download (`.md`, `.mdx`, etc.)
- Optional extension conversion (e.g. `.txt` → `.md` for Django)
- Comment markers for the index block
- Warning message for the AI agent
