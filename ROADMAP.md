# PhysioSthanak - Development Roadmap

## Current State (March 2026)
- Site is LIVE at https://physiosthanak.com
- Hosted on Vercel
- ~97 static pages generated
- Brand colors and tagline updated
- Git repo: github.com/imkaransangoi/physiosthanak

---

## Phase 1: Foundation & SEO Pages [CURRENT]

### 1A — Completed ✅
- [x] Next.js 16 project setup with App Router
- [x] TypeScript + Tailwind CSS 4 configuration
- [x] 11 service categories with 50 conditions
- [x] 4 service areas with 64 sub-areas
- [x] All reusable components (Hero, Benefits, Why, FAQ, CTA, Map, Booking)
- [x] SEO: sitemap.xml, robots.txt, JSON-LD FAQ schema, breadcrumbs schema
- [x] Dynamic routing with generateStaticParams
- [x] Brand colors (#14507c blue, #e8899c pink) and tagline ("Move • Heal • Improve")
- [x] Deployed to Vercel

### 1B — Immediate Next Steps 🔄
- [ ] **Add logo files to public/** — square logo, horizontal logo, icon-only, favicon
- [ ] **Update Header.tsx** to show actual logo image instead of text
- [ ] **Update Footer.tsx** to show logo
- [ ] **Update layout.tsx** with proper favicon references
- [ ] **Add og-image.jpg** (Open Graph image for social sharing)
- [ ] **Content review by Shiva** — verify all condition names, descriptions, FAQs are medically accurate
- [ ] **Google Search Console** — connect domain and submit sitemap
- [ ] **Google Analytics / Tag Manager** — add tracking

### 1C — SEO Content Improvements 🔄
- [ ] Add remaining condition pages (target: 50 total across all categories)
- [ ] Verify every page has: external link (govt/Wikipedia), internal link to homepage
- [ ] Add LocalBusiness JSON-LD schema to homepage
- [ ] Add MedicalBusiness schema markup
- [ ] Improve hero descriptions to exactly 35-40 words where needed
- [ ] Ensure all benefit descriptions are 35+ words

---

## Phase 2: Interactivity & Lead Generation

### 2A — Booking System
- [ ] Email notifications on form submission (Resend API)
- [ ] WhatsApp Business API integration (click-to-chat with pre-filled message)
- [ ] Google Calendar integration for appointment slots
- [ ] Form validation and success/error states
- **Stack**: Resend for email, WhatsApp Business API, existing Google Calendar link

### 2B — Blog / Content CMS
- [ ] Blog section with MDX or headless CMS
- [ ] Blog post template following SEO SOP
- [ ] Categories: Exercises, Tips, Conditions Explained, Patient Stories
- [ ] Blog sitemap integration
- **Decision needed**: MDX files vs Headless CMS (Sanity/Strapi/Contentlayer)

### 2C — Announcement System
- [ ] Popup/banner for announcements (offers, holiday hours, new services)
- [ ] Admin interface to create/edit announcements
- [ ] Schedule-based display (start date, end date)
- **Stack**: Supabase for storage + simple admin UI

---

## Phase 3: Scale SEO Pages

### 3A — Location-Service Cross Products
- [ ] Build `/service-areas/[area]/[subarea]/[service]` route
- [ ] This creates 320-840 pages (64 sub-areas × 5-13 services each)
- [ ] Template: "{Service} in {SubArea}, {Area} | PhysioSthanak"
- [ ] Content: localized version of service page with area-specific details
- [ ] generateStaticParams for all combinations

### 3B — Condition-Location Pages (Optional)
- [ ] `/services/[category]/[condition]/[area]` pages
- [ ] "ACL Injury Treatment in Borivali" style pages
- [ ] Only for high-traffic conditions (based on GSC data)

---

## Phase 4: Monetization & Growth

### 4A — Online Payments
- [ ] Razorpay integration for consultation fees
- [ ] Package/plan pages with pricing
- **Stack**: Razorpay

### 4B — Lead Magnet Store
- [ ] Free exercise guides (PDF downloads)
- [ ] Email capture before download
- [ ] Landing pages for each lead magnet
- **Stack**: Resend for email, Supabase for user data

### 4C — Patient Portal (Future)
- [ ] Login for returning patients
- [ ] Exercise tracking
- [ ] Appointment history
- **Stack**: Supabase Auth + DB

---

## Phase 2 Tech Stack (Agreed)
- **Database**: Supabase (Postgres)
- **Email**: Resend
- **WhatsApp**: WhatsApp Business API
- **Payments**: Razorpay
- **Hosting**: Vercel (already deployed)
- **CMS**: TBD (MDX vs headless CMS)

---

## SEO Milestones
1. ✅ 97 pages live
2. ⬜ Connect Google Search Console + submit sitemap
3. ⬜ Monitor for 2-4 weeks — identify pages getting impressions
4. ⬜ Optimize titles/descriptions of pages with impressions but low CTR
5. ⬜ Build Phase 3 cross-product pages for winning keywords
6. ⬜ Target: 400+ indexed pages within 3 months
