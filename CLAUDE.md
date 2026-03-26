# PhysioSthanak - Project Guide for Claude Code

## Quick Context
PhysioSthanak is Dr. Shiva Jain Sangoi's physiotherapy clinic in Borivali West, Mumbai. This is a Next.js 16 SEO-first website built to rank for 400+ long-tail physiotherapy keywords across Mumbai's western suburbs.

**Live site**: https://physiosthanak.com
**Sitemap**: https://physiosthanak.com/sitemap.xml
**GitHub**: git@github.com:imkaransangoi/physiosthanak.git

## Team
- **Karan** (developer) — runs Stryker Digital, handles all code/SEO/deployment. Prefers discussion before execution, pushback on ideas, phased approach. Uses Claude Code in VS Code.
- **Shiva** (Dr. Shiva Jain Sangoi) — BPTh, 9+ years experience, 8000+ cases. Owns the clinic. Non-technical — go slow with her, one question at a time.

## Tech Stack
- Next.js 16.2.1 (App Router) + TypeScript + Tailwind CSS 4
- Static Site Generation via generateStaticParams
- Hosted on Vercel
- Domain: physiosthanak.com

## Brand Identity
- **Colors**: Primary deep blue `#14507c`, Accent pink `#e8899c`
- **Full palette**: See `src/app/globals.css` CSS variables
- **Tagline**: "Move • Heal • Improve"
- **Doctor**: Dr. Shiva Jain Sangoi, BPTh, 9+ Years Experience, 8000+ Cases Treated
- **Phone**: +91 9324254297
- **Address**: Shop No. 14, Ground Floor, Hari-Smruti Premises, SVP Rd, opp. HDFC Bank, Borivali West, Mumbai 400092

## SEO Strategy
This site follows a quantity-first SEO approach:
1. Build many pages targeting long-tail keywords
2. Connect Google Search Console
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

## File References
- `@SEO-SOP.md` — On-page SEO template every page must follow
- `@ROADMAP.md` — Phased development plan
- `@ARCHITECTURE.md` — Codebase structure and data model
