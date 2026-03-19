# Eid Card Studio

Web app Next.js untuk membuat kartu Lebaran keluarga dengan Gemini AI.

## Fitur

- Upload satu foto keluarga
- Pengaturan teks ucapan
- Pilihan style, background, color theme, dan rasio output
- Generate kartu dengan Gemini AI image editing
- Preview source vs result
- Download hasil PNG
- Prompt final tampil untuk eksperimen lanjutan

## Tech Stack

- Next.js App Router
- TypeScript
- Google Gen AI SDK (`@google/genai`)
- Gemini model: `gemini-2.5-flash-image`

## Cara jalan lokal

```bash
npm install
cp .env.example .env.local
# isi GEMINI_API_KEY
npm run dev
```

Buka `http://localhost:3000`

## Environment

Buat file `.env.local`

```env
GEMINI_API_KEY=your_real_key_here
```

## Deploy ke Vercel / Antigravity

1. Import project
2. Tambahkan environment variable `GEMINI_API_KEY`
3. Deploy

## Catatan implementasi

- Endpoint API ada di `app/api/generate/route.ts`
- Prompt builder ada di `lib/prompt.ts`
- UI utama ada di `components/eid-card-form.tsx`
- Untuk hasil paling stabil, gunakan foto keluarga yang jelas, frontal, dan pencahayaan cukup
