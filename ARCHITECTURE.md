# PhysioSthanak - Architecture Guide

## Project Structure
```
physiosthanak/
├── public/                          # Static assets (logos, favicon, images)
├── src/
│   ├── app/                         # Next.js App Router pages
│   │   ├── page.tsx                 # Homepage
│   │   ├── layout.tsx               # Root layout (meta, header, footer)
│   │   ├── globals.css              # CSS variables, Tailwind base, utility classes
│   │   ├── contact/page.tsx         # Contact page with booking form
│   │   ├── services/
│   │   │   ├── page.tsx             # Services overview (lists all 11 categories)
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx         # Dynamic service category page
│   │   │   │   └── [condition]/
│   │   │   │       └── page.tsx     # Dynamic condition page
│   │   ├── service-areas/
│   │   │   ├── page.tsx             # Areas overview (lists 4 areas)
│   │   │   ├── [area]/
│   │   │   │   ├── page.tsx         # Dynamic area page (shows sub-areas)
│   │   │   │   └── [subarea]/
│   │   │   │       └── page.tsx     # Dynamic sub-area page
│   │   ├── sitemap.ts               # Dynamic sitemap.xml generation
│   │   └── robots.ts                # robots.txt generation
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Sticky header, service/area dropdowns, mobile menu
│   │   │   └── Footer.tsx           # Footer with links, contact info
│   │   ├── sections/                # Reusable page sections (SEO SOP compliant)
│   │   │   ├── HeroSection.tsx      # H1, description, breadcrumbs, CTAs
│   │   │   ├── BenefitsSection.tsx  # 3 benefit cards
│   │   │   ├── WhySection.tsx       # 3 why-choose-us points
│   │   │   ├── FAQSection.tsx       # Accordion + FAQ JSON-LD schema
│   │   │   ├── CTASection.tsx       # Gradient CTA with dual buttons
│   │   │   ├── MapSection.tsx       # Google Maps embed + description
│   │   │   ├── BookingForm.tsx      # Name, phone, email, service dropdown
│   │   │   ├── ServiceCard.tsx      # Card for service listings
│   │   │   └── AreaCard.tsx         # Card for area listings
│   │   └── ui/
│   │       └── Breadcrumbs.tsx      # Breadcrumb nav + BreadcrumbList schema
│   │
│   ├── data/                        # All content data (no CMS yet)
│   │   ├── site-config.ts           # Business info, phone, address, social links
│   │   ├── services.ts              # Service categories 1-4 with conditions
│   │   ├── services-extended.ts     # Service categories 5-7
│   │   ├── services-extended2.ts    # Service categories 8-9
│   │   ├── services-extended3.ts    # Service categories 10-11 (Women's Health, Hand & Wrist)
│   │   ├── service-areas.ts         # 4 areas with 64 sub-areas
│   │   └── index.ts                 # Central export combining all data
│   │
│   ├── types/index.ts               # TypeScript interfaces
│   └── lib/utils.ts                 # Utility functions (slug lookups, breadcrumbs)
│
├── CLAUDE.md                        # This project's Claude Code guide
├── SEO-SOP.md                       # On-page SEO template
├── ROADMAP.md                       # Development phases
└── ARCHITECTURE.md                  # This file
```

## Data Model

### Service Hierarchy
```
ServiceCategory (11 total)
├── slug, name, description, keywords, metaDescription
├── h1, heroDescription
├── benefits[] (3 items, 35+ words each)
├── whyPoints[] (3 items)
├── faqs[] (3-5 items)
└── conditions[] → ConditionPage[]
    ├── slug, name, parentCategory
    ├── (same SEO fields as category)
    └── (same content sections)
```

### Service Area Hierarchy
```
ServiceArea (4 total: Borivali, Dahisar, Kandivali, Malad)
├── slug, name, description, keywords, metaDescription, h1
└── subAreas[] → SubArea[] (64 total)
    ├── slug, name, parentArea
    └── description, keywords, metaDescription, h1
```

### 11 Service Categories
1. Physiotherapy (General)
2. Home Visit Physiotherapy (3 conditions)
3. Sports Injury Physiotherapy (6 conditions)
4. Back Pain & Spine (5 conditions)
5. Neck Pain & Cervical (4 conditions)
6. Post-Surgery Rehabilitation (6 conditions — includes Post Brachial Plexus Surgery)
7. Neurological Physiotherapy (6 conditions — includes Brachial Plexus Injury)
8. Orthopedic Physiotherapy (4 conditions)
9. Pediatric Physiotherapy (4 conditions)
10. Women's Health Physiotherapy (5 conditions)
11. Hand & Wrist Physiotherapy (7 conditions — includes Carpal Tunnel)

### 4 Service Areas with Sub-Areas
- **Borivali** (22 sub-areas): IC Colony, Daulat Nagar, Shimpoli, Eksar, etc.
- **Dahisar** (15 sub-areas): Dahisar East, Dahisar West, Anand Nagar, etc.
- **Kandivali** (16 sub-areas): Kandivali East, Kandivali West, Lokhandwala, etc.
- **Malad** (11 sub-areas): Malad East, Malad West, Orlem, etc.

**Excluded**: Mira Road, Goregaon (by design choice)

## Static Generation
All dynamic pages use `generateStaticParams()` for SSG:
- `/services/[category]` → 11 pages
- `/services/[category]/[condition]` → ~50 pages
- `/service-areas/[area]` → 4 pages
- `/service-areas/[area]/[subarea]` → 64 pages

## Key Utilities (src/lib/utils.ts)
- `getServiceBySlug(slug)` → finds a service category
- `getConditionBySlug(categorySlug, conditionSlug)` → finds a condition
- `getAreaBySlug(slug)` → finds a service area
- `getSubAreaBySlug(areaSlug, subAreaSlug)` → finds a sub-area
- `getAllServiceSlugs()` → all category slugs
- `getAllAreaSlugs()` → all area slugs
- `generateBreadcrumbs(segments)` → breadcrumb array
- `formatPhoneNumber(phone)` → formatted display
