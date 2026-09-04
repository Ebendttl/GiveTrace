# GiveTrace

> **DEV Weekend Challenge "Generosity Edition" Submission**

A transparent micro-giving platform where donors are **AI-matched** to causes, make real (devnet) crypto donations with an **on-chain, publicly verifiable receipt**, and receive a **personalized, narrated thank-you** — built for accessibility and radical transparency.

---

## 🏆 Prize Categories

| Prize | Technology Used |
|---|---|
| **Best Use of Google AI** | Gemini 2.5 Flash for AI cause matching + thank-you narrative generation |
| **Best Use of Solana** | Native SOL transfers on Devnet via `@solana/web3.js` + Phantom wallet adapter |
| **Best Use of ElevenLabs** | Server-side TTS narration with visible accessibility transcript |
| **Snowflake (Stretch)** | Cortex Cortex AI summary of donation impact by category |

---

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router), TypeScript, React Server Components
- **Styling:** Tailwind CSS — warm gold/amber + deep-teal aesthetic
- **AI Matching + Narrative:** `@google/generative-ai` — `gemini-2.5-flash`
- **Blockchain:** `@solana/wallet-adapter-react`, `@solana/web3.js` (Phantom, Devnet)
- **TTS Narration:** ElevenLabs REST API (server-side only — key never exposed to client)
- **Transparency Dashboard:** Snowflake SDK / Cortex (stretch goal, graceful fallback)
- **Deployment:** Vercel

---

## 🗂️ Folder Structure

```
/app
  /page.tsx                        → Landing page
  /causes/page.tsx                 → Browse all causes
  /causes/[id]/page.tsx            → Cause detail
  /match/page.tsx                  → AI donor-to-cause matcher
  /donate/[causeId]/page.tsx       → Wallet connect + donation flow
  /receipt/[signature]/page.tsx    → On-chain receipt + narrated thank-you
  /impact/page.tsx                 → Transparency dashboard (Snowflake stretch)
  /api/match/route.ts              → POST → Gemini cause matching
  /api/narrate/route.ts            → POST → Gemini generates thank-you text
  /api/tts/route.ts                → POST → ElevenLabs text-to-speech
  /api/verify-tx/route.ts          → POST → confirms Solana devnet transaction
  /api/impact-report/route.ts      → GET  → Snowflake Cortex summary (stretch)
/components                        → CauseCard, DonationForm, WalletProvider, etc.
/lib                               → gemini.ts, elevenlabs.ts, solana.ts, causes.ts
```

---

## ⚙️ Setup

### 1. Clone & install

```bash
git clone https://github.com/your-username/givetrace.git
cd givetrace
npm install --legacy-peer-deps
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

```env
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here     # e.g. 21m00Tcm4TlvDq8ikWAM

NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Snowflake — stretch goal only, app runs fully without these
SNOWFLAKE_ACCOUNT=
SNOWFLAKE_USER=
SNOWFLAKE_PASSWORD=
SNOWFLAKE_WAREHOUSE=
SNOWFLAKE_DATABASE=
SNOWFLAKE_SCHEMA=
```

> ⚠️ **Important:** Never commit `.env.local`. It is already git-ignored. Only `.env.example` (with blank values) is committed.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Getting API Keys

- **Gemini:** [Google AI Studio](https://aistudio.google.com/app/apikey)
- **ElevenLabs:** [ElevenLabs Dashboard](https://elevenlabs.io) → API Keys
- **ElevenLabs Voice ID:** Found in your Voice Library on the ElevenLabs dashboard
- **Solana Devnet SOL (for testing):** [https://faucet.solana.com/](https://faucet.solana.com/)

---

## 🌊 Full Donor Flow

1. **Landing (`/`)** → Read about GiveTrace, see featured causes
2. **Match (`/match`)** → Describe your interests → Gemini ranks top 3 causes with personalized reasons
3. **Donate (`/donate/[causeId]`)** → Connect Phantom (devnet) → choose SOL amount → submit transaction
4. **Receipt (`/receipt/[signature]`)** → On-chain confirmation → Gemini generates a warm thank-you → ElevenLabs narrates it → **audio player + full visible transcript** always displayed together
5. **Impact (`/impact`)** → Snowflake Cortex transparency dashboard (or graceful "coming soon" if unconfigured)

---

## ♿ Accessibility

- Semantic HTML throughout (`<button>`, `<nav>`, `<main>`, proper heading hierarchy)
- All interactive elements keyboard-navigable with visible focus rings
- All images have descriptive `alt` text
- The narrated thank-you **always ships with a simultaneous visible text transcript** — this is the core accessibility feature, not optional
- Color contrast meets WCAG AA minimum

---

## 🔒 Security Notes

- ElevenLabs API key is **never** sent to the client — all TTS calls are proxied through `/api/tts`
- Gemini API key is server-side only
- `.env.local` is git-ignored; only `.env.example` (blank values) is committed
- Donations go to demo treasury Devnet addresses — no real funds involved

---

## 🧪 Definition of Done Checklist

- [x] `npm run build` zero TypeScript errors
- [x] End-to-end flow: Land → Match → Donate → Receipt (audio + transcript) 
- [x] Wallet rejection → explicit error state (no crash)
- [x] Missing Gemini key → fallback text, no crash
- [x] Missing ElevenLabs key → transcript only, no broken audio player
- [x] `/impact` with no Snowflake → "coming soon" card
- [x] No secrets in repo — `.env.local` git-ignored

---

## 📦 Deployment (Vercel)

```bash
vercel deploy
```

Set all env vars in the Vercel project dashboard under **Settings → Environment Variables**.
