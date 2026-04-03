'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { BodyMapMarker } from '@/types/pilates';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

type IssueType = BodyMapMarker['type'];
type Severity = BodyMapMarker['severity'];
type View = 'front' | 'back';

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
  { value: 'pain', label: 'Pain', color: '#ef4444' },
  { value: 'tightness', label: 'Tightness', color: '#f97316' },
  { value: 'weakness', label: 'Weakness', color: '#eab308' },
  { value: 'swelling', label: 'Swelling', color: '#3b82f6' },
  { value: 'numbness', label: 'Numbness', color: '#8b5cf6' },
  { value: 'other', label: 'Other', color: '#6b7280' },
];

const SEVERITY_OPTIONS: { value: Severity; label: string; size: number }[] = [
  { value: 'mild', label: 'Mild', size: 6 },
  { value: 'moderate', label: 'Moderate', size: 9 },
  { value: 'severe', label: 'Severe', size: 12 },
];

function getMarkerColor(type: IssueType): string {
  return ISSUE_TYPES.find((t) => t.value === type)?.color || '#6b7280';
}

function getMarkerSize(severity: Severity): number {
  return SEVERITY_OPTIONS.find((s) => s.value === severity)?.size || 9;
}

// ─── BODY REGION DEFINITIONS ────────────────────────────────────────────────────
// Regions are rectangles defined as { x, y, w, h } in SVG viewBox (200x400) coordinates.
// The label is what gets auto-filled when the user clicks.

interface BodyRegion {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const FRONT_REGIONS: BodyRegion[] = [
  { id: 'f-head', label: 'Head / Face', x: 80, y: 5, w: 40, h: 35 },
  { id: 'f-neck', label: 'Neck', x: 85, y: 40, w: 30, h: 18 },
  { id: 'f-r-shoulder', label: 'Right Shoulder', x: 48, y: 58, w: 30, h: 22 },
  { id: 'f-l-shoulder', label: 'Left Shoulder', x: 122, y: 58, w: 30, h: 22 },
  { id: 'f-r-upper-arm', label: 'Right Upper Arm', x: 35, y: 80, w: 20, h: 40 },
  { id: 'f-l-upper-arm', label: 'Left Upper Arm', x: 145, y: 80, w: 20, h: 40 },
  { id: 'f-chest', label: 'Chest', x: 78, y: 58, w: 44, h: 40 },
  { id: 'f-abdomen', label: 'Abdomen', x: 78, y: 98, w: 44, h: 42 },
  { id: 'f-r-elbow', label: 'Right Elbow', x: 28, y: 120, w: 20, h: 20 },
  { id: 'f-l-elbow', label: 'Left Elbow', x: 152, y: 120, w: 20, h: 20 },
  { id: 'f-r-forearm', label: 'Right Forearm', x: 22, y: 140, w: 20, h: 35 },
  { id: 'f-l-forearm', label: 'Left Forearm', x: 158, y: 140, w: 20, h: 35 },
  { id: 'f-r-hand', label: 'Right Wrist / Hand', x: 15, y: 175, w: 22, h: 25 },
  { id: 'f-l-hand', label: 'Left Wrist / Hand', x: 163, y: 175, w: 22, h: 25 },
  { id: 'f-r-hip', label: 'Right Hip', x: 72, y: 140, w: 28, h: 30 },
  { id: 'f-l-hip', label: 'Left Hip', x: 100, y: 140, w: 28, h: 30 },
  { id: 'f-r-thigh', label: 'Right Thigh', x: 72, y: 170, w: 28, h: 55 },
  { id: 'f-l-thigh', label: 'Left Thigh', x: 100, y: 170, w: 28, h: 55 },
  { id: 'f-r-knee', label: 'Right Knee', x: 72, y: 225, w: 28, h: 25 },
  { id: 'f-l-knee', label: 'Left Knee', x: 100, y: 225, w: 28, h: 25 },
  { id: 'f-r-shin', label: 'Right Shin', x: 72, y: 250, w: 28, h: 55 },
  { id: 'f-l-shin', label: 'Left Shin', x: 100, y: 250, w: 28, h: 55 },
  { id: 'f-r-ankle', label: 'Right Ankle / Foot', x: 68, y: 305, w: 32, h: 30 },
  { id: 'f-l-ankle', label: 'Left Ankle / Foot', x: 100, y: 305, w: 32, h: 30 },
];

const BACK_REGIONS: BodyRegion[] = [
  { id: 'b-head', label: 'Head (posterior)', x: 80, y: 5, w: 40, h: 35 },
  { id: 'b-neck', label: 'Neck (posterior)', x: 85, y: 40, w: 30, h: 18 },
  { id: 'b-r-shoulder', label: 'Right Shoulder (posterior)', x: 48, y: 58, w: 30, h: 22 },
  { id: 'b-l-shoulder', label: 'Left Shoulder (posterior)', x: 122, y: 58, w: 30, h: 22 },
  { id: 'b-upper-back', label: 'Upper Back', x: 78, y: 58, w: 44, h: 30 },
  { id: 'b-mid-back', label: 'Mid Back', x: 78, y: 88, w: 44, h: 30 },
  { id: 'b-lower-back', label: 'Lower Back / Lumbar', x: 78, y: 118, w: 44, h: 30 },
  { id: 'b-r-upper-arm', label: 'Right Upper Arm (posterior)', x: 35, y: 80, w: 20, h: 40 },
  { id: 'b-l-upper-arm', label: 'Left Upper Arm (posterior)', x: 145, y: 80, w: 20, h: 40 },
  { id: 'b-r-elbow', label: 'Right Elbow (posterior)', x: 28, y: 120, w: 20, h: 20 },
  { id: 'b-l-elbow', label: 'Left Elbow (posterior)', x: 152, y: 120, w: 20, h: 20 },
  { id: 'b-r-forearm', label: 'Right Forearm (posterior)', x: 22, y: 140, w: 20, h: 35 },
  { id: 'b-l-forearm', label: 'Left Forearm (posterior)', x: 158, y: 140, w: 20, h: 35 },
  { id: 'b-r-hand', label: 'Right Hand (posterior)', x: 15, y: 175, w: 22, h: 25 },
  { id: 'b-l-hand', label: 'Left Hand (posterior)', x: 163, y: 175, w: 22, h: 25 },
  { id: 'b-r-glute', label: 'Right Glute', x: 72, y: 148, w: 28, h: 30 },
  { id: 'b-l-glute', label: 'Left Glute', x: 100, y: 148, w: 28, h: 30 },
  { id: 'b-r-hamstring', label: 'Right Hamstring', x: 72, y: 178, w: 28, h: 55 },
  { id: 'b-l-hamstring', label: 'Left Hamstring', x: 100, y: 178, w: 28, h: 55 },
  { id: 'b-r-knee', label: 'Right Knee (posterior)', x: 72, y: 233, w: 28, h: 20 },
  { id: 'b-l-knee', label: 'Left Knee (posterior)', x: 100, y: 233, w: 28, h: 20 },
  { id: 'b-r-calf', label: 'Right Calf', x: 72, y: 253, w: 28, h: 52 },
  { id: 'b-l-calf', label: 'Left Calf', x: 100, y: 253, w: 28, h: 52 },
  { id: 'b-r-ankle', label: 'Right Ankle / Foot (posterior)', x: 68, y: 305, w: 32, h: 30 },
  { id: 'b-l-ankle', label: 'Left Ankle / Foot (posterior)', x: 100, y: 305, w: 32, h: 30 },
];

// ─── SVG BODY OUTLINE ───────────────────────────────────────────────────────────
// Simplified gender-neutral body outline as SVG paths.
// ViewBox is 200x340. The body is centered horizontally.

function BodyOutlineFront() {
  return (
    <g stroke="#14507c" strokeWidth="1.8" fill="#f0f7ff" strokeLinejoin="round" strokeLinecap="round">
      {/* Head */}
      <ellipse cx="100" cy="24" rx="18" ry="22" />
      {/* Neck */}
      <rect x="92" y="44" width="16" height="14" rx="3" />
      {/* Torso */}
      <path d="M78,58 L68,62 L62,80 L58,100 L60,140 L72,148 L72,170 L128,170 L128,148 L140,140 L142,100 L138,80 L132,62 L122,58 Z" />
      {/* Right arm */}
      <path d="M62,80 L50,78 L42,90 L35,120 L30,145 L25,175 L22,190 L28,192 L34,178 L38,150 L42,130 L48,110 L55,95" fill="#f0f7ff" />
      {/* Left arm */}
      <path d="M138,80 L150,78 L158,90 L165,120 L170,145 L175,175 L178,190 L172,192 L166,178 L162,150 L158,130 L152,110 L145,95" fill="#f0f7ff" />
      {/* Right leg */}
      <path d="M72,170 L72,225 L70,260 L68,305 L68,330 L80,332 L82,310 L86,260 L88,225 L92,170" fill="#f0f7ff" />
      {/* Left leg */}
      <path d="M108,170 L112,225 L114,260 L118,310 L120,332 L132,330 L132,305 L130,260 L128,225 L128,170" fill="#f0f7ff" />
      {/* Midline reference */}
      <line x1="100" y1="58" x2="100" y2="170" stroke="#14507c" strokeWidth="0.3" strokeDasharray="2,4" />
    </g>
  );
}

function BodyOutlineBack() {
  return (
    <g stroke="#14507c" strokeWidth="1.8" fill="#f0f7ff" strokeLinejoin="round" strokeLinecap="round">
      {/* Head */}
      <ellipse cx="100" cy="24" rx="18" ry="22" />
      {/* Neck */}
      <rect x="92" y="44" width="16" height="14" rx="3" />
      {/* Torso */}
      <path d="M78,58 L68,62 L62,80 L58,100 L60,140 L72,148 L72,178 L128,178 L128,148 L140,140 L142,100 L138,80 L132,62 L122,58 Z" />
      {/* Spine line */}
      <line x1="100" y1="58" x2="100" y2="148" stroke="#14507c" strokeWidth="0.5" strokeDasharray="3,3" />
      {/* Scapulae hints */}
      <path d="M82,68 L78,80 L82,92 L94,88 L92,75 Z" fill="none" strokeWidth="0.6" />
      <path d="M118,68 L122,80 L118,92 L106,88 L108,75 Z" fill="none" strokeWidth="0.6" />
      {/* Right arm */}
      <path d="M62,80 L50,78 L42,90 L35,120 L30,145 L25,175 L22,190 L28,192 L34,178 L38,150 L42,130 L48,110 L55,95" fill="#f0f7ff" />
      {/* Left arm */}
      <path d="M138,80 L150,78 L158,90 L165,120 L170,145 L175,175 L178,190 L172,192 L166,178 L162,150 L158,130 L152,110 L145,95" fill="#f0f7ff" />
      {/* Right leg */}
      <path d="M72,178 L72,233 L70,265 L68,305 L68,330 L80,332 L82,310 L86,265 L88,233 L92,178" fill="#f0f7ff" />
      {/* Left leg */}
      <path d="M108,178 L112,233 L114,265 L118,310 L120,332 L132,330 L132,305 L130,265 L128,233 L128,178" fill="#f0f7ff" />
    </g>
  );
}

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
  regions,
  markers,
  readOnly,
  onRegionClick,
  onMarkerClick,
  faded,
}: {
  view: View;
  label: string;
  regions: BodyRegion[];
  markers: BodyMapMarker[];
  readOnly?: boolean;
  onRegionClick: (e: React.MouseEvent<SVGRectElement>, region: BodyRegion, view: View) => void;
  onMarkerClick: (e: React.MouseEvent<SVGCircleElement>, marker: BodyMapMarker) => void;
  faded?: boolean;
}) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const viewMarkers = markers.filter((m) => m.view === view);

  return (
    <div className={`flex flex-col items-center ${faded ? 'opacity-40' : ''}`}>
      <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">{label}</p>
      <svg
        viewBox="0 0 200 340"
        className="w-full max-w-[220px] h-auto select-none"
        style={{ touchAction: 'manipulation' }}
      >
        {/* Body outline */}
        {view === 'front' ? <BodyOutlineFront /> : <BodyOutlineBack />}

        {/* Clickable regions (transparent overlays) */}
        {!readOnly &&
          regions.map((region) => (
            <rect
              key={region.id}
              x={region.x}
              y={region.y}
              width={region.w}
              height={region.h}
              fill={hoveredRegion === region.id ? 'rgba(20,80,124,0.1)' : 'transparent'}
              stroke={hoveredRegion === region.id ? 'rgba(20,80,124,0.3)' : 'transparent'}
              strokeWidth="1"
              rx="2"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={(e) => onRegionClick(e, region, view)}
            />
          ))}

        {/* Markers */}
        {viewMarkers.map((marker) => {
          const size = getMarkerSize(marker.severity);
          const color = getMarkerColor(marker.type);
          return (
            <g key={marker.id}>
              {/* Outer glow */}
              <circle
                cx={marker.x}
                cy={marker.y}
                r={size + 2}
                fill={color}
                opacity={0.25}
              />
              {/* Main circle */}
              <circle
                cx={marker.x}
                cy={marker.y}
                r={size}
                fill={color}
                stroke="white"
                strokeWidth="1.5"
                className={readOnly ? '' : 'cursor-pointer'}
                onClick={(e) => {
                  if (!readOnly) onMarkerClick(e, marker);
                }}
              />
              {/* Severity indicator: inner dot for severe, ring for moderate */}
              {marker.severity === 'severe' && (
                <circle cx={marker.x} cy={marker.y} r={3} fill="white" opacity={0.8} pointerEvents="none" />
              )}
              {marker.severity === 'mild' && (
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={size - 2}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.8"
                  opacity={0.5}
                  pointerEvents="none"
                />
              )}
            </g>
          );
        })}
      </svg>
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
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
          Mild
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-400" />
          Moderate
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded-full bg-gray-400" />
          Severe
        </span>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function BodyMap({ markers, onChange, readOnly = false }: BodyMapProps) {
  const [popover, setPopover] = useState<PopoverState | null>(null);

  const generateId = useCallback(() => {
    return `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }, []);

  const handleRegionClick = useCallback(
    (e: React.MouseEvent<SVGRectElement>, region: BodyRegion, view: View) => {
      if (readOnly) return;

      // Get SVG coordinates for marker placement (center of the clicked region)
      const svgX = region.x + region.w / 2;
      const svgY = region.y + region.h / 2;

      // Get screen coordinates for popover positioning
      const rect = (e.target as SVGRectElement).getBoundingClientRect();
      const screenX = rect.left + rect.width / 2;
      const screenY = rect.top + rect.height / 2;

      setPopover({
        open: true,
        x: screenX,
        y: screenY,
        svgX,
        svgY,
        view,
        region: region.label,
        editingId: null,
      });
    },
    [readOnly]
  );

  const handleMarkerClick = useCallback(
    (e: React.MouseEvent<SVGCircleElement>, marker: BodyMapMarker) => {
      if (readOnly) return;
      e.stopPropagation();

      const circle = e.target as SVGCircleElement;
      const rect = circle.getBoundingClientRect();

      setPopover({
        open: true,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        svgX: marker.x,
        svgY: marker.y,
        view: marker.view as View,
        region: marker.region,
        editingId: marker.id,
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
        // Adding new
        const newMarker: BodyMapMarker = {
          id: generateId(),
          view: data.view,
          region: data.region,
          x: data.x,
          y: data.y,
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
      {/* Body views side by side */}
      <div className="grid grid-cols-2 gap-4">
        <BodyView
          view="front"
          label="Front View"
          regions={FRONT_REGIONS}
          markers={markers}
          readOnly={readOnly}
          onRegionClick={handleRegionClick}
          onMarkerClick={handleMarkerClick}
        />
        <BodyView
          view="back"
          label="Back View"
          regions={BACK_REGIONS}
          markers={markers}
          readOnly={readOnly}
          onRegionClick={handleRegionClick}
          onMarkerClick={handleMarkerClick}
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
                    // Find the marker on the SVG and create a popover near it
                    const container = (e.currentTarget as HTMLElement).closest('.space-y-2');
                    if (container) {
                      const rect = container.getBoundingClientRect();
                      setPopover({
                        open: true,
                        x: rect.left + rect.width / 2,
                        y: rect.top + 100,
                        svgX: m.x,
                        svgY: m.y,
                        view: m.view as View,
                        region: m.region,
                        editingId: m.id,
                      });
                    }
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
              regions={FRONT_REGIONS}
              markers={initialMarkers}
              readOnly
              onRegionClick={() => {}}
              onMarkerClick={() => {}}
              faded
            />
            <BodyView
              view="back"
              label="Back (Initial)"
              regions={BACK_REGIONS}
              markers={initialMarkers}
              readOnly
              onRegionClick={() => {}}
              onMarkerClick={() => {}}
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
