'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Body from '@/lib/body-map/Body';
import type { ExtendedBodyPart, Slug } from '@/lib/body-map/types';
import type { BodyMapMarker } from '@/types/pilates';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

type IssueType = BodyMapMarker['type'];
type Severity = BodyMapMarker['severity'];
type View = 'front' | 'back';
type Gender = 'male' | 'female';

interface BodyMapProps {
  markers: BodyMapMarker[];
  onChange: (markers: BodyMapMarker[]) => void;
  readOnly?: boolean;
}

interface PopoverState {
  open: boolean;
  x: number;
  y: number;
  svgX: number;
  svgY: number;
  view: View;
  region: string;
  editingId: string | null;
}

// ─── CONSTANTS ──────────────────────────────────────────────────────────────────

const ISSUE_TYPES: { value: IssueType; label: string; color: string }[] = [
  { value: 'pain', label: 'Pain', color: '#ef4444' },        // red
  { value: 'tightness', label: 'Tightness', color: '#16a34a' }, // green (was orange — too close to red)
  { value: 'weakness', label: 'Weakness', color: '#eab308' },   // yellow
  { value: 'swelling', label: 'Swelling', color: '#3b82f6' },   // blue
  { value: 'numbness', label: 'Numbness', color: '#d946ef' },   // magenta (was purple — too close to blue)
  { value: 'other', label: 'Other', color: '#6b7280' },         // gray
];

const SEVERITY_OPTIONS: { value: Severity; label: string; size: number }[] = [
  { value: 'mild', label: 'Mild', size: 4 },
  { value: 'moderate', label: 'Moderate', size: 6 },
  { value: 'severe', label: 'Severe', size: 8 },
];

function getMarkerColor(type: IssueType): string {
  return ISSUE_TYPES.find((t) => t.value === type)?.color || '#6b7280';
}

const SEVERITY_OPACITY: Record<Severity, number> = {
  mild: 0.4,
  moderate: 0.7,
  severe: 1.0,
};

const severityRank: Record<Severity, number> = {
  mild: 1,
  moderate: 2,
  severe: 3,
};

/**
 * Convert a hex color (#rrggbb) + opacity (0..1) to an rgba() string.
 * Falls back to the original color if parsing fails.
 */
function hexToRgba(hex: string, opacity: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// ─── SLUG → REGION MAPPINGS ─────────────────────────────────────────────────────
// The package fires onBodyPartPress with a `slug` and an optional `side` ("left",
// "right", or undefined for `common` paths). We map every (slug, side) combo to a
// region { id, label } so users get a friendly name in the popover and the data
// stays consistent in the database.
//
// Where the package has finer granularity than our existing FRONT_REGIONS /
// BACK_REGIONS, we share the same id (e.g. chest|left and chest|right both map
// to id "f-chest" / label "Chest"). Where the package has parts we didn't have
// before (obliques, forearm, adductors), we create new ids/labels.

interface RegionInfo {
  id: string;
  label: string;
}

// key format: `${slug}|${side}` where side is "left" | "right" | "common"
type SlugSideKey = string;

function makeKey(slug: Slug, side: 'left' | 'right' | 'common'): SlugSideKey {
  return `${slug}|${side}`;
}

const FRONT_SLUG_MAP: Record<SlugSideKey, RegionInfo> = {
  // Head
  [makeKey('head', 'common')]: { id: 'f-head', label: 'Head / Face' },
  [makeKey('hair', 'common')]: { id: 'f-head', label: 'Head / Face' },
  // Neck
  [makeKey('neck', 'common')]: { id: 'f-neck', label: 'Neck' },
  [makeKey('neck', 'left')]: { id: 'f-neck', label: 'Neck' },
  [makeKey('neck', 'right')]: { id: 'f-neck', label: 'Neck' },
  // FRONT VIEW: package's "left" path renders on viewer's LEFT side of screen,
  // which corresponds to the body's anatomical RIGHT (because in front view we
  // face the person). So package "left" → "Right [Part]", package "right" → "Left [Part]".
  // Shoulders (deltoids)
  [makeKey('deltoids', 'left')]: { id: 'f-r-shoulder', label: 'Right Shoulder' },
  [makeKey('deltoids', 'right')]: { id: 'f-l-shoulder', label: 'Left Shoulder' },
  // Trapezius (visible at front, near shoulder/neck)
  [makeKey('trapezius', 'left')]: { id: 'f-r-trapezius', label: 'Right Trapezius' },
  [makeKey('trapezius', 'right')]: { id: 'f-l-trapezius', label: 'Left Trapezius' },
  // Chest
  [makeKey('chest', 'left')]: { id: 'f-chest', label: 'Chest' },
  [makeKey('chest', 'right')]: { id: 'f-chest', label: 'Chest' },
  // Upper arm (biceps)
  [makeKey('biceps', 'left')]: { id: 'f-r-upper-arm', label: 'Right Upper Arm' },
  [makeKey('biceps', 'right')]: { id: 'f-l-upper-arm', label: 'Left Upper Arm' },
  // Triceps (some visible from front)
  [makeKey('triceps', 'left')]: { id: 'f-r-upper-arm', label: 'Right Upper Arm' },
  [makeKey('triceps', 'right')]: { id: 'f-l-upper-arm', label: 'Left Upper Arm' },
  // Forearm
  [makeKey('forearm', 'left')]: { id: 'f-r-forearm', label: 'Right Forearm' },
  [makeKey('forearm', 'right')]: { id: 'f-l-forearm', label: 'Left Forearm' },
  // Hands
  [makeKey('hands', 'left')]: { id: 'f-r-hand', label: 'Right Wrist / Hand' },
  [makeKey('hands', 'right')]: { id: 'f-l-hand', label: 'Left Wrist / Hand' },
  // Abdomen (abs) — both sides share the same region
  [makeKey('abs', 'left')]: { id: 'f-abdomen', label: 'Abdomen' },
  [makeKey('abs', 'right')]: { id: 'f-abdomen', label: 'Abdomen' },
  [makeKey('abs', 'common')]: { id: 'f-abdomen', label: 'Abdomen' },
  // Obliques
  [makeKey('obliques', 'left')]: { id: 'f-r-oblique', label: 'Right Oblique' },
  [makeKey('obliques', 'right')]: { id: 'f-l-oblique', label: 'Left Oblique' },
  // Quadriceps → thighs
  [makeKey('quadriceps', 'left')]: { id: 'f-r-thigh', label: 'Right Thigh' },
  [makeKey('quadriceps', 'right')]: { id: 'f-l-thigh', label: 'Left Thigh' },
  // Adductors (inner thigh)
  [makeKey('adductors', 'left')]: { id: 'f-r-adductor', label: 'Right Inner Thigh (Adductor)' },
  [makeKey('adductors', 'right')]: { id: 'f-l-adductor', label: 'Left Inner Thigh (Adductor)' },
  // Knees
  [makeKey('knees', 'left')]: { id: 'f-r-knee', label: 'Right Knee' },
  [makeKey('knees', 'right')]: { id: 'f-l-knee', label: 'Left Knee' },
  // Tibialis (shin)
  [makeKey('tibialis', 'left')]: { id: 'f-r-shin', label: 'Right Shin' },
  [makeKey('tibialis', 'right')]: { id: 'f-l-shin', label: 'Left Shin' },
  // Calves (lower leg from front)
  [makeKey('calves', 'left')]: { id: 'f-r-shin', label: 'Right Shin' },
  [makeKey('calves', 'right')]: { id: 'f-l-shin', label: 'Left Shin' },
  // Ankles + feet
  [makeKey('ankles', 'left')]: { id: 'f-r-ankle', label: 'Right Ankle / Foot' },
  [makeKey('ankles', 'right')]: { id: 'f-l-ankle', label: 'Left Ankle / Foot' },
  [makeKey('feet', 'left')]: { id: 'f-r-ankle', label: 'Right Ankle / Foot' },
  [makeKey('feet', 'right')]: { id: 'f-l-ankle', label: 'Left Ankle / Foot' },
};

const BACK_SLUG_MAP: Record<SlugSideKey, RegionInfo> = {
  // Head
  [makeKey('hair', 'common')]: { id: 'b-head', label: 'Head (posterior)' },
  // Neck
  [makeKey('neck', 'left')]: { id: 'b-neck', label: 'Neck (posterior)' },
  [makeKey('neck', 'right')]: { id: 'b-neck', label: 'Neck (posterior)' },
  [makeKey('neck', 'common')]: { id: 'b-neck', label: 'Neck (posterior)' },
  // Shoulders (deltoids)
  [makeKey('deltoids', 'left')]: { id: 'b-l-shoulder', label: 'Left Shoulder (posterior)' },
  [makeKey('deltoids', 'right')]: { id: 'b-r-shoulder', label: 'Right Shoulder (posterior)' },
  // Trapezius
  [makeKey('trapezius', 'left')]: { id: 'b-l-trapezius', label: 'Left Trapezius' },
  [makeKey('trapezius', 'right')]: { id: 'b-r-trapezius', label: 'Right Trapezius' },
  // Upper back
  [makeKey('upper-back', 'left')]: { id: 'b-upper-back', label: 'Upper Back' },
  [makeKey('upper-back', 'right')]: { id: 'b-upper-back', label: 'Upper Back' },
  [makeKey('upper-back', 'common')]: { id: 'b-upper-back', label: 'Upper Back' },
  // Lower back / Lumbar
  [makeKey('lower-back', 'left')]: { id: 'b-lower-back', label: 'Lower Back / Lumbar' },
  [makeKey('lower-back', 'right')]: { id: 'b-lower-back', label: 'Lower Back / Lumbar' },
  [makeKey('lower-back', 'common')]: { id: 'b-lower-back', label: 'Lower Back / Lumbar' },
  // Triceps → upper arm
  [makeKey('triceps', 'left')]: { id: 'b-l-upper-arm', label: 'Left Upper Arm (posterior)' },
  [makeKey('triceps', 'right')]: { id: 'b-r-upper-arm', label: 'Right Upper Arm (posterior)' },
  // Forearm — NEW
  [makeKey('forearm', 'left')]: { id: 'b-l-forearm', label: 'Left Forearm (posterior)' },
  [makeKey('forearm', 'right')]: { id: 'b-r-forearm', label: 'Right Forearm (posterior)' },
  // Hands
  [makeKey('hands', 'left')]: { id: 'b-l-hand', label: 'Left Hand (posterior)' },
  [makeKey('hands', 'right')]: { id: 'b-r-hand', label: 'Right Hand (posterior)' },
  // Glutes (gluteal)
  [makeKey('gluteal', 'left')]: { id: 'b-l-glute', label: 'Left Glute' },
  [makeKey('gluteal', 'right')]: { id: 'b-r-glute', label: 'Right Glute' },
  // Hamstrings
  [makeKey('hamstring', 'left')]: { id: 'b-l-hamstring', label: 'Left Hamstring' },
  [makeKey('hamstring', 'right')]: { id: 'b-r-hamstring', label: 'Right Hamstring' },
  // Adductors — NEW (inner thigh, posterior)
  [makeKey('adductors', 'left')]: { id: 'b-l-adductor', label: 'Left Inner Thigh (Adductor)' },
  [makeKey('adductors', 'right')]: { id: 'b-r-adductor', label: 'Right Inner Thigh (Adductor)' },
  // Calves
  [makeKey('calves', 'left')]: { id: 'b-l-calf', label: 'Left Calf' },
  [makeKey('calves', 'right')]: { id: 'b-r-calf', label: 'Right Calf' },
  // Feet
  [makeKey('feet', 'left')]: { id: 'b-l-ankle', label: 'Left Ankle / Foot (posterior)' },
  [makeKey('feet', 'right')]: { id: 'b-r-ankle', label: 'Right Ankle / Foot (posterior)' },
};

// ─── OVERLAY REGIONS (PHYSIO-SPECIFIC) ──────────────────────────────────────────
// The package's <Body> covers gross muscle groups. These overlay buttons add
// physio-specific click zones the package doesn't have (TMJ, AC joint, patella,
// SI joint, plantar, achilles, spinal segments, pelvis, groin, lateral hip).
//
// Positions are percentages relative to the body wrapper (200×400 base svg).
// Anatomical convention: "left" = body's anatomical left = viewer's RIGHT in
// front view, viewer's LEFT in back view. The percentage `left` on the wrapper
// is purely visual placement; the LABEL says which side anatomically.

interface OverlayRegion {
  id: string;
  label: string;
  position: { left: string; top: string; width: string; height: string };
}

// Anatomical proportions in the rendered Body component (head to feet ≈ 0% to 100%):
// head 4-13, neck 13-17, shoulders 17-21, chest 21-30, abs 30-43, pelvis 43-48,
// groin 48-52, hip lateral 43-49, thigh 50-65, knee 65-71, shin 71-86, ankle 86-92, foot 92-100.

// Front view: viewer's left half (small `left%`) shows body's anatomical right.
const FRONT_OVERLAY_REGIONS: OverlayRegion[] = [
  // TMJ — jaw joint, just in front of the ear
  { id: 'f-r-tmj', label: 'Right TMJ (Jaw)', position: { left: '40%', top: '13%', width: '7%', height: '4%' } },
  { id: 'f-l-tmj', label: 'Left TMJ (Jaw)', position: { left: '53%', top: '13%', width: '7%', height: '4%' } },
  // AC joint — between the trapezius (closer to neck) and the shoulder tip (deltoid)
  { id: 'f-r-ac-joint', label: 'Right AC Joint', position: { left: '34%', top: '20%', width: '6%', height: '3%' } },
  { id: 'f-l-ac-joint', label: 'Left AC Joint', position: { left: '60%', top: '20%', width: '6%', height: '3%' } },
  // Elbow joint — between biceps (upper arm) and forearm
  { id: 'f-r-elbow', label: 'Right Elbow', position: { left: '25%', top: '33%', width: '8%', height: '4%' } },
  { id: 'f-l-elbow', label: 'Left Elbow', position: { left: '67%', top: '33%', width: '8%', height: '4%' } },
  // Pelvis — below abs, just above where legs meet
  { id: 'f-pelvis', label: 'Pelvis', position: { left: '42%', top: '44%', width: '16%', height: '4%' } },
  // Groin — inguinal area (where leg meets body), split L/R
  { id: 'f-r-groin', label: 'Right Groin', position: { left: '42%', top: '49%', width: '8%', height: '3%' } },
  { id: 'f-l-groin', label: 'Left Groin', position: { left: '50%', top: '49%', width: '8%', height: '3%' } },
  // Hip (lateral) — outer hip, waist level
  { id: 'f-r-hip', label: 'Right Hip (lateral)', position: { left: '33%', top: '43%', width: '7%', height: '5%' } },
  { id: 'f-l-hip', label: 'Left Hip (lateral)', position: { left: '60%', top: '43%', width: '7%', height: '5%' } },
  // Patella — kneecap
  { id: 'f-r-patella', label: 'Right Patella (Kneecap)', position: { left: '40%', top: '67%', width: '7%', height: '4%' } },
  { id: 'f-l-patella', label: 'Left Patella (Kneecap)', position: { left: '53%', top: '67%', width: '7%', height: '4%' } },
  // Plantar — top of foot (front view)
  { id: 'f-r-plantar', label: 'Right Plantar / Foot', position: { left: '38%', top: '94%', width: '9%', height: '5%' } },
  { id: 'f-l-plantar', label: 'Left Plantar / Foot', position: { left: '53%', top: '94%', width: '9%', height: '5%' } },
];

// Back view: viewer's left half shows body's anatomical left.
const BACK_OVERLAY_REGIONS: OverlayRegion[] = [
  // Cervical spine — back of neck (top of spine)
  { id: 'b-cervical', label: 'Cervical Spine (posterior)', position: { left: '45%', top: '15%', width: '10%', height: '3%' } },
  // Thoracic spine — upper-mid back centerline (between scapulae down to mid-back)
  { id: 'b-thoracic', label: 'Thoracic Spine', position: { left: '47%', top: '22%', width: '6%', height: '14%' } },
  // Lumbar spine — lower back centerline
  { id: 'b-lumbar', label: 'Lumbar Spine', position: { left: '47%', top: '37%', width: '6%', height: '7%' } },
  // SI joint — either side of the sacrum (between lumbar and glutes)
  { id: 'b-l-si-joint', label: 'Left SI Joint', position: { left: '42%', top: '42%', width: '8%', height: '5%' } },
  { id: 'b-r-si-joint', label: 'Right SI Joint', position: { left: '50%', top: '42%', width: '8%', height: '5%' } },
  // Elbow joint — back of elbow (olecranon), between triceps and forearm
  { id: 'b-l-elbow', label: 'Left Elbow (posterior)', position: { left: '25%', top: '33%', width: '8%', height: '4%' } },
  { id: 'b-r-elbow', label: 'Right Elbow (posterior)', position: { left: '67%', top: '33%', width: '8%', height: '4%' } },
  // Achilles — behind each ankle
  { id: 'b-l-achilles', label: 'Left Achilles', position: { left: '40%', top: '88%', width: '6%', height: '4%' } },
  { id: 'b-r-achilles', label: 'Right Achilles', position: { left: '54%', top: '88%', width: '6%', height: '4%' } },
];

// ─── POPOVER COMPONENT ──────────────────────────────────────────────────────────

function MarkerPopover({
  state,
  onClose,
  onSave,
  onDelete,
  existingMarker,
}: {
  state: PopoverState;
  onClose: () => void;
  onSave: (marker: Omit<BodyMapMarker, 'id'> & { id?: string }) => void;
  onDelete: (id: string) => void;
  existingMarker: BodyMapMarker | null;
}) {
  const [type, setType] = useState<IssueType>(existingMarker?.type || 'pain');
  const [severity, setSeverity] = useState<Severity>(existingMarker?.severity || 'moderate');
  const [note, setNote] = useState(existingMarker?.note || '');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Position the popover so it doesn't go off-screen
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let top = state.y + 10;
      let left = state.x - rect.width / 2;

      // Keep within horizontal bounds
      if (left < 8) left = 8;
      if (left + rect.width > vw - 8) left = vw - rect.width - 8;

      // If popover goes below viewport, show above the click
      if (top + rect.height > vh - 8) {
        top = state.y - rect.height - 10;
      }
      // If still off top, just clamp
      if (top < 8) top = 8;

      setPosition({ top, left });
    }
  }, [state.x, state.y]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100]"
        onClick={onClose}
      />
      {/* Popover */}
      <div
        ref={popoverRef}
        className="fixed z-[101] bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[280px]"
        style={{ top: position.top || state.y + 10, left: position.left || state.x - 140 }}
      >
        {/* Region label */}
        <p className="text-sm font-semibold text-gray-800 mb-3">{state.region}</p>

        {/* Issue type */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Issue Type</label>
          <div className="grid grid-cols-3 gap-1">
            {ISSUE_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`text-xs px-2 py-1.5 rounded border font-medium transition-colors min-h-[32px] ${
                  type === t.value
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: t.color }}
                />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Severity</label>
          <div className="flex gap-2">
            {SEVERITY_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSeverity(s.value)}
                className={`flex-1 text-xs px-2 py-1.5 rounded border font-medium transition-colors min-h-[32px] ${
                  severity === s.value
                    ? 'border-[#14507c] bg-[#14507c] text-white'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Brief description..."
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#14507c] min-h-[32px]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onSave({
                id: existingMarker?.id,
                view: state.view,
                region: state.region,
                x: existingMarker?.x ?? state.svgX,
                y: existingMarker?.y ?? state.svgY,
                type,
                severity,
                note,
              });
            }}
            className="flex-1 text-xs font-medium px-3 py-2 bg-[#14507c] text-white rounded hover:bg-[#0f3f63] transition-colors min-h-[36px]"
          >
            {existingMarker ? 'Update' : 'Add Marker'}
          </button>
          {existingMarker && (
            <button
              type="button"
              onClick={() => onDelete(existingMarker.id)}
              className="text-xs font-medium px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors min-h-[36px]"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium px-3 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors min-h-[36px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

// ─── BODY VIEW COMPONENT ────────────────────────────────────────────────────────

function BodyView({
  view,
  label,
  markers,
  readOnly,
  onPartPress,
  faded,
  gender = 'female',
}: {
  view: View;
  label: string;
  markers: BodyMapMarker[];
  readOnly?: boolean;
  onPartPress: (region: RegionInfo, view: View, screenX: number, screenY: number) => void;
  faded?: boolean;
  gender?: Gender;
}) {
  // Capture click position via mousedown on a wrapping div. The package's
  // <Body> renders SVG <path>s; their onClick fires AFTER mousedown bubbles to
  // our wrapper, so we can read the captured coords inside onBodyPartPress.
  const lastPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const slugMap = view === 'front' ? FRONT_SLUG_MAP : BACK_SLUG_MAP;

  // Build the data prop dynamically. Our vendored <Body> keys user data by
  // (slug, side), so each slug+side combo can be painted independently — left
  // thigh red and right thigh blue can both render at the same time.
  const data: ExtendedBodyPart[] = [];
  const viewMarkers = markers.filter((m) => m.view === view);

  for (const key of Object.keys(slugMap)) {
    const region = slugMap[key];
    const matching = viewMarkers.filter((m) => m.region === region.label);
    if (matching.length === 0) continue;
    const top = matching.reduce((best, m) =>
      severityRank[m.severity] > severityRank[best.severity] ? m : best
    );
    const fill = hexToRgba(getMarkerColor(top.type), SEVERITY_OPACITY[top.severity]);
    const [slug, side] = key.split('|') as [Slug, 'left' | 'right' | 'common'];
    const entry: ExtendedBodyPart = { slug, styles: { fill } };
    if (side === 'left' || side === 'right') entry.side = side;
    data.push(entry);
  }

  const handleBodyPartPress = useCallback(
    (part: ExtendedBodyPart, side?: 'left' | 'right') => {
      if (readOnly) return;
      if (!part.slug) return;
      const sideKey: 'left' | 'right' | 'common' = side ?? 'left';
      // Try the actual side first; fall back to "common" if not present
      let region = slugMap[makeKey(part.slug, sideKey)];
      if (!region) region = slugMap[makeKey(part.slug, 'common')];
      if (!region && side) {
        // Try the other side as a last resort
        region = slugMap[makeKey(part.slug, side === 'left' ? 'right' : 'left')];
      }
      if (!region) return; // Unmapped slug — ignore the click
      onPartPress(region, view, lastPointer.current.x, lastPointer.current.y);
    },
    [readOnly, slugMap, onPartPress, view]
  );

  const overlays = view === 'front' ? FRONT_OVERLAY_REGIONS : BACK_OVERLAY_REGIONS;

  return (
    <div className={`flex flex-col items-center ${faded ? 'opacity-40' : ''}`}>
      <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">{label}</p>
      <div
        className="relative"
        style={{ width: 200, height: 400, touchAction: 'manipulation' }}
        onMouseDownCapture={(e) => {
          lastPointer.current = { x: e.clientX, y: e.clientY };
        }}
        onTouchStartCapture={(e) => {
          const t = e.touches[0];
          if (t) lastPointer.current = { x: t.clientX, y: t.clientY };
        }}
      >
        <Body
          gender={gender}
          side={view}
          scale={1}
          data={data}
          defaultFill="#454545"
          defaultStroke="#94a3b8"
          defaultStrokeWidth={0.5}
          border="none"
          onBodyPartPress={handleBodyPartPress}
        />

        {/* Physio-specific overlay click zones (TMJ, AC joint, patella, etc.).
            Anatomical positions are roughly the same for both genders, so we
            use one set of percentages. The `<Body>` SVG keeps its natural
            aspect ratio inside the wrapper, so percentage-based positioning
            scales with the wrapper width. */}
        {!readOnly &&
          overlays.map((o) => {
            // Find any markers tagged with this overlay's label (could be multiple)
            const overlayMarkers = viewMarkers.filter((m) => m.region === o.label);
            const top = overlayMarkers.length
              ? overlayMarkers.reduce((best, m) =>
                  severityRank[m.severity] > severityRank[best.severity] ? m : best
                )
              : null;
            const fill = top ? hexToRgba(getMarkerColor(top.type), SEVERITY_OPACITY[top.severity]) : null;
            const border = top ? hexToRgba(getMarkerColor(top.type), 0.9) : 'transparent';

            return (
              <button
                key={o.id}
                type="button"
                title={o.label}
                aria-label={o.label}
                onClick={(e) => {
                  e.stopPropagation();
                  onPartPress(
                    { id: o.id, label: o.label },
                    view,
                    e.clientX,
                    e.clientY
                  );
                }}
                className="absolute rounded cursor-pointer transition-colors"
                style={{
                  left: o.position.left,
                  top: o.position.top,
                  width: o.position.width,
                  height: o.position.height,
                  background: fill ?? 'transparent',
                  border: top ? `1.5px solid ${border}` : '2px dashed transparent',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={(e) => {
                  if (top) return;
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(20,80,124,0.5)';
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(20,80,124,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (top) return;
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'transparent';
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'transparent';
                }}
              />
            );
          })}
      </div>
    </div>
  );
}

// ─── LEGEND ─────────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-3">
      {ISSUE_TYPES.map((t) => (
        <div key={t.value} className="flex items-center gap-1.5 text-xs text-gray-600">
          <span
            className="inline-block w-3 h-3 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: t.color }}
          />
          {t.label}
        </div>
      ))}
      <span className="text-gray-300 mx-1">|</span>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: hexToRgba('#6b7280', SEVERITY_OPACITY.mild) }}
          />
          Mild
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: hexToRgba('#6b7280', SEVERITY_OPACITY.moderate) }}
          />
          Moderate
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: hexToRgba('#6b7280', SEVERITY_OPACITY.severe) }}
          />
          Severe
        </span>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function BodyMap({ markers, onChange, readOnly = false }: BodyMapProps) {
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [gender, setGender] = useState<Gender>('female');

  const generateId = useCallback(() => {
    return `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }, []);

  const handlePartPress = useCallback(
    (region: RegionInfo, view: View, screenX: number, screenY: number) => {
      if (readOnly) return;
      // Always open in "add new marker" mode. Multiple markers per region are
      // allowed (e.g. pain + tightness on the same shoulder). To edit an
      // existing marker, click its row in the marker list below.
      setPopover({
        open: true,
        x: screenX,
        y: screenY,
        svgX: 0,
        svgY: 0,
        view,
        region: region.label,
        editingId: null,
      });
    },
    [readOnly]
  );

  const handleSave = useCallback(
    (data: Omit<BodyMapMarker, 'id'> & { id?: string }) => {
      let updated: BodyMapMarker[];

      if (data.id) {
        // Updating existing
        updated = markers.map((m) =>
          m.id === data.id
            ? { ...m, type: data.type, severity: data.severity, note: data.note }
            : m
        );
      } else {
        // Adding new — x/y are unused now (region drives display) so store 0,0
        const newMarker: BodyMapMarker = {
          id: generateId(),
          view: data.view,
          region: data.region,
          x: 0,
          y: 0,
          type: data.type,
          severity: data.severity,
          note: data.note,
        };
        updated = [...markers, newMarker];
      }

      onChange(updated);
      setPopover(null);
    },
    [markers, onChange, generateId]
  );

  const handleDelete = useCallback(
    (id: string) => {
      onChange(markers.filter((m) => m.id !== id));
      setPopover(null);
    },
    [markers, onChange]
  );

  const existingMarker = popover?.editingId
    ? markers.find((m) => m.id === popover.editingId) || null
    : null;

  return (
    <div className="space-y-2">
      {/* Gender toggle (segmented control) */}
      {!readOnly && (
        <div className="flex justify-center mb-2">
          <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
            {(['female', 'male'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`text-xs font-medium px-3 py-1.5 rounded transition-colors min-w-[64px] ${
                  gender === g
                    ? 'bg-[#14507c] text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {g === 'female' ? 'Female' : 'Male'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body views side by side */}
      <div className="grid grid-cols-2 gap-4">
        <BodyView
          view="front"
          label="Front View"
          markers={markers}
          readOnly={readOnly}
          onPartPress={handlePartPress}
          gender={gender}
        />
        <BodyView
          view="back"
          label="Back View"
          markers={markers}
          readOnly={readOnly}
          onPartPress={handlePartPress}
          gender={gender}
        />
      </div>

      {/* Legend */}
      <Legend />

      {/* Marker summary list */}
      {markers.length > 0 && (
        <div className="mt-3 border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 border-b border-gray-200">
            Markers ({markers.length})
          </div>
          <div className="divide-y divide-gray-100 max-h-[200px] overflow-y-auto">
            {markers.map((m) => (
              <div
                key={m.id}
                className={`flex items-center gap-2 px-3 py-2 text-xs ${!readOnly ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={(e) => {
                  if (!readOnly) {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setPopover({
                      open: true,
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                      svgX: m.x,
                      svgY: m.y,
                      view: m.view as View,
                      region: m.region,
                      editingId: m.id,
                    });
                  }
                }}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-white shadow-sm"
                  style={{ backgroundColor: getMarkerColor(m.type) }}
                />
                <span className="font-medium text-gray-800">{m.region}</span>
                <span className="text-gray-400 capitalize">{m.type}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  m.severity === 'severe'
                    ? 'bg-red-100 text-red-700'
                    : m.severity === 'moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                }`}>
                  {m.severity}
                </span>
                {m.note && <span className="text-gray-400 truncate max-w-[120px]">{m.note}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popover */}
      {popover && popover.open && (
        <MarkerPopover
          state={popover}
          onClose={() => setPopover(null)}
          onSave={handleSave}
          onDelete={handleDelete}
          existingMarker={existingMarker}
        />
      )}

      {/* Hint for empty state */}
      {!readOnly && markers.length === 0 && (
        <p className="text-xs text-gray-400 text-center mt-1">
          Tap on a body region to mark areas of pain, tightness, weakness, or other findings.
        </p>
      )}
    </div>
  );
}

// ─── READ-ONLY VARIANT FOR COMPARISON ───────────────────────────────────────────

export function BodyMapReadOnly({ markers }: { markers: BodyMapMarker[] }) {
  return (
    <BodyMap markers={markers} onChange={() => {}} readOnly />
  );
}

export function BodyMapComparison({
  initialMarkers,
  currentMarkers,
  onChange,
}: {
  initialMarkers: BodyMapMarker[];
  currentMarkers: BodyMapMarker[];
  onChange: (markers: BodyMapMarker[]) => void;
}) {
  return (
    <div className="space-y-4">
      {initialMarkers.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Initial Assessment Body Map</p>
          <div className="grid grid-cols-2 gap-4 opacity-50">
            <BodyView
              view="front"
              label="Front (Initial)"
              markers={initialMarkers}
              readOnly
              onPartPress={() => {}}
              faded
            />
            <BodyView
              view="back"
              label="Back (Initial)"
              markers={initialMarkers}
              readOnly
              onPartPress={() => {}}
              faded
            />
          </div>
          <Legend />
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2">Current Body Map</p>
        <BodyMap markers={currentMarkers} onChange={onChange} />
      </div>
    </div>
  );
}
