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

---

## Digital Clinical Assessment System

This is a full clinical assessment and progress tracking system built into the admin panel. Based on PhysioSthanak's existing Google Sheets assessment form (APPI framework). Team fills these out digitally per student. PDFs are generated and sent to patients.

**Reference**: The original Google Sheets form is at:
https://docs.google.com/spreadsheets/d/1cu6a69tcOXEyOAwYywYJbKWzgBENTsaPfQnq9djCAhg/edit

### Initial Assessment Form (Front + Back combined)

A multi-section digital form filled out during the student's free physiotherapy consultation. Sections:

#### Section 1: Client Details
- Name, Age/DOB, Gender, Contact, Date
- Occupation, Ref. by
- Emergency Contact + Relation

#### Section 2: History of Presenting Complaint (HOPC)
- Free-text area for chief complaints and history

#### Section 3: Past Medical History + Medications/Supplements
- Two text areas side by side

#### Section 4: Special Questions / Red Flags
- Checkboxes: Unexplained weight loss, Night pain/rest pain, Bladder/bowel changes, Cardiac/respiratory issues, Recent surgery/fracture, Pregnancy/postnatal, Other (text)

#### Section 5: Current Activity Level + Lifestyle/Social
- Activity level: Sedentary / Light / Moderate / Active (radio)
- Exercise type (text)
- Hrs sitting/day, Sleep, Stress level (Low/Med/High), Smoking (Y/N)

#### Section 6: Pain Assessment
- Location (text), VAS 0-10 (slider or number), Duration
- Nature: Sharp / Dull / Burning / Aching / Shooting (checkboxes)
- Frequency: Constant / Intermittent (radio)
- Aggravating factors (text), Easing factors (text)

#### Section 7: Posture Assessment + Body Map
- Text fields for: Anterior view, Lateral view, Posterior view findings
- Key findings checkboxes: Forward head, Round shoulders, Kyphosis, Lordosis, Scoliosis, Pelvic tilt
- **BODY MAP COMPONENT** (see detailed spec below)

#### Section 8: Spinal ROM
- Table grid: Cervical / Thoracic / Lumbar rows × Flexion / Extension / R LF / L LF / R Rot / L Rot / Pain? columns
- Each cell: text input for measurement + pain checkbox

#### Section 9: Muscle Length & Functional Tests
- Pairs of tests with text input for findings:
  - Clearing squat / Quads length
  - Single knee bend / Glute-piriformis length
  - Single calf raise / Hamstring length
  - Thomas test (hip flexor) / Scapulo-humeral rhythm
  - SLR + DF / Single leg balance

#### Section 10: Additional Orthopaedic / Neuro Tests
- Free-text area for any special tests performed

#### Section 11: APPI 5 Key Elements Assessment
- 6 elements, each rated: Unable / With cues / Independent
  1. Breathing (Lateral Thoracic)
  2. Centering (TA + PF + Multifidus)
  3. Ribcage Placement
  4. Shoulder Blade Placement
  5. Head & Neck Placement
  6. Double Tabletop Prep
- Notes column for each

#### Section 12: Movement Dissociation & Control
- 6 exercises, each rated: Good / Fair / Poor
  - Scissors, Heel Slides/One Leg Stretch, Hip Twist/Rotation
  - Shoulder Bridge, Clam Shells, Overhead Arms

#### Section 13: Functional Assessment
- Sit-to-Stand quality: Good / Fair / Poor
- Standing balance (sec): R___ L___
- Gait pattern: Normal / Antalgic / Other
- Core endurance (sec): Front___ Side R___ Side L___

#### Section 14: Muscle Sling Assessment (APPI)
- 4 slings, each rated: Good / Weak / Dysfunctional
  - Anterior Oblique Sling
  - Posterior Oblique Sling
  - Lateral Sling
  - Posterior Longitudinal

#### Section 15: Main Findings / Clinical Impression
- Free-text area for therapist's clinical summary

#### Section 16: Goals
- **Short Term Goals (4-6 weeks)**: 1-3 numbered goals (therapist sets)
- **Long Term Goals (3-6 months)**: 1-3 numbered goals (therapist sets)
- **Patient's Own Goals**: Free-text area — what the patient personally wants to achieve (e.g., "I want to touch my toes", "Run without knee pain", "Better posture at desk"). This is SEPARATE from clinical goals. Captures the patient's voice and motivation.

#### Section 17: Recommended Level & Programme
- Starting Level: Rehab / Beginner / Intermediate / Advanced (radio)
- Mode: Online / Offline / 1:1 / Group (checkboxes)
- Batch: select from active batches (dropdown)
- Frequency: ___x / week
- Duration: 45 min (default)
- Review: ___ weeks
- Batch days: Mon-Thu / Tue-Fri (or custom)

#### Section 18: Programme Notes / Precautions / Modifications
- Free-text area for specific exercise modifications, contraindications, precautions

#### Section 19: Information Sheets / Education Provided
- Checkboxes: What is Pilates?, APPI 5 Key Elements, Centering guide, Beginner home exercises, Breathing techniques, Posture awareness, Condition-specific info, Other (text)

#### Section 20: Consent & Signatures
- Consent text: "I understand the nature of Pilates exercise and consent to participate. I have disclosed all relevant medical information accurately."
- Client Signature (can be typed name for digital v1)
- Therapist name
- Date + Next review date

---

### Progress Assessment / Level-Up Checklist

Filled out periodically (every 8-12 sessions, or at end of each level). Multiple progress assessments per student over time.

#### Section 1: Client & Level Info
- Name (auto-filled from student record)
- Date, Session #
- Current Level: Rehab / Beginner / Intermediate / Advanced
- Weeks at level

#### Section 2: APPI 5 Key Elements Re-Assessment
- Table: Element | Initial (from first assessment, auto-filled) | Current | Rating (✓/✓/□/~/□/✗)
- 6 elements: Breathing, Centering, Ribcage, Shoulder, Head & Neck, Double Tabletop
- Notes column

#### Section 3: Exercise Competency Checklist
- Table: Exercise | Form (Good/Fair/Poor) | Control (G/F/P) | Endurance (G/F/P) | Pass? (Yes/No)
- 9 exercises:
  1. Pelvic Curl / Bridge (segmental)
  2. Dead Bug (opposite arm & leg)
  3. Bird Dog (quadruped)
  4. Abdominal Prep
  5. Side-Lying Series (clam + abduction)
  6. Half Roll Up Breast Stroke
  7. Standing Single Leg Balance (15s)
  8. Sit-to-Stand (controlled)
  9. Side Plank Prep (knees)

#### Section 4: Outcome Measures
- Pain VAS (0-10): Initial___ Now___ Change___
- Balance (sec): Initial R___ L___ | Now R___ L___
- Core hold (sec): Initial___ Now___
- Client satisfaction: Very Happy / Happy / Neutral / Needs Improvement

#### Section 5: Progression Decision
- Options (radio):
  - ☐ PROGRESS to next level → Next level: Beginner / Intermediate / Advanced
  - ☐ REPEAT current level for ___ more weeks → Reason:
  - ☐ MODIFY programme (specific needs) → Details:

#### Section 6: Therapist Notes & Next Level Focus Areas
- Free-text area

#### Section 7: Sign-off
- Therapist name, Date, Next review date

---

### Body Map Component (Option C — Hybrid Clickable)

**What it is**: An interactive SVG body map with front, back, and side (lateral) views. Team clicks on body regions to add clinical markers. All data is structured (stored as JSON), but rendered visually.

**How it works**:
1. Three SVG body outlines displayed side by side: Front / Back / Side (right lateral)
2. Body is divided into clickable regions (approx 30-40 zones):
   - Head/Face, Neck (anterior/posterior), R/L Shoulder, R/L Upper Arm, R/L Elbow, R/L Forearm, R/L Wrist/Hand
   - Chest, Upper Back, Mid Back, Lower Back/Lumbar, Abdomen
   - R/L Hip, R/L Thigh (anterior/posterior), R/L Knee, R/L Shin/Calf, R/L Ankle/Foot
3. On click → popup/modal:
   - Issue type (select): Pain / Tightness / Weakness / Swelling / Numbness/Tingling / Instability / Other
   - Severity (select): Mild / Moderate / Severe
   - Note (text, optional): e.g., "radiating to elbow"
4. Marker appears on body as colored pin/dot:
   - Red = Pain, Orange = Tightness, Yellow = Weakness, Blue = Swelling, Purple = Numbness, Grey = Other
   - Size varies by severity (small/medium/large)
5. Existing markers can be clicked to edit or remove
6. Body map can be used in both Initial Assessment AND Progress Assessment
7. In progress assessments: option to show initial markers (faded) alongside current markers for visual comparison

**Data storage** (JSONB in Supabase):
```json
{
  "markers": [
    {
      "id": "m1",
      "view": "front",
      "region": "right_shoulder",
      "x": 0.35,
      "y": 0.22,
      "type": "pain",
      "severity": "moderate",
      "note": "Impingement suspected"
    },
    {
      "id": "m2",
      "view": "back",
      "region": "lower_back",
      "x": 0.50,
      "y": 0.48,
      "type": "tightness",
      "severity": "mild",
      "note": ""
    }
  ]
}
```

**SVG source**: Create clean, gender-neutral body outline SVGs. Simple line art, no detail — just enough to identify body regions. Use the PhysioSthanak teal/blue color for the outline. Markers overlay on top.

**PDF rendering**: Body map renders as a static image in the PDF with all markers and a legend showing the color coding.

---

### Assessment Database Schema (Additional Tables)

#### Table: `pilates_assessments`
```sql
CREATE TABLE pilates_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES pilates_registrations(id),
  type TEXT NOT NULL CHECK (type IN ('initial', 'progress')),
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_number INTEGER,                    -- for progress assessments
  assessor_name TEXT NOT NULL,               -- therapist who conducted it

  -- Section: Client details (initial only, most pulled from registration)
  gender TEXT,
  occupation TEXT,
  referred_by TEXT,
  emergency_contact TEXT,
  emergency_relation TEXT,

  -- Section: HOPC
  presenting_complaint TEXT,

  -- Section: Medical History
  past_medical_history TEXT,
  medications_supplements TEXT,

  -- Section: Red Flags (JSONB for flexibility)
  red_flags JSONB DEFAULT '{}',
  -- e.g., {"weight_loss": false, "night_pain": true, "bladder_bowel": false, ...}

  -- Section: Activity Level & Lifestyle
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active')),
  exercise_type TEXT,
  sitting_hours TEXT,
  sleep_quality TEXT,
  stress_level TEXT CHECK (stress_level IN ('low', 'medium', 'high')),
  smoking TEXT CHECK (smoking IN ('yes', 'no')),

  -- Section: Pain Assessment
  pain_location TEXT,
  pain_vas INTEGER CHECK (pain_vas >= 0 AND pain_vas <= 10),
  pain_duration TEXT,
  pain_nature JSONB DEFAULT '[]',            -- ["sharp", "burning"]
  pain_frequency TEXT CHECK (pain_frequency IN ('constant', 'intermittent')),
  pain_aggravating TEXT,
  pain_easing TEXT,

  -- Section: Posture Assessment
  posture_anterior TEXT,
  posture_lateral TEXT,
  posture_posterior TEXT,
  posture_key_findings JSONB DEFAULT '[]',   -- ["forward_head", "kyphosis", ...]

  -- Section: Body Map (Option C markers)
  body_map JSONB DEFAULT '{"markers": []}',

  -- Section: Spinal ROM (JSONB table data)
  spinal_rom JSONB DEFAULT '{}',
  -- e.g., {"cervical": {"flexion": "45°", "extension": "30°", ..., "pain": true}, ...}

  -- Section: Muscle Length & Functional Tests
  muscle_tests JSONB DEFAULT '{}',
  -- e.g., {"clearing_squat": "Good", "thomas_test": "Tight R", ...}

  -- Section: Additional Ortho/Neuro Tests
  additional_tests TEXT,

  -- Section: APPI 5 Key Elements
  appi_elements JSONB DEFAULT '{}',
  -- e.g., {"breathing": {"rating": "with_cues", "notes": ""}, ...}

  -- Section: Movement Dissociation & Control
  movement_control JSONB DEFAULT '{}',
  -- e.g., {"scissors": "good", "shoulder_bridge": "fair", ...}

  -- Section: Functional Assessment
  functional_assessment JSONB DEFAULT '{}',
  -- e.g., {"sit_to_stand": "good", "balance_r": "15s", "balance_l": "12s", ...}

  -- Section: Muscle Sling Assessment
  muscle_slings JSONB DEFAULT '{}',
  -- e.g., {"anterior_oblique": "good", "posterior_oblique": "weak", ...}

  -- Section: Clinical Impression
  clinical_impression TEXT,

  -- Section: Goals
  short_term_goals TEXT[],                   -- array of goal strings
  long_term_goals TEXT[],                    -- array of goal strings
  patient_own_goals TEXT,                    -- patient's personal goals in their own words

  -- Section: Recommended Programme (initial assessment)
  starting_level TEXT CHECK (starting_level IN ('rehab', 'beginner', 'intermediate', 'advanced')),
  mode JSONB DEFAULT '[]',                   -- ["online", "group"]
  assigned_batch_id UUID REFERENCES pilates_batches(id),
  frequency TEXT,                            -- e.g., "3x / week"
  duration TEXT DEFAULT '45 min',
  review_weeks INTEGER,
  batch_days TEXT,                           -- e.g., "Mon-Thu"

  -- Section: Programme Notes
  programme_notes TEXT,

  -- Section: Information Sheets Provided
  info_sheets_provided JSONB DEFAULT '[]',   -- ["what_is_pilates", "centering_guide", ...]

  -- Section: Consent
  consent_given BOOLEAN DEFAULT false,
  client_signature TEXT,                     -- typed name for digital v1

  -- Section: Progress Assessment specific fields
  current_level TEXT CHECK (current_level IN ('rehab', 'beginner', 'intermediate', 'advanced')),
  weeks_at_level INTEGER,
  appi_reassessment JSONB DEFAULT '{}',      -- initial vs current comparison
  exercise_competency JSONB DEFAULT '{}',    -- 9 exercises with form/control/endurance/pass
  outcome_measures JSONB DEFAULT '{}',       -- pain_vas, balance, core_hold with initial/current
  client_satisfaction TEXT CHECK (client_satisfaction IN ('very_happy', 'happy', 'neutral', 'needs_improvement')),
  progression_decision TEXT CHECK (progression_decision IN ('progress', 'repeat', 'modify')),
  next_level TEXT,
  repeat_weeks INTEGER,
  modify_details TEXT,
  therapist_notes TEXT,
  next_review_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast student lookups
CREATE INDEX idx_assessments_student ON pilates_assessments(student_id);
CREATE INDEX idx_assessments_type ON pilates_assessments(type);
```

### RLS for Assessments:
- `pilates_assessments`: Admin READ/WRITE only (no public access — clinical data)

---

### PDF Report Generation

**Tech**: Use a server-side PDF library (e.g., `@react-pdf/renderer` for React-based PDF templates, or `puppeteer` for HTML-to-PDF if more design control needed).

**Recommended**: `@react-pdf/renderer` — lets you build PDF templates in React/JSX, works server-side in Next.js API routes.

```bash
npm install @react-pdf/renderer
```

**PDF Template Structure**:

#### Initial Assessment PDF:
- **Header**: PhysioSthanak logo, "Mat Pilates — Initial Assessment Report", date
- **Client Info**: Name, age, contact, batch info
- **Clinical Summary**: HOPC, medical history, red flags
- **Pain Assessment**: Location, VAS score, nature, frequency
- **Body Map**: Rendered SVG with markers + color legend
- **Posture Findings**: Key findings listed with descriptions
- **ROM Summary**: Table format
- **APPI Assessment**: Visual rating (icons or colored bars)
- **Clinical Impression**: Therapist's summary
- **Goals**: Short-term, long-term, AND patient's own goals
- **Recommended Programme**: Level, mode, batch, frequency
- **Footer**: PhysioSthanak branding, contact, next review date

#### Progress Report PDF:
- **Header**: Same branding + "Progress Assessment — Session #X"
- **Comparison Summary**: Key metrics Initial vs Current (pain VAS, balance, core hold)
- **Body Map Comparison**: Side-by-side initial vs current body maps
- **APPI Progress**: Initial vs Current ratings with visual indicators (↑ improved, → same, ↓ declined)
- **Exercise Competency**: Pass/fail checklist
- **Client Satisfaction**: Rating
- **Progression Decision**: Next steps
- **Updated Goals**: If any
- **Footer**: Same

**PDF Actions in Admin**:
- "Generate PDF" button on any assessment detail page
- "Download PDF" — downloads locally
- "Email PDF to Patient" — sends branded email with PDF attachment (future: when email system is upgraded)

---

## Implementation Order (Suggested)

### Phase 1: Database + Landing Page (do first)
1. Set up Supabase project + run SQL to create ALL tables (batches, registrations, admin_settings, assessments)
2. Build `/pilates` landing page with all sections
3. Batch display component (reads from Supabase, shows spots remaining)
4. Registration form with Web3Forms + Supabase dual submission
5. Waitlist logic (if batch full → auto-waitlist)

### Phase 2: Admin Panel — Batch & Registration Management
6. Supabase Auth setup (admin login)
7. Admin layout + protected routes
8. Batch management CRUD
9. Registrations list + detail + edit
10. Waitlist management
11. Settings page

### Phase 3: Digital Assessment System
12. Body Map SVG component (front/back/side outlines + clickable regions + markers)
13. Initial Assessment form (all 20 sections as a multi-step form with save progress)
14. Progress Assessment form (with auto-populated initial data for comparison)
15. Assessment list per student (timeline view)
16. Assessment detail view

### Phase 4: PDF Reports
17. PDF template — Initial Assessment Report
18. PDF template — Progress Report (with comparison data)
19. Body map SVG-to-image conversion for PDF
20. Generate + Download PDF from admin
21. (Future) Email PDF to patient

### Phase 5: Polish
22. Mobile responsiveness pass (especially admin forms — team may use tablet)
23. SEO: meta tags, FAQ schema, Open Graph for /pilates
24. Test full flow end-to-end
25. Body map comparison view (initial vs progress overlay)

---

## Design Notes
- Follow existing PhysioSthanak design system
- Primary: #14507c (deep blue), Accent: #e8899c (pink)
- Fonts: Poppins (headings) + Inter (body)
- Buttons: Pink (#e8899c), uppercase, tracking-wide (btn-primary class)
- Cards: White with subtle shadow, rounded corners
- The landing page should feel premium but approachable — this is healthcare + fitness, not a gym bro page
- Admin panel should be clean and functional — forms should be easy to fill quickly during a consultation
- Assessment form should be a multi-step wizard (not one giant page) — with section tabs/progress indicator
- Body map should work well on both desktop and tablet (touch-friendly click targets)
- PDF reports should look premium and branded — this is what patients see and share

---

## What's NOT in v1
- Payment processing (Razorpay) — payments happen offline after consultation
- Automated email via Resend — using Web3Forms for now
- Class scheduling/calendar view — batches are simple text schedules
- Student portal / login — admin manages everything
- Attendance tracking — manual for now
- WhatsApp notifications — can add later
- Digital signatures (drawing) — typed name for now
- Photo upload for posture (future enhancement)

---

## Key Files to Create
```
src/app/pilates/page.tsx                          — Landing page
src/app/pilates/components/                       — Pilates-specific components
  HeroSection.tsx
  WhyDifferent.tsx
  HowItWorks.tsx
  BatchDisplay.tsx
  RegistrationForm.tsx
  PilatesFAQ.tsx

src/app/admin/layout.tsx                          — Admin layout with auth guard
src/app/admin/login/page.tsx                      — Admin login
src/app/admin/pilates/page.tsx                    — Dashboard
src/app/admin/pilates/batches/page.tsx            — Batch management
src/app/admin/pilates/registrations/page.tsx      — Registrations list
src/app/admin/pilates/registrations/[id]/page.tsx — Registration detail
src/app/admin/pilates/waitlist/page.tsx           — Waitlist management
src/app/admin/pilates/settings/page.tsx           — Settings

src/app/admin/pilates/students/[id]/page.tsx              — Student profile + assessment history
src/app/admin/pilates/students/[id]/assess/page.tsx       — New initial assessment form
src/app/admin/pilates/students/[id]/progress/page.tsx     — New progress assessment form
src/app/admin/pilates/students/[id]/assessments/[aid]/page.tsx — View assessment detail
src/app/admin/pilates/students/[id]/assessments/[aid]/pdf/route.ts — Generate PDF API route

src/components/admin/assessment/                  — Assessment form components
  AssessmentWizard.tsx                            — Multi-step form wrapper
  ClientDetailsSection.tsx
  HOPCSection.tsx
  MedicalHistorySection.tsx
  RedFlagsSection.tsx
  ActivityLifestyleSection.tsx
  PainAssessmentSection.tsx
  PostureAssessmentSection.tsx
  BodyMapComponent.tsx                            — Interactive SVG body map
  SpinalROMSection.tsx
  MuscleLengthSection.tsx
  APPIElementsSection.tsx
  MovementControlSection.tsx
  FunctionalAssessmentSection.tsx
  MuscleSlingSection.tsx
  ClinicalImpressionSection.tsx
  GoalsSection.tsx                                — Short-term, long-term, AND patient goals
  ProgrammeSection.tsx
  ProgrammeNotesSection.tsx
  InfoSheetsSection.tsx
  ConsentSection.tsx
  ProgressSpecificSections.tsx                    — For progress assessment only

src/components/admin/pdf/                         — PDF template components
  InitialAssessmentPDF.tsx
  ProgressReportPDF.tsx
  BodyMapPDFRenderer.tsx
  PDFHeader.tsx
  PDFFooter.tsx

src/lib/supabase/client.ts                        — Supabase browser client
src/lib/supabase/server.ts                        — Supabase server client
src/lib/supabase/admin.ts                         — Supabase service role client

src/types/pilates.ts                              — TypeScript types (batches, registrations)
src/types/assessment.ts                           — TypeScript types (assessments, body map)

src/data/body-map-regions.ts                      — Body region definitions (id, label, x, y per view)
src/assets/body-map/                              — SVG files
  body-front.svg
  body-back.svg
  body-side.svg
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
- The assessment form has ~20 sections — build it as a multi-step wizard, NOT one giant scrollable form
- Body map is a custom component — invest time in getting the SVG regions right, this is a key differentiator
- JSONB fields give flexibility — don't over-normalize the assessment data
- Patient goals are SEPARATE from clinical goals — make this distinction clear in the UI
- The PDF report is what patients see — it must look professional and branded
- Team may fill forms on tablet during consultations — all admin forms must be touch-friendly
