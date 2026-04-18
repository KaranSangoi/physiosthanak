'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, ArrowRight, TrendingUp, MapPin } from 'lucide-react';
import type { Patient, PatientAssessment, JointMovement } from '@/types/patient';

// ─── ROM JOINTS WE TRACK ────────────────────────────────────────────────────
// Three commonly-tracked movements. We always show these in the comparison
// section even when the underlying value is missing, so therapists understand
// the structure.

interface TrackedJoint {
  jointKey: keyof NonNullable<PatientAssessment['rom']>;
  movementKey: string;
  label: string;
  /** Which side(s) to extract. 'either' = right ?? left ?? degrees */
  preferred: 'right' | 'left' | 'degrees' | 'either';
}

const TRACKED_JOINTS: TrackedJoint[] = [
  { jointKey: 'cervical', movementKey: 'flexion', label: 'Cervical Flexion', preferred: 'either' },
  { jointKey: 'lumbar', movementKey: 'flexion', label: 'Lumbar Flexion', preferred: 'either' },
  { jointKey: 'shoulder', movementKey: 'abduction', label: 'Shoulder Abduction (R)', preferred: 'right' },
];

function readJointDegrees(
  rom: PatientAssessment['rom'] | null | undefined,
  jointKey: TrackedJoint['jointKey'],
  movementKey: string,
  preferred: TrackedJoint['preferred'],
): number | null {
  if (!rom) return null;
  const joint = (rom as Record<string, Record<string, JointMovement> | undefined>)[
    jointKey as string
  ];
  if (!joint) return null;
  const data = joint[movementKey];
  if (!data) return null;
  if (preferred === 'right') return data.right ?? data.degrees ?? data.left ?? null;
  if (preferred === 'left') return data.left ?? data.degrees ?? data.right ?? null;
  if (preferred === 'degrees') return data.degrees ?? data.right ?? data.left ?? null;
  return data.right ?? data.left ?? data.degrees ?? null;
}

function getMarkerCount(a: PatientAssessment): number {
  return a.posture?.body_map?.markers?.length ?? 0;
}

function getTopROMLimitations(
  a: PatientAssessment,
  count = 3,
): { label: string; deficit: number; current: number; normal: number }[] {
  const items: { label: string; deficit: number; current: number; normal: number }[] = [];
  const rom = a.rom || {};
  for (const [jointKey, movements] of Object.entries(rom)) {
    if (!movements || typeof movements !== 'object') continue;
    for (const [moveKey, data] of Object.entries(
      movements as Record<string, JointMovement>,
    )) {
      if (!data || data.normal == null) continue;
      const current = data.right ?? data.left ?? data.degrees;
      if (current == null) continue;
      const deficit = data.normal - current;
      if (deficit > 0) {
        items.push({
          label: `${cap(jointKey)} ${moveKey.replace(/_/g, ' ')}`,
          deficit,
          current,
          normal: data.normal,
        });
      }
    }
  }
  items.sort((a, b) => b.deficit - a.deficit);
  return items.slice(0, count);
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── PAGE ───────────────────────────────────────────────────────────────────

export default function PatientProgressPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessments, setAssessments] = useState<PatientAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  // Compare selectors (default to first vs latest completed)
  const [compareAId, setCompareAId] = useState<string>('');
  const [compareBId, setCompareBId] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const [{ data: patientData }, { data: assessData }] = await Promise.all([
        supabase.from('patients').select('*').eq('id', patientId).single(),
        supabase
          .from('patient_assessments')
          .select('*')
          .eq('patient_id', patientId)
          .order('assessment_date', { ascending: false }),
      ]);
      if (cancelled) return;
      if (patientData) setPatient(patientData as Patient);
      const all = (assessData || []) as PatientAssessment[];
      setAssessments(all);

      // Default compare picks: oldest completed vs latest completed
      const completed = all.filter((a) => !a.draft);
      if (completed.length >= 2) {
        setCompareAId(completed[completed.length - 1].id); // oldest first
        setCompareBId(completed[0].id); // latest
      } else if (completed.length === 1 && all.length >= 2) {
        setCompareBId(completed[0].id);
        setCompareAId(all[all.length - 1].id);
      } else if (all.length >= 2) {
        setCompareAId(all[all.length - 1].id);
        setCompareBId(all[0].id);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  // Sort by date ascending for time series
  const chronological = useMemo(
    () =>
      [...assessments].sort(
        (a, b) =>
          new Date(a.assessment_date).getTime() - new Date(b.assessment_date).getTime(),
      ),
    [assessments],
  );

  const compareA = useMemo(
    () => assessments.find((a) => a.id === compareAId) || null,
    [assessments, compareAId],
  );
  const compareB = useMemo(
    () => assessments.find((a) => a.id === compareBId) || null,
    [assessments, compareBId],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-40 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Patient not found.</p>
        <button
          onClick={() => router.push('/admin/patients')}
          className="text-[#14507c] hover:underline text-sm"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/admin/patients/${patientId}`)}
          className="p-2 hover:bg-gray-100 rounded-md shrink-0"
          aria-label="Back to patient"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-gray-800 normal-case truncate">
            {patient.name}
          </h2>
          <p className="text-sm text-gray-500">Progress over time</p>
        </div>
      </div>

      {assessments.length === 0 && (
        <Section title="No assessments yet">
          <p className="text-sm text-gray-500">
            No assessments have been recorded for this patient.{' '}
            <Link
              href={`/admin/patients/${patientId}/assess`}
              className="text-[#14507c] hover:underline"
            >
              Start the first assessment &rarr;
            </Link>
          </p>
        </Section>
      )}

      {assessments.length > 0 && (
        <>
          {/* Assessments Table */}
          <Section title={`All Assessments (${assessments.length})`}>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm border-collapse min-w-[680px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-xs uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-xs uppercase tracking-wide">
                      Assessor
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-xs uppercase tracking-wide">
                      Pain VAS
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-xs uppercase tracking-wide">
                      Top ROM Limitations
                    </th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-xs uppercase tracking-wide">
                      Markers
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-gray-600 border-b border-gray-200 text-xs uppercase tracking-wide">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((a) => {
                    const top = getTopROMLimitations(a, 3);
                    return (
                      <tr key={a.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-2.5 px-3 text-gray-800 font-medium border-b border-gray-100">
                          {formatDate(a.assessment_date)}
                        </td>
                        <td className="py-2.5 px-3 text-gray-700 border-b border-gray-100">
                          {a.assessor || '-'}
                        </td>
                        <td className="py-2.5 px-3 border-b border-gray-100">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              a.draft
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {a.draft ? 'Draft' : 'Completed'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center border-b border-gray-100">
                          {a.pain?.pain_vas != null ? (
                            <span
                              className={`font-bold ${
                                a.pain.pain_vas <= 3
                                  ? 'text-green-600'
                                  : a.pain.pain_vas <= 6
                                    ? 'text-amber-600'
                                    : 'text-red-600'
                              }`}
                            >
                              {a.pain.pain_vas}/10
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-b border-gray-100 text-xs">
                          {top.length === 0 ? (
                            <span className="text-gray-300">No data</span>
                          ) : (
                            <ul className="space-y-0.5">
                              {top.map((t) => (
                                <li key={t.label} className="text-gray-700">
                                  <span className="capitalize">{t.label}</span>:{' '}
                                  <span className="text-red-600 font-medium">
                                    -{t.deficit}°
                                  </span>{' '}
                                  <span className="text-gray-400">
                                    ({t.current}/{t.normal})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center border-b border-gray-100">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                            <MapPin size={12} className="text-gray-400" />
                            {getMarkerCount(a)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right border-b border-gray-100">
                          <Link
                            href={`/admin/patients/${patientId}/assessments/${a.id}`}
                            className="text-[#14507c] hover:underline text-xs"
                          >
                            View &rarr;
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Pain VAS Sparkline + Marker count */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Pain VAS Trend">
              {chronological.filter((a) => a.pain?.pain_vas != null).length === 0 ? (
                <p className="text-sm text-gray-400 italic">No pain VAS data recorded.</p>
              ) : (
                <Sparkline
                  points={chronological
                    .filter((a) => a.pain?.pain_vas != null)
                    .map((a) => ({
                      label: formatDate(a.assessment_date),
                      value: a.pain!.pain_vas as number,
                    }))}
                  yMin={0}
                  yMax={10}
                  goodIsLow
                  unit="/10"
                />
              )}
            </Section>

            <Section title="Body Map Markers Over Time">
              {chronological.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No data.</p>
              ) : (
                <Sparkline
                  points={chronological.map((a) => ({
                    label: formatDate(a.assessment_date),
                    value: getMarkerCount(a),
                  }))}
                  yMin={0}
                  goodIsLow
                  unit=" markers"
                />
              )}
            </Section>
          </div>

          {/* ROM First → Latest */}
          <Section title="Range of Motion: First vs Latest">
            <ROMFirstVsLatest assessments={chronological} />
          </Section>

          {/* Compare two assessments */}
          {assessments.length >= 2 && (
            <Section title="Compare Two Assessments">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Assessment A (older)
                  </label>
                  <select
                    value={compareAId}
                    onChange={(e) => setCompareAId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  >
                    {assessments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {formatDate(a.assessment_date)} —{' '}
                        {a.draft ? 'Draft' : 'Completed'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Assessment B (newer)
                  </label>
                  <select
                    value={compareBId}
                    onChange={(e) => setCompareBId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  >
                    {assessments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {formatDate(a.assessment_date)} —{' '}
                        {a.draft ? 'Draft' : 'Completed'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {compareA && compareB && compareA.id !== compareB.id ? (
                <CompareView a={compareA} b={compareB} patientId={patientId} />
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Pick two different assessments to compare.
                </p>
              )}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

// ─── COMPARE VIEW ───────────────────────────────────────────────────────────

function CompareView({
  a,
  b,
  patientId,
}: {
  a: PatientAssessment;
  b: PatientAssessment;
  patientId: string;
}) {
  const painA = a.pain?.pain_vas;
  const painB = b.pain?.pain_vas;
  const painDelta =
    painA != null && painB != null ? painB - painA : null;

  const markersA = getMarkerCount(a);
  const markersB = getMarkerCount(b);
  const markersDelta = markersB - markersA;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <CompareHeader label="A" date={a.assessment_date} draft={a.draft} />
        <CompareHeader label="B" date={b.assessment_date} draft={b.draft} />
      </div>

      {/* Pain VAS */}
      <div className="bg-gray-50 rounded-md p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-800">Pain VAS</h4>
          {painDelta != null && (
            <DeltaBadge value={painDelta} unit="" goodIsLow />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-gray-500">A</span>
            <p className="font-bold text-gray-800">
              {painA != null ? `${painA}/10` : '-'}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">B</span>
            <p className="font-bold text-gray-800">
              {painB != null ? `${painB}/10` : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Body Map Markers */}
      <div className="bg-gray-50 rounded-md p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-800">Body Map Markers</h4>
          <DeltaBadge value={markersDelta} unit="" goodIsLow />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-gray-500">A</span>
            <p className="font-bold text-gray-800">{markersA}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">B</span>
            <p className="font-bold text-gray-800">{markersB}</p>
          </div>
        </div>
      </div>

      {/* ROM tracked joints */}
      <div className="bg-gray-50 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-3">
          Range of Motion (tracked joints)
        </h4>
        <div className="space-y-2">
          {TRACKED_JOINTS.map((tj) => {
            const va = readJointDegrees(a.rom, tj.jointKey, tj.movementKey, tj.preferred);
            const vb = readJointDegrees(b.rom, tj.jointKey, tj.movementKey, tj.preferred);
            const delta = va != null && vb != null ? vb - va : null;
            return (
              <div
                key={`${String(tj.jointKey)}-${tj.movementKey}`}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="text-gray-700">{tj.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs">
                    {va != null ? `${va}°` : '-'}
                  </span>
                  <ArrowRight size={12} className="text-gray-400" />
                  <span className="font-medium text-gray-800">
                    {vb != null ? `${vb}°` : '-'}
                  </span>
                  {delta != null && (
                    <DeltaBadge value={delta} unit="°" goodIsLow={false} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Treatment delta */}
      <div className="bg-gray-50 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-3">Treatment Plan</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <TxList label="A — Modalities" items={a.treatment_plan?.modalities} />
          <TxList label="B — Modalities" items={b.treatment_plan?.modalities} />
          <TxList label="A — Manual Therapy" items={a.treatment_plan?.manual_therapy} />
          <TxList label="B — Manual Therapy" items={b.treatment_plan?.manual_therapy} />
        </div>
      </div>

      {/* Open links */}
      <div className="flex items-center justify-end gap-3 text-xs">
        <Link
          href={`/admin/patients/${patientId}/assessments/${a.id}`}
          className="text-[#14507c] hover:underline"
        >
          Open A &rarr;
        </Link>
        <Link
          href={`/admin/patients/${patientId}/assessments/${b.id}`}
          className="text-[#14507c] hover:underline"
        >
          Open B &rarr;
        </Link>
      </div>
    </div>
  );
}

function TxList({ label, items }: { label: string; items?: string[] }) {
  return (
    <div>
      <p className="text-gray-500 mb-1">{label}</p>
      {items && items.length > 0 ? (
        <ul className="space-y-0.5 text-gray-800">
          {items.map((m) => (
            <li key={m}>&#8226; {m}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic">None</p>
      )}
    </div>
  );
}

function CompareHeader({
  label,
  date,
  draft,
}: {
  label: string;
  date: string;
  draft: boolean;
}) {
  return (
    <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-blue-700">Assessment {label}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            draft ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {draft ? 'Draft' : 'Completed'}
        </span>
      </div>
      <p className="text-sm font-medium text-blue-900 mt-1">{formatDate(date)}</p>
    </div>
  );
}

function DeltaBadge({
  value,
  unit,
  goodIsLow,
}: {
  value: number;
  unit: string;
  goodIsLow: boolean;
}) {
  if (value === 0) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
        no change
      </span>
    );
  }
  const improved = goodIsLow ? value < 0 : value > 0;
  const sign = value > 0 ? '+' : '';
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        improved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {sign}
      {value}
      {unit}
    </span>
  );
}

// ─── ROM FIRST vs LATEST ────────────────────────────────────────────────────

function ROMFirstVsLatest({ assessments }: { assessments: PatientAssessment[] }) {
  if (assessments.length === 0) {
    return <p className="text-sm text-gray-400 italic">No assessments.</p>;
  }
  const first = assessments[0];
  const latest = assessments[assessments.length - 1];
  const sameRow = first.id === latest.id;

  return (
    <>
      <p className="text-xs text-gray-500 mb-3">
        {sameRow ? (
          <>Single assessment — no comparison available.</>
        ) : (
          <>
            Comparing <strong>{formatDate(first.assessment_date)}</strong>
            <ArrowRight size={12} className="inline mx-1" />
            <strong>{formatDate(latest.assessment_date)}</strong>
          </>
        )}
      </p>
      <div className="space-y-2">
        {TRACKED_JOINTS.map((tj) => {
          const firstVal = readJointDegrees(
            first.rom,
            tj.jointKey,
            tj.movementKey,
            tj.preferred,
          );
          const latestVal = sameRow
            ? null
            : readJointDegrees(latest.rom, tj.jointKey, tj.movementKey, tj.preferred);
          const delta =
            firstVal != null && latestVal != null ? latestVal - firstVal : null;
          return (
            <div
              key={`${String(tj.jointKey)}-${tj.movementKey}`}
              className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-400" />
                <span className="text-gray-700">{tj.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">
                  {firstVal != null ? `${firstVal}°` : '-'}
                </span>
                {!sameRow && (
                  <>
                    <ArrowRight size={12} className="text-gray-400" />
                    <span className="font-medium text-gray-800">
                      {latestVal != null ? `${latestVal}°` : '-'}
                    </span>
                  </>
                )}
                {delta != null && (
                  <DeltaBadge value={delta} unit="°" goodIsLow={false} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── SPARKLINE ──────────────────────────────────────────────────────────────

function Sparkline({
  points,
  yMin = 0,
  yMax,
  goodIsLow = false,
  unit = '',
}: {
  points: { label: string; value: number }[];
  yMin?: number;
  yMax?: number;
  goodIsLow?: boolean;
  unit?: string;
}) {
  if (points.length === 0) {
    return <p className="text-sm text-gray-400 italic">No data.</p>;
  }
  const W = 480;
  const H = 120;
  const PAD_X = 24;
  const PAD_Y = 18;

  const values = points.map((p) => p.value);
  const minV = yMin;
  const maxV = yMax ?? Math.max(...values, 1);
  const range = Math.max(maxV - minV, 1);

  const stepX = points.length > 1 ? (W - PAD_X * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = PAD_X + i * stepX;
    const y = H - PAD_Y - ((p.value - minV) / range) * (H - PAD_Y * 2);
    return { x, y, value: p.value, label: p.label };
  });

  // Path
  const pathD = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');

  // Trend direction
  const first = points[0].value;
  const last = points[points.length - 1].value;
  const delta = last - first;
  const improved = goodIsLow ? delta < 0 : delta > 0;
  const lineColor =
    delta === 0 ? '#6b7280' : improved ? '#16a34a' : '#dc2626';

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
        <span>
          First: <strong className="text-gray-800">{first}{unit}</strong>
        </span>
        <span>
          Latest: <strong className="text-gray-800">{last}{unit}</strong>
        </span>
        {points.length > 1 && (
          <DeltaBadge value={delta} unit={unit} goodIsLow={goodIsLow} />
        )}
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[120px]"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Sparkline showing ${points.length} data point${points.length === 1 ? '' : 's'}`}
        >
          {/* Gridline at midpoint */}
          <line
            x1={PAD_X}
            y1={H / 2}
            x2={W - PAD_X}
            y2={H / 2}
            stroke="#e5e7eb"
            strokeDasharray="2 4"
          />
          {/* Path */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {/* Dots + labels */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={3.5} fill={lineColor} />
              <text
                x={c.x}
                y={c.y - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#374151"
                fontWeight="600"
              >
                {c.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {/* X-axis labels (only first and last to avoid clutter) */}
      {points.length > 1 && (
        <div className="flex justify-between text-[10px] text-gray-400 px-6 mt-1">
          <span>{points[0].label}</span>
          <span>{points[points.length - 1].label}</span>
        </div>
      )}
    </div>
  );
}

// ─── HELPER COMPONENT ───────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}
