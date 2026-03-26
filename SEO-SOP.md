# PhysioSthanak - On-Page SEO SOP

Every page on the site MUST follow this template. No exceptions.

## Page Structure (Top to Bottom)

### 1. Meta Tags
- **Title**: `{Service/Condition} in {Location} | PhysioSthanak` (under 60 chars)
- **Meta Description**: Exactly 155 characters. Must include primary keyword + location + CTA
- **Keywords**: 5-8 relevant long-tail keywords

### 2. Breadcrumbs
- Must include BreadcrumbList JSON-LD schema markup
- Format: Home > Services > Category > Condition (or Home > Service Areas > Area > Sub-Area)
- Component: `src/components/ui/Breadcrumbs.tsx`

### 3. Hero Section
- **H1 Tag**: Must contain primary keyword + location (e.g., "Sports Physiotherapy in Borivali")
- **Hero Description**: 35-40 words. Concise, keyword-rich summary
- **CTA Buttons**: "Book Appointment" + "Call Now" (or WhatsApp)
- Component: `src/components/sections/HeroSection.tsx`

### 4. Benefits Section
- **H2 heading**: "Benefits of {Service} in {Location}"
- **3 benefit cards** minimum
- Each benefit description: **35+ words** (this is critical for content depth)
- Component: `src/components/sections/BenefitsSection.tsx`

### 5. Why Choose Us Section
- **H2 heading**: "Why Choose PhysioSthanak for {Service}?"
- **3 why points** minimum
- Focus on: Dr. Shiva's credentials, clinic USPs, patient outcomes
- Component: `src/components/sections/WhySection.tsx`

### 6. FAQ Section
- **H2 heading**: "Frequently Asked Questions"
- **3-5 FAQs** per page
- **MUST include FAQ JSON-LD schema markup** (already built into FAQSection component)
- Questions should target "People Also Ask" keywords
- Component: `src/components/sections/FAQSection.tsx`

### 7. Map Section
- Google Maps embed for clinic location
- **50+ word description** of the area/directions
- Component: `src/components/sections/MapSection.tsx`

### 8. CTA Section
- Gradient background
- Dual CTAs: Book Appointment + Call/WhatsApp
- Component: `src/components/sections/CTASection.tsx`

## Mandatory Link Rules
- **1 external link per page**: To a government or Wikipedia source (e.g., Wikipedia article on the condition, NIH reference)
- **1 internal link per page**: Back to homepage or parent category

## Schema Markup
- FAQ schema on every page with FAQs (automatic via FAQSection)
- BreadcrumbList schema on every page (automatic via Breadcrumbs component)
- LocalBusiness schema on homepage
- MedicalBusiness schema (future enhancement)

## Content Guidelines
- Write for patients, not doctors — simple language
- Include the primary keyword naturally 3-5 times in body content
- Every condition page should mention: what it is, symptoms, how physio helps, expected outcomes
- Location pages should mention: nearby landmarks, how to reach, areas served

## URL Structure
```
/services/{category-slug}                    → Service category page
/services/{category-slug}/{condition-slug}   → Condition page
/service-areas/{area-slug}                   → Area page
/service-areas/{area-slug}/{subarea-slug}    → Sub-area page
```

## Page Count Targets
- Core pages: 9
- Service categories: 11
- Conditions: 50
- Service areas: 4
- Sub-areas: 64
- **Phase 1 Total: ~97 pages (currently live)**
- Location-service cross-products: 320-840 pages (Phase 3)
- **Full Build Target: 767+ pages**
