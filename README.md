# VanWEvents — MSC Cruise Booking Site

Live at **[vanwevents.co.za](https://vanwevents.co.za)**. Deployed automatically to Vercel on every push to `main`.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Payments | Paystack (ZAR deposits) |
| Email | Resend + @react-email |
| Video assets | Remotion (render pipeline, separate from Next.js build) |

---

## Project structure

```
app/
  page.tsx                  # Home page — all sections composed here
  layout.tsx                # Root layout, fonts, metadata
  cruises/[slug]/page.tsx   # Individual cruise booking page
  api/contact/route.ts      # POST handler: sends enquiry emails; optionally verifies Paystack payment if reference present
  opengraph-image.tsx       # Auto-generated OG image
  sitemap.ts                # Auto-generated sitemap

components/
  Navigation.tsx            # Sticky nav with anchor links
  Hero.tsx                  # Hero section
  FeaturedCruises.tsx       # Cruise card grid
  BookingPage.tsx           # Full booking form with live pricing
  EnquiryForm.tsx           # Enquiry form on home page — submits directly, no payment required
  WhyBookWithUs.tsx         # Trust section
  AboutBlurb.tsx            # About section
  Footer.tsx                # Footer

lib/
  cruises.ts                # Cruise data, types, helpers (getCruiseBySlug, getDepositZAR)
  email.ts                  # sendEnquiryEmails() — Resend integration

remotion/                   # Video render pipeline (NOT part of Next.js build)
  Root.tsx                  # Remotion composition root
  HeroVideo.tsx             # Animated hero video composition
  CruiseCard.tsx            # Per-cruise animated card composition

scripts/
  render-videos.mjs         # Renders Remotion compositions to .mp4
  process-media.mjs         # Post-processes rendered video
  download-images.mjs       # Downloads cruise images
```

---

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes (production) | Resend API key (`re_...`) for sending booking confirmation emails |
| `PAYSTACK_SECRET_KEY` | Yes (production) | Paystack secret key for server-side payment verification |

In local development, both can be omitted — the API route logs to console instead of sending emails, and skips Paystack verification.

---

## Booking flows

### Enquiry (home page `#enquiry` section)
1. Visitor fills in `EnquiryForm` (name, email, phone, cruise interest, cabin, party size)
2. Form POSTs to `/api/contact` — no payment reference included
3. API route skips Paystack verification and sends emails via Resend
4. Two emails sent: confirmation to the customer, notification to `bookings@vanwevents.co.za`

### Paid booking (`/cruises/[slug]`)
1. Visitor browses cruises on the home page (`FeaturedCruises`)
2. Clicks "Book This Voyage" → `/cruises/[slug]`
3. `BookingPage` renders the form with live cabin pricing
4. On submit, Paystack popup collects the 33% deposit
5. On Paystack success, the form POSTs to `/api/contact` with the payment reference
6. API route verifies the payment against Paystack's API, then calls `sendEnquiryEmails()` via Resend
7. Two emails sent: booking confirmation (with reference) to the customer, notification to `bookings@vanwevents.co.za`

---

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

To preview email templates:

```bash
npx react-email dev
```

To render Remotion videos (requires ffmpeg):

```bash
npm run render:videos
```

---

## Deployment

Vercel is connected to the GitHub repo. Every push to `main` triggers a production build. The build runs `next build` — TypeScript is checked across `app/`, `components/`, and `lib/`. The `remotion/` directory is excluded from TypeScript compilation via `tsconfig.json`.

To trigger a manual redeploy, push any commit or use the Vercel dashboard.
