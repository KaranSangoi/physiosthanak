# PhysioSthanak - Project Guide for Claude Code

## Quick Context
PhysioSthanak is Dr. Shiva Jain Sangoi's physiotherapy clinic in Borivali West, Mumbai. This is a Next.js 16 SEO-first website built to rank for 400+ long-tail physiotherapy keywords across Mumbai's western suburbs.

**Live site**: https://physiosthanak.com
**Vercel preview**: https://physiosthanak.vercel.app
**Sitemap**: https://physiosthanak.com/sitemap.xml
**GitHub**: git@github.com-karansangoi89:KaranSangoi/physiosthanak.git

## Team
- **Karan** (developer) — runs Stryker Digital, handles all code/SEO/deployment. Prefers discussion before execution, pushback on ideas, phased approach. Uses Claude Code in VS Code.
- **Shiva** (Dr. Shiva Jain Sangoi) — MPTh (Ortho), BPTh, FIFA Diploma in Football Medicine, 9+ years experience, 8000+ cases. Owns the clinic. Non-technical.

## Tech Stack
- Next.js 16.2.1 (App Router) + TypeScript + Tailwind CSS 4
- Static Site Generation via generateStaticParams (108 pages)
- Hosted on Vercel (karansangois-projects scope)
- Domain: physiosthanak.com (Namecheap → Vercel DNS)
- Analytics: GA4 (G-5M0KHWWZ42)
- Forms: Web3Forms (key: 97e35895-6350-4c20-982e-f2fdb1996900) → email to physiosthanak@gmail.com
- Reviews: Featurable widget (ID: 8f844505-6165-4a48-bebf-6a5e4aceaa54)
- Booking: Google Calendar Appointments (opens in new tab after form submit)
- Fonts: Poppins (headings) + Inter (body) via next/font/google

## Brand Identity
- **Colors**: Primary deep blue `#14507c`, Accent pink `#e8899c`
- **Full palette**: See `src/app/globals.css` CSS variables
- **Fonts**: Poppins (headings, uppercase, tracking-wide) + Inter (body)
- **Tagline**: "Move . Heal . Improve"
- **Doctor**: Dr. Shiva Jain Sangoi, MPTh (Ortho), FIFA Diploma in Football Medicine
- **Phone**: +91 9324254297
- **Email**: physiosthanak@gmail.com
- **Address**: Shop No. 14, Ground Floor, Hari-Smruti Premises, SVP Rd, opp. HDFC Bank, Borivali West, Mumbai 400092
- **Buttons**: All pink (#e8899c) with uppercase tracking — btn-primary, btn-outline, btn-outline-white
- **Text links**: Pink (text-accent-pink) for "Learn More", "Explore" etc.

## SEO Strategy
This site follows a quantity-first SEO approach:
1. Build many pages targeting long-tail keywords
2. Connect Google Search Console (done)
3. Optimize pages that get traction

Every page MUST follow the SEO SOP. See `SEO-SOP.md` for the complete template.

## Architecture Overview
See `ARCHITECTURE.md` for detailed codebase structure.

## Development Roadmap
See `ROADMAP.md` for the phased plan with all pending features.

## Key Rules
1. **Always discuss before executing** — don't jump into code without alignment
2. **Push back and suggest** — if something seems wrong, say so
3. **SEO SOP compliance** — every page must have: H1 with location+service, 155-char meta description, 35-40 word hero description, 3 benefits (35+ words each), why section, FAQ with schema markup, map section (50+ words), 1 external link (govt/Wikipedia), 1 internal link to homepage
4. **No needling or cupping services** — Shiva doesn't offer these
5. **Mira Road and Goregaon are excluded** from service areas for now
6. **Brachial plexus** appears in BOTH Neurological AND Post-Surgery categories (different search intents)
7. **Carpal Tunnel** is under Hand & Wrist (not Orthopedic)
8. **Dr. Shiva is FIFA-certified** in sports rehabilitation — this is accurate, use it in content
9. **Dr. Shiva is MPTh (Ortho)** — always include this credential
10. **No AI attribution** in commits, code comments, or anywhere visible

## Service Categories (12 live)
1. Physiotherapy (General)
2. Home Visit Physiotherapy
3. Sports Injury Physiotherapy
4. Back Pain & Spine
5. Neck Pain & Cervical
6. Post-Surgery Rehabilitation
7. Neurological Physiotherapy
8. Orthopedic Physiotherapy
9. Pediatric Physiotherapy
10. Women's Health Physiotherapy
11. Hand & Wrist Physiotherapy
12. Online Physiotherapy

## TODO (Next Steps)
- [x] **Online Physiotherapy** — Added as 12th service category
- [ ] **About page** — Dedicated page for Dr. Shiva's profile
- [ ] **Content review by Shiva** — verify medical accuracy
- [ ] **Cal.com migration** — For payments + 20-min slots (see memory)
- [ ] **Blog section** — For content marketing
- [ ] **MedicalBusiness schema** — Enhanced schema markup

## Deployment
- Vercel account: karansangoi (scope: karansangois-projects)
- Deploy command: `npx vercel --prod --scope karansangois-projects`
- GitHub repo: KaranSangoi/physiosthanak (transferred from imkaransangoi)
- Auto-deploy: Connect via Vercel dashboard → Settings → Git

## File References
- `@SEO-SOP.md` — On-page SEO template every page must follow
- `@ROADMAP.md` — Phased development plan
- `@ARCHITECTURE.md` — Codebase structure and data model
