# PhysioSthanak - Development Roadmap

## Current State (March 2026)
- Site is LIVE at https://physiosthanak.com
- Hosted on Vercel (karansangois-projects)
- 108 static pages generated
- Domain connected via Vercel DNS
- Git repo: github.com/KaranSangoi/physiosthanak

---

## Phase 1: Foundation & SEO Pages [COMPLETED]

### 1A — Core Build
- [x] Next.js 16 project setup with App Router
- [x] TypeScript + Tailwind CSS 4 configuration
- [x] 11 service categories with conditions
- [x] 4 service areas + 64 sub-areas with unique SEO content
- [x] All reusable components (Hero, Benefits, Why, FAQ, CTA, Map, Booking)
- [x] SEO: sitemap.xml, robots.txt, JSON-LD FAQ schema, breadcrumbs schema
- [x] Dynamic routing with generateStaticParams
- [x] Brand colors (#14507c blue, #e8899c pink) and tagline
- [x] Deployed to Vercel

### 1B — Design & Branding
- [x] Poppins + Inter fonts (Google Fonts)
- [x] Dark hero section with gradient overlay
- [x] Uppercase headings with tracking
- [x] Pink brand buttons (btn-primary, btn-outline)
- [x] Logo in header (horizontal) and footer (stacked)
- [x] Favicon, apple-touch-icon, site.webmanifest
- [x] OG image for social sharing
- [x] Responsive design for all breakpoints
- [x] Social links (Instagram, LinkedIn) in footer
- [x] "Created by Karan Sangoi" credit in footer

### 1C — Integrations
- [x] GA4 analytics (G-5M0KHWWZ42)
- [x] Google Search Console connected + sitemap submitted
- [x] Web3Forms lead capture → email to physiosthanak@gmail.com
- [x] Google Calendar booking (opens in new tab after form submit)
- [x] Featurable Google Reviews widget
- [x] Organization + AggregateRating JSON-LD schema

### 1D — Legal & Compliance
- [x] Privacy Policy page (/privacy)
- [x] Terms of Service page (/terms)
- [x] Image optimization (AVIF + WebP)
- [x] Viewport meta tag

---

## Phase 2: Content & Features [NEXT]

### 2A — New Pages
- [ ] **About page** for Dr. Shiva (high priority — builds trust)
- [ ] **Online Physiotherapy** as 12th service category
- [ ] **FAQ hub page** compiling top questions
- [ ] **MedicalBusiness schema** markup on relevant pages

### 2B — Booking Upgrade
- [ ] Migrate to Cal.com (free tier, 1 user)
- [ ] Connect Razorpay for consultation payments
- [ ] 20-minute slot configuration
- [ ] Google Calendar sync for availability
- **Note**: See memory file `project_cal_migration.md`

### 2C — Content Review
- [ ] Content review by Dr. Shiva for medical accuracy
- [ ] Verify all condition names, descriptions, FAQs
- [ ] Remove any inaccurate service claims

---

## Phase 3: Scale SEO Pages

### 3A — Location-Service Cross Products
- [ ] Build `/service-areas/[area]/[subarea]/[service]` route
- [ ] Creates 320-840 pages (64 sub-areas x 5-13 services)
- [ ] Template: "{Service} in {SubArea}, {Area} | PhysioSthanak"
- [ ] Content: localized service page with area-specific details

### 3B — Blog / Content Marketing
- [ ] Blog section with MDX or headless CMS
- [ ] Blog post template following SEO SOP
- [ ] Categories: Exercises, Tips, Conditions, Patient Stories
- **Decision needed**: MDX vs Headless CMS (Sanity/Strapi)

### 3C — Monitor & Optimize
- [ ] Monitor GSC for 2-4 weeks — identify pages getting impressions
- [ ] Optimize titles/descriptions of pages with impressions but low CTR
- [ ] Build Phase 3 cross-product pages for winning keywords
- [ ] Target: 400+ indexed pages within 3 months

---

## Phase 4: Monetization & Growth

### 4A — Online Payments
- [ ] Razorpay integration for consultation fees
- [ ] Package/plan pages with pricing

### 4B — Lead Magnets
- [ ] Free exercise guides (PDF downloads)
- [ ] Email capture before download
- [ ] Landing pages for each lead magnet

### 4C — WhatsApp Automation
- [ ] Twilio/WhatsApp Business API for automated lead notifications
- [ ] Pre-filled WhatsApp messages on form submit

### 4D — Patient Portal (Future)
- [ ] Login for returning patients
- [ ] Exercise tracking
- [ ] Appointment history
- **Stack**: Supabase Auth + DB

---

## SEO Milestones
1. [x] 108 pages live
2. [x] Google Search Console connected + sitemap submitted
3. [ ] Monitor for 2-4 weeks — identify pages getting impressions
4. [ ] Optimize titles/descriptions of pages with low CTR
5. [ ] Build Phase 3 cross-product pages
6. [ ] Target: 400+ indexed pages within 3 months
