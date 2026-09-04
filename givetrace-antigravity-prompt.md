# GiveTrace — Full Build Specification for Antigravity

Paste this entire document into Antigravity as your first prompt. It is written to be
followed literally, section by section, with no ambiguity left for the agent to guess at.

---

## 0. Role & Working Agreement

You are a senior full-stack engineer building a production-quality hackathon submission
called **GiveTrace**. Work in this order: scaffold → data layer → API routes → UI →
integration wiring → error states → polish → self-test. Do not skip ahead to polish before
every API route returns correct data. After each major step, run the app and verify it
still builds with zero TypeScript errors before moving to the next step. If a package or
API changes behavior from what's described here, check its current official docs before
guessing.

---

## 1. Project Overview

**Name:** GiveTrace
**One-liner:** A transparent micro-giving platform where donors are AI-matched to causes,
give real (devnet) crypto donations with an on-chain, publicly verifiable receipt, and
receive a personalized, narrated thank-you — built for accessibility and radical
transparency.

**Theme fit:** DEV Weekend Challenge "Generosity Edition" — hits "technology-driven
giving," "ethical and accountable giving" (on-chain transparency), and "equity and
inclusion" (audio narration for low-vision/blind donors).

**Prize categories being pursued:** Best Use of Google AI, Best Use of Solana, Best Use
of ElevenLabs. Snowflake is a stretch goal — build it last, only if time remains.

---

## 2. Tech Stack (exact versions/packages — do not substitute)

- **Framework:** Next.js 14+ (App Router), TypeScript, React Server Components where sensible
- **Styling:** Tailwind CSS
- **Gemini:** `@google/generative-ai` npm package, model `gemini-2.5-flash`
- **Solana:** `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`,
  `@solana/wallet-adapter-wallets` (Phantom adapter), `@solana/web3.js`
- **ElevenLabs:** REST API called server-side only (never expose the API key client-side)
- **Snowflake (stretch):** `snowflake-sdk` npm package, or REST API if the SDK proves painful
- **Deployment target:** Vercel
- **Package manager:** npm

---

## 3. Environment Variables

Create a `.env.local` file (and a `.env.example` with placeholder values committed to the
repo) with exactly these keys:

```
GEMINI_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
# Snowflake — stretch goal only, app must run fully without these set
SNOWFLAKE_ACCOUNT=
SNOWFLAKE_USER=
SNOWFLAKE_PASSWORD=
SNOWFLAKE_WAREHOUSE=
SNOWFLAKE_DATABASE=
SNOWFLAKE_SCHEMA=
```

Every server-side API route that depends on a missing env var must fail gracefully with a
clear error message, not crash the app or return a raw stack trace to the client.

---

## 4. Folder Structure

```
/app
  /page.tsx                        → Landing page
  /causes/page.tsx                 → Browse all causes
  /causes/[id]/page.tsx            → Cause detail
  /match/page.tsx                  → AI donor-to-cause matcher (chat-style input)
  /donate/[causeId]/page.tsx       → Wallet connect + donation flow
  /receipt/[signature]/page.tsx    → On-chain receipt + narrated thank-you
  /impact/page.tsx                 → Transparency dashboard (Snowflake stretch; graceful fallback if unconfigured)
  /api/match/route.ts              → POST → Gemini cause matching
  /api/narrate/route.ts            → POST → Gemini generates thank-you text
  /api/tts/route.ts                → POST → ElevenLabs text-to-speech, returns audio
  /api/verify-tx/route.ts          → POST → confirms a Solana devnet transaction
  /api/impact-report/route.ts      → GET → Snowflake Cortex summary (stretch)
/components
  CauseCard.tsx
  DonationForm.tsx
  WalletConnectButton.tsx
  WalletProvider.tsx                (client component wrapping wallet-adapter context)
  ImpactNarration.tsx               (audio player + visible transcript, always both)
  TransactionReceipt.tsx
  MatchmakerChat.tsx
  LoadingState.tsx
  ErrorBanner.tsx
/lib
  gemini.ts
  elevenlabs.ts
  solana.ts
  snowflake.ts
  causes.ts                         (typed mock data — see §5)
  types.ts
```

---

## 5. Data Model & Mock Data

Define in `/lib/types.ts`:

```typescript
export interface Cause {
  id: string;
  name: string;
  category: 'education' | 'health' | 'climate' | 'poverty' | 'disability-support';
  location: string;
  description: string;
  fundingGoalSol: number;
  fundedSol: number;
  imageUrl: string;
}

export interface Donation {
  signature: string;
  causeId: string;
  amountSol: number;
  donorName?: string;
  timestamp: string;
  narrative: string;
}
```

Populate `/lib/causes.ts` with **6 realistic mock causes** spanning different categories
and locations (mix of Global South and local community examples — this matters for the
"equity and geography" judging angle). Each needs a real Unsplash URL (free-to-use) for
`imageUrl`.

---

## 6. Feature Spec by Page

### 6.1 Landing page (`/`)
Hero section explaining GiveTrace in one sentence, a primary CTA to `/match`, a secondary
CTA to `/causes`, and a short "How it works" 3-step visual (Match → Give on-chain → Hear
the impact). No auth/login system — this is a demo, keep it stateless per session.

### 6.2 Browse causes (`/causes`)
Grid of `CauseCard` components pulling from `/lib/causes.ts`. Each card shows name,
category badge, location, funding progress bar, and a "Give" button linking to
`/donate/[causeId]`.

### 6.3 AI Matcher (`/match`)
A single free-text input: "Tell us what you care about" (e.g. "girls' education in rural
areas"). On submit, POST to `/api/match`, show a loading skeleton, then display the
top 3 matched causes with a **one-sentence Gemini-generated reason each cause was
matched**, ranked by relevance. Include a "Skip, show me everything" link to `/causes`.

### 6.4 Donation flow (`/donate/[causeId]`)
1. Show cause summary at top.
2. `WalletConnectButton` — Phantom wallet adapter, devnet only.
3. Amount input in SOL, with quick-select buttons (0.01 / 0.05 / 0.1 / custom).
4. On submit: build and send a native SOL transfer via `@solana/web3.js`
   (`SystemProgram.transfer`) to a fixed demo "cause wallet" devnet address you generate
   and hardcode per cause (or one shared demo treasury address — document your choice).
5. Show a pending state while awaiting confirmation (`connection.confirmTransaction`).
6. On success, redirect to `/receipt/[signature]`.
7. On failure (insufficient balance, user rejected, RPC timeout), show a specific
   `ErrorBanner` message — never a silent failure or a generic "something went wrong."
   For insufficient devnet balance specifically, show a direct link to
   `https://faucet.solana.com/` with the connected wallet's address pre-visible for copying.

### 6.5 Receipt page (`/receipt/[signature]`)
1. Call `/api/verify-tx` to confirm the transaction is finalized on devnet; show its
   status.
2. Display a link to Solana Explorer: `https://explorer.solana.com/tx/{signature}?cluster=devnet`.
3. Call `/api/narrate` (Gemini) to generate a short, warm, specific thank-you narrative
   referencing the cause and amount.
4. Call `/api/tts` (ElevenLabs) to synthesize that narrative into audio.
5. Render `ImpactNarration`: an audio player **and** the full text transcript visibly on
   screen at the same time (this is a hard accessibility requirement, not optional —
   audio-only would defeat the stated accessibility purpose).
6. Handle the case where ElevenLabs or Gemini fails: still show the transcript-only or a
   default thank-you message. The donation confirmation must never be blocked by an AI
   service outage.

### 6.6 Impact dashboard (`/impact`) — Snowflake stretch
If Snowflake env vars are unset, render a clearly labeled "Coming soon" state — do not
throw an error or leave a blank page. If configured, call `/api/impact-report`, which
runs a Cortex `COMPLETE` query over a small seeded spending-by-category table and
returns a natural-language summary paragraph, displayed alongside a simple bar chart of
category totals.

---

## 7. API Route Specs

### `/api/match` (POST)
Body: `{ query: string }`. Calls Gemini with a system prompt instructing it to rank the
6 mock causes by relevance to the donor's stated interest and return strict JSON:
`{ results: [{ causeId, reason }] }`. Validate the JSON response before using it
client-side; if parsing fails, retry once, then fall back to returning all causes
unranked with a generic reason.

### `/api/narrate` (POST)
Body: `{ causeName: string, amountSol: number }`. Returns
`{ narrative: string }` — 2-3 warm sentences, no clichés, specific to the cause and
amount. Cap output length explicitly in the prompt (under 60 words) so TTS stays short.

### `/api/tts` (POST)
Body: `{ text: string }`. Calls ElevenLabs' text-to-speech endpoint server-side with the
API key from env, returns the audio as a streamed response with correct `audio/mpeg`
content-type. Never send the ElevenLabs key to the client.

### `/api/verify-tx` (POST)
Body: `{ signature: string }`. Uses the devnet connection to call
`getSignatureStatus` / `confirmTransaction` and returns
`{ confirmed: boolean, slot?: number }`.

### `/api/impact-report` (GET) — stretch
Returns `{ summary: string, categoryTotals: Record<string, number> }` or a 503 with a
clear "not configured" message if Snowflake env vars are absent — the frontend must
handle this 503 gracefully (see §6.6).

---

## 8. Error Handling Requirements (apply everywhere, not just where noted above)

- Every API route wrapped in try/catch; errors return `{ error: string }` with an
  appropriate status code, never an unhandled 500 with a stack trace.
- Every client-side async action has a visible loading state and a visible error state —
  no silent failures, no infinite spinners.
- Wallet not installed → show a clear message with a link to install Phantom, don't just
  disable the button silently.
- Wrong network (mainnet wallet instead of devnet) → detect and show an explicit
  "please switch to devnet" message.

---

## 9. Accessibility Requirements

- Semantic HTML throughout (`<button>`, `<nav>`, `<main>`, proper heading hierarchy).
- All interactive elements keyboard-navigable and focus-visible.
- All images have descriptive `alt` text.
- The narrated thank-you always ships with a simultaneous visible transcript (§6.5) —
  this is the core accessibility feature of the product, treat it as a functional
  requirement, not a nice-to-have.
- Color contrast meets WCAG AA at minimum.

---

## 10. Visual Design Direction

Warm, trustworthy, modern nonprofit-fintech aesthetic — think "Stripe meets a nonprofit
annual report," not generic dark-mode SaaS. Primary palette: warm gold/amber accent
against a clean off-white/deep-teal base. Generous whitespace, rounded cards, subtle
motion on state changes (loading, success). Avoid stock "crypto app" neon/purple gradients
— this is a giving platform first, a blockchain app second.

---

## 11. Definition of Done — self-test checklist

Before considering the build complete, verify all of the following manually and fix
anything that fails:

1. `npm run build` completes with zero TypeScript errors and zero ESLint errors.
2. Landing → Match → pick a matched cause → Donate → connect Phantom (devnet) → send
   0.01 SOL → land on receipt page with a valid Explorer link → hear + read the
   narration, end to end, with no console errors.
3. Reject the transaction in the wallet popup → correct error state shown, no crash.
4. Disconnect wallet mid-flow → app recovers gracefully.
5. Temporarily remove the Gemini API key → `/match` and `/receipt` still function with
   documented fallback text, app does not crash.
6. Temporarily remove the ElevenLabs key → receipt page still shows the transcript, no
   broken audio player.
7. `/impact` with no Snowflake env vars set → shows "coming soon," not an error.
8. Full flow tested on both desktop width and a mobile viewport.
9. No hardcoded secrets committed anywhere in the repo — confirm `.env.local` is
   git-ignored and only `.env.example` (with blank values) is committed.

---

## 12. Deliverables

- Working app deployed to Vercel with a public URL.
- Public GitHub repo, clean commit history, README explaining setup, env vars, and which
  prize categories are being pursued and how.
- A short (2-3 min) demo video or GIF showing the full donor flow.
