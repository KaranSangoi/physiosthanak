# PhysioSthanak — Mat Pilates Classes (v1 Implementation Plan)

## Overview
Add Mat Pilates classes (online + offline batches) to PhysioSthanak website. This is a new revenue stream under the PhysioSthanak brand, led by Dr. Shiva Jain Sangoi.

**URL**: `/pilates` (landing page) + `/pilates/register` (form, or inline on landing page — your call)
**Admin**: `/admin/pilates` (protected route)

---

## Core USP — Use This in All Copy

This is **Physiotherapist-Led Pilates** — NOT generic fitness instruction. The key differentiator:

> Every student receives a **free physiotherapy consultation** before starting classes. Dr. Shiva personally conducts a **clinical biomechanical assessment** — evaluating posture, joint mobility, muscle imbalances, and any existing injuries or conditions. Based on this medical-grade evaluation, your Pilates program is **customized to your body's specific needs**. This means even in a group class, you get a personalized, almost 1-on-1 experience — because your exercises are tailored by someone who understands human anatomy at a clinical level, not just a fitness certification level.

**Messaging pillars to hit on the landing page:**
1. Led by a qualified physiotherapist (MPTh Ortho, FIFA certified), not a generic instructor
2. Free physiotherapy consultation + biomechanical assessment before you start
3. Classes customized to YOUR body — injuries, posture issues, limitations accounted for
4. Medical-grade understanding of biomechanics = safer, more effective practice
5. Mat Pilates only (online + offline batches available)

---

## Landing Page (`/pilates`)

### Sections (top to bottom):

1. **Hero**
   - Headline: Something around "Physiotherapist-Led Mat Pilates in Borivali" (SEO + USP)
   - Subheadline: Free consultation. Biomechanical assessment. Classes customized to your body.
   - CTA button: "Register Now" (scrolls to form or goes to /pilates/register)
   - Background: Use brand colors (#14507c deep blue + #e8899c pink)

2. **Why PhysioSthanak Pilates is Different**
   - Expand on the USP points above
   - Compare subtly: "Most Pilates instructors have a fitness certification. Your instructor has a Master's in Physiotherapy and 9+ years of clinical experience treating 8000+ patients."
   - Mention: posture correction, injury prevention, rehab-friendly, safe for all ages

3. **How It Works**
   - Step 1: Register (fill the form)
   - Step 2: Free Physiotherapy Consultation (body assessment by Dr. Shiva)
   - Step 3: Join Your Batch (customized exercises based on your assessment)

4. **Available Batches**
   - Show all active batches dynamically from database
   - Display: batch name, schedule (days + time), online/offline tag, spots remaining
   - If batch is full: show "Batch Full — Join Waitlist" instead of spots count
   - This section should feel alive — real-time spots remaining creates urgency

5. **About Dr. Shiva** (short)
   - Photo, credentials (MPTh Ortho, BPTh, FIFA Diploma in Football Medicine)
   - 9+ years experience, 8000+ cases
   - Link to full About page (when it exists)

6. **Registration Form** (inline on same page OR separate route — your call)
   - See form spec below

7. **FAQ**
   - With JSON-LD schema markup (same pattern as other pages)
   - Questions: What is Mat Pilates? Who can join? What happens in the consultation? Online vs offline? What to wear? etc.

8. **CTA**
   - Final push: "Start Your Pilates Journey Today"

---

## Registration Form

### Fields:
1. **Name** — text, required
2. **Phone** — tel, required (Indian mobile validation: 10 digits)
3. **Email** — email, required
4. **Age** — number, required
5. **Preference** — radio/toggle: Online / Offline, required
6. **Batch Selection** — dropdown/cards, dynamically populated based on preference selection
   - Only show batches matching selected preference (online/offline)
   - Only show batches with available spots
   - If ALL batches for their preference are full → show "Join Waitlist" option instead
7. **Medical History / Message** — textarea, optional — "Any injuries, conditions, or anything you'd like us to know?"
8. **Submit button** — "Register for Pilates"

### Form Submission:
- Use **Web3Forms** (same as existing contact form, key: `97e35895-6350-4c20-982e-f2fdb1996900`)
- On submit:
  - Send form data to Web3Forms → email notification to admin (physiosthanak@gmail.com)
  - Also save to **Supabase** `pilates_registrations` table (for admin panel tracking)
  - Show success message: "Thanks for registering! You'll receive a call to schedule your free physiotherapy consultation."
  - If waitlisted: "You've been added to the waitlist. We'll contact you when a spot opens."

### Form UX:
- When user selects Online/Offline, batch options animate in
- Show batch schedule + spots remaining in the selection UI
- Disable/grey out full batches (don't hide them — show "Full" badge)

---

## Database Schema (Supabase)

### Table: `pilates_batches`
```sql
CREATE TABLE pilates_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                    -- e.g., "Morning Batch - Mon/Wed/Fri"
  type TEXT NOT NULL CHECK (type IN ('online', 'offline')),
  schedule TEXT NOT NULL,                -- e.g., "Mon, Wed, Fri — 7:00 AM to 8:00 AM"
  capacity INTEGER NOT NULL,            -- max students
  current_count INTEGER DEFAULT 0,      -- auto-updated on registration
  is_active BOOLEAN DEFAULT true,       -- admin can deactivate
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `pilates_registrations`
```sql
CREATE TABLE pilates_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES pilates_batches(id),  -- NULL if waitlisted
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  preference TEXT NOT NULL CHECK (preference IN ('online', 'offline')),
  medical_history TEXT,                  -- optional
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'confirmed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial')),
  consultation_status TEXT DEFAULT 'pending' CHECK (consultation_status IN ('pending', 'scheduled', 'done')),
  notes TEXT,                            -- admin notes
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `pilates_admin_settings`
```sql
CREATE TABLE pilates_admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- Seed data:
INSERT INTO pilates_admin_settings (key, value) VALUES
  ('notification_emails', 'physiosthanak@gmail.com'),
  ('waitlist_enabled', 'true');
```

### Row Level Security (RLS):
- `pilates_batches`: Public READ (for landing page to show batches), Admin WRITE
- `pilates_registrations`: Public INSERT (form submission), Admin READ/WRITE
- `pilates_admin_settings`: Admin only

### Database Function for Auto-Cutoff:
```sql
-- Increment batch count on new registration, prevent over-capacity
CREATE OR REPLACE FUNCTION increment_batch_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.batch_id IS NOT NULL AND NEW.status = 'registered' THEN
    UPDATE pilates_batches
    SET current_count = current_count + 1,
        updated_at = now()
    WHERE id = NEW.batch_id
      AND current_count < capacity;

    IF NOT FOUND THEN
      -- Batch is full, set to waitlisted
      NEW.status := 'waitlisted';
      NEW.batch_id := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_insert
  BEFORE INSERT ON pilates_registrations
  FOR EACH ROW
  EXECUTE FUNCTION increment_batch_count();
```

### Decrement on Cancellation:
```sql
CREATE OR REPLACE FUNCTION decrement_batch_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'registered' AND NEW.status = 'cancelled' AND OLD.batch_id IS NOT NULL THEN
    UPDATE pilates_batches
    SET current_count = current_count - 1,
        updated_at = now()
    WHERE id = OLD.batch_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_cancel
  BEFORE UPDATE ON pilates_registrations
  FOR EACH ROW
  EXECUTE FUNCTION decrement_batch_count();
```

---

## Admin Panel (`/admin/pilates`)

### Auth:
- Use Supabase Auth (email/password for now)
- Only authenticated admin users can access `/admin/*` routes
- Start with 1 admin user: physiosthanak@gmail.com

### Pages:

#### 1. Dashboard (`/admin/pilates`)
- Total registrations (this week / all time)
- Batch capacity overview (cards showing each batch with fill %)
- Recent registrations (last 10)

#### 2. Batch Management (`/admin/pilates/batches`)
- List all batches with: name, type, schedule, capacity, current count, status (active/inactive)
- Create new batch: name, type (online/offline), schedule (text), capacity
- Edit batch: all fields editable
- Deactivate batch (soft delete — set is_active = false)
- Cannot delete batch with active registrations

#### 3. Registrations (`/admin/pilates/registrations`)
- Table view of all registrations
- Filters: by batch, by status (registered/waitlisted/confirmed/cancelled), by payment status
- Search: by name, phone, email
- Click to open registration detail

#### 4. Registration Detail (`/admin/pilates/registrations/[id]`)
- View all student info
- Edit: payment_status, consultation_status, notes, batch assignment
- Move to different batch (with capacity check)
- Cancel registration
- Promote from waitlist → assign to batch

#### 5. Waitlist (`/admin/pilates/waitlist`)
- View all waitlisted students
- Promote to batch (select available batch → updates status to 'registered')

#### 6. Settings (`/admin/pilates/settings`)
- Notification email addresses (comma-separated, stored in pilates_admin_settings)

---

## Supabase Setup

### Project:
- Create new Supabase project OR use existing if one exists
- Get: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

### Environment Variables (add to `.env.local` and Vercel):
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Packages to Install:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Implementation Order (Suggested)

### Phase 1: Database + Landing Page (do first)
1. Set up Supabase project + run SQL to create tables, functions, triggers
2. Build `/pilates` landing page with all sections
3. Batch display component (reads from Supabase, shows spots remaining)
4. Registration form with Web3Forms + Supabase dual submission
5. Waitlist logic (if batch full → auto-waitlist)

### Phase 2: Admin Panel
6. Supabase Auth setup (admin login)
7. Admin layout + protected routes
8. Batch management CRUD
9. Registrations list + detail + edit
10. Waitlist management
11. Settings page

### Phase 3: Polish
12. Email templates (if upgrading from Web3Forms later)
13. Mobile responsiveness pass
14. SEO: meta tags, FAQ schema, Open Graph for /pilates
15. Test full flow: register → email → admin sees it → admin manages

---

## Design Notes
- Follow existing PhysioSthanak design system
- Primary: #14507c (deep blue), Accent: #e8899c (pink)
- Fonts: Poppins (headings) + Inter (body)
- Buttons: Pink (#e8899c), uppercase, tracking-wide (btn-primary class)
- Cards: White with subtle shadow, rounded corners
- The landing page should feel premium but approachable — this is healthcare + fitness, not a gym bro page
- Admin panel can be simple/functional — doesn't need to be fancy

---

## What's NOT in v1
- Payment processing (Razorpay) — payments happen offline after consultation
- Automated email via Resend — using Web3Forms for now
- Class scheduling/calendar view — batches are simple text schedules
- Student portal / login — admin manages everything
- Attendance tracking — manual for now
- WhatsApp notifications — can add later

---

## Key Files to Create
```
src/app/pilates/page.tsx              — Landing page
src/app/pilates/components/           — Pilates-specific components
  HeroSection.tsx
  WhyDifferent.tsx
  HowItWorks.tsx
  BatchDisplay.tsx
  RegistrationForm.tsx
  PilatesFAQ.tsx
src/app/admin/layout.tsx              — Admin layout with auth guard
src/app/admin/pilates/page.tsx        — Dashboard
src/app/admin/pilates/batches/page.tsx
src/app/admin/pilates/registrations/page.tsx
src/app/admin/pilates/registrations/[id]/page.tsx
src/app/admin/pilates/waitlist/page.tsx
src/app/admin/pilates/settings/page.tsx
src/lib/supabase/client.ts            — Supabase browser client
src/lib/supabase/server.ts            — Supabase server client
src/lib/supabase/admin.ts             — Supabase service role client
src/types/pilates.ts                  — TypeScript types
```

---

## Notes for Claude Code
- Read `CLAUDE.md` first for project-wide rules and context
- Read `SEO-SOP.md` for the landing page SEO requirements
- Read `ARCHITECTURE.md` for existing codebase patterns
- Discuss approach with Karan before implementing — don't just start coding
- The landing page IS a marketing page — copy quality matters as much as code quality
- Web3Forms key is already in the codebase, reuse the existing form submission pattern
- Supabase is NEW to this project — set it up cleanly with proper types
