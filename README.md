# ProductCopy

AI-powered e-commerce product content studio built with **React**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Cloudflare Workers**, and the **Google Gemini API**.

## Project Structure

```text
productcopy/
├── shared/
│   ├── types.ts              # Shared Request/Response, Tone, Language, GeneratedCopy types
│   └── schemas.ts            # Zod validation schemas shared between UI & Worker
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable shadcn/ui-style primitives
│   │   ├── CopyOutputCard.tsx
│   │   ├── GroundingCard.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ImageUploadField.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── ProductInputForm.tsx
│   │   ├── ResultsPanel.tsx
│   │   └── ToneSelector.tsx
│   ├── lib/
│   │   ├── api.ts            # Typed multipart fetch client for /api/generate
│   │   ├── clipboard.ts      # Clipboard copy & Copy-All formatter
│   │   ├── samples.ts        # Sample product preset
│   │   └── utils.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── worker/
│   ├── src/
│   │   ├── index.ts          # Worker router (/api/health, /api/generate), CORS & headers
│   │   ├── validation.ts     # Multipart parser & binary magic-byte image validation
│   │   ├── gemini.ts         # Gemini REST API client with responseSchema & grounding rules
│   │   └── errors.ts         # Sanitized structured error responses
│   ├── .dev.vars.example
│   ├── tsconfig.json
│   └── wrangler.toml
├── tests/
│   └── productcopy.test.ts   # Vitest unit tests
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Environment Variables

### Cloudflare Worker (`worker/.dev.vars` for local dev)

Copy `worker/.dev.vars.example` to `worker/.dev.vars`:

```bash
cp worker/.dev.vars.example worker/.dev.vars
```

Set your Gemini API key in `worker/.dev.vars`:

```env
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.6-flash"
ALLOWED_ORIGIN="http://localhost:5173"
```

> **Security:** Never place `GEMINI_API_KEY` in frontend `.env` files or prefix it with `VITE_`. It must live strictly in `worker/.dev.vars` locally and in Cloudflare Worker Secrets in production.

### Frontend (optional, only if deploying frontend and Worker on different domains)

If the frontend and Worker are hosted on separate origins in production, set:

```env
VITE_API_BASE_URL="https://productcopy-worker.<your-subdomain>.workers.dev"
```

## Local Development

Run the Cloudflare Worker and Vite dev server in separate terminals:

```bash
npm install
npm run dev:worker   # http://localhost:8787
npm run dev          # http://localhost:5173 (proxies /api/* to :8787)
```

Run checks and unit tests:

```bash
npm run typecheck
npm test
npm run build
```

## Deployment Instructions

`worker/wrangler.toml` is configured with Cloudflare Workers Static Assets (`../dist`), so one deployment serves both the React frontend and `/api/*` endpoints from the same origin.

1. **Authenticate Wrangler**
   ```bash
   npx wrangler login
   ```
2. **Build the frontend**
   ```bash
   npm run build
   ```
3. **Store the Gemini API key as an encrypted Worker secret**
   ```bash
   npx wrangler secret put GEMINI_API_KEY --config worker/wrangler.toml
   ```
4. **Deploy to Cloudflare**
   ```bash
   npm run deploy:worker
   ```
