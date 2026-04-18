'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Edit, Calendar, User, Printer } from 'lucide-react';
import type { Patient, PatientAssessment, JointMovement } from '@/types/patient';
import { BodyMapReadOnly } from '@/components/admin/BodyMap';

// ─── PAGE ───────────────────────────────────────────────────────────────────

export default function PatientAssessmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const assessmentId = params.aid as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessment, setAssessment] = useState<PatientAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const [{ data: patientData }, { data: assessData }] = await Promise.all([
        supabase.from('patients').select('*').eq('id', patientId).single(),
        supabase
          .from('patient_assessments')
          .select('*')
          .eq('id', assessmentId)
          .single(),
      ]);
      if (cancelled) return;
      if (patientData) setPatient(patientData as Patient);
      if (assessData) setAssessment(assessData as PatientAssessment);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [patientId, assessmentId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-96 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!assessment || !patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Assessment not found.</p>
        <button
          onClick={() => router.push(`/admin/patients/${patientId}`)}
          className="text-[#14507c] hover:underline text-sm"
        >
          Back to Patient Profile
        </button>
      </div>
    );
  }

  const isDraft = assessment.draft;
  const cd = assessment.client_details || {};
  const hist = assessment.history || {};
  const life = assessment.lifestyle || {};
  const pain = assessment.pain || {};
  const posture = assessment.posture || {};
  const rom = assessment.rom || {};
  const tests = assessment.special_tests || {};
  const goals = assessment.goals || {};
  const tx = assessment.treatment_plan || {};

  const bodyMarkers = posture.body_map?.markers || [];

  return (
    <>
      {/* Print-only styles to hide chrome and Tailwind print utilities for layout */}
      <style jsx global>{`
        @media print {
          /* Hide everything outside our printable area */
          aside, nav, header, [role='navigation'], .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          /* Compact spacing in print */
          .print-container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-section {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="space-y-6 max-w-4xl mx-auto print-container">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push(`/admin/patients/${patientId}`)}
              className="p-2 hover:bg-gray-100 rounded-md no-print shrink-0"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-semibold text-gray-800 normal-case truncate">
                  Assessment
                </h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isDraft
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {isDraft ? 'Draft' : 'Completed'}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {patient.name} &middot; {formatDate(assessment.assessment_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Print"
            >
              <Printer size={14} />
              Print
            </button>
            <Link
              href={`/admin/patients/${patientId}/assess`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#14507c] border border-[#14507c] rounded-md hover:bg-blue-50 transition-colors"
              title={
                isDraft
                  ? 'Resume this draft (auto-loads latest draft)'
                  : 'Open assessment form'
              }
            >
              <Edit size={14} />
              {isDraft ? 'Resume' : 'Edit'}
            </Link>
          </div>
        </div>

        {/* Assessment Meta */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 print-section">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-gray-500 block text-xs">Date</span>
                <p className="font-medium text-gray-800">
                  {formatDate(assessment.assessment_date)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-gray-500 block text-xs">Assessor</span>
                <p className="font-medium text-gray-800">
                  {assessment.assessor || '-'}
                </p>
              </div>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Status</span>
              <p
                className={`font-medium ${
                  isDraft ? 'text-amber-700' : 'text-green-700'
                }`}
              >
                {isDraft ? 'Draft' : 'Completed'}
              </p>
            </div>
            {assessment.completed_at && (
              <div>
                <span className="text-gray-500 block text-xs">Completed</span>
                <p className="font-medium text-gray-800">
                  {new Date(assessment.completed_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 1. Client Details */}
        <Section title="Client Details">
          <Grid>
            <Field label="Name" value={patient.name} />
            <Field label="Age" value={patient.age != null ? String(patient.age) : undefined} />
            <Field label="Gender" value={cd.gender || patient.gender || undefined} />
            <Field label="Phone" value={patient.contact_phone || undefined} />
            <Field label="Email" value={patient.contact_email || undefined} />
            <Field label="Occupation" value={cd.occupation || patient.occupation || undefined} />
            <Field label="Referred By" value={cd.referred_by} />
            <Field label="Emergency Contact" value={cd.emergency_contact} />
            <Field label="Emergency Relation" value={cd.emergency_relation} />
          </Grid>
        </Section>

        {/* 2. History */}
        {hasAny(hist) && (
          <Section title="History">
            <Field label="Presenting Complaint" value={hist.presenting_complaint} wide />
            <Field label="Past Medical History" value={hist.past_medical_history} wide />
            <Field label="Medications / Supplements" value={hist.medications_supplements} wide />
            <Field label="Allergies" value={hist.allergies} wide />
            {hist.red_flags && Object.entries(hist.red_flags).some(([, v]) => v) && (
              <div className="mt-3">
                <span className="text-xs text-gray-500">Red Flags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(hist.red_flags)
                    .filter(([, v]) => v)
                    .map(([flag]) => (
                      <span
                        key={flag}
                        className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700"
                      >
                        {flag}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* 3. Lifestyle */}
        {hasAny(life) && (
          <Section title="Lifestyle">
            <Grid>
              <Field label="Activity Level" value={life.activity_level} capitalize />
              <Field label="Exercise Type" value={life.exercise_type} />
              <Field label="Sitting Hours" value={life.sitting_hours} />
              <Field label="Sleep Quality" value={life.sleep_quality} />
              <Field label="Stress Level" value={life.stress_level} capitalize />
              <Field label="Smoking" value={life.smoking} capitalize />
            </Grid>
          </Section>
        )}

        {/* 4. Pain */}
        {hasAny(pain) && (
          <Section title="Pain Assessment">
            <Grid>
              <Field label="Location" value={pain.pain_location} />
              {pain.pain_vas != null && (
                <div>
                  <span className="text-xs text-gray-500">VAS Score</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                      <div
                        className={`h-full rounded-full ${
                          (pain.pain_vas || 0) <= 3
                            ? 'bg-green-500'
                            : (pain.pain_vas || 0) <= 6
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${((pain.pain_vas || 0) / 10) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-800">
                      {pain.pain_vas}/10
                    </span>
                  </div>
                </div>
              )}
              <Field label="Duration" value={pain.pain_duration} />
              <Field label="Frequency" value={pain.pain_frequency} capitalize />
            </Grid>
            {pain.pain_nature && pain.pain_nature.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-gray-500">Nature</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pain.pain_nature.map((n) => (
                    <span
                      key={n}
                      className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Field label="Aggravating Factors" value={pain.pain_aggravating} wide />
            <Field label="Easing Factors" value={pain.pain_easing} wide />
          </Section>
        )}

        {/* 5. Posture & Body Map */}
        {(hasAny(posture) || bodyMarkers.length > 0) && (
          <Section title="Posture & Body Map">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Anterior View" value={posture.posture_anterior} />
              <Field label="Lateral View" value={posture.posture_lateral} />
              <Field label="Posterior View" value={posture.posture_posterior} />
            </div>
            {posture.posture_key_findings && posture.posture_key_findings.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-gray-500">Key Findings</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {posture.posture_key_findings.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {bodyMarkers.length > 0 && (
              <div className="mt-4">
                <span className="text-xs text-gray-500 block mb-2">
                  Body Map ({bodyMarkers.length} marker{bodyMarkers.length === 1 ? '' : 's'})
                </span>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                  <BodyMapReadOnly markers={bodyMarkers} />
                </div>
              </div>
            )}
          </Section>
        )}

        {/* 6. Range of Motion */}
        {hasAnyROM(rom) && (
          <Section title="Range of Motion">
            <ROMTable rom={rom} />
          </Section>
        )}

        {/* 7. Special Tests */}
        {(tests.orthopedic?.length ||
          hasAnyNested(tests.neurological) ||
          (tests.functional && Object.keys(tests.functional).length > 0) ||
          tests.notes) && (
          <Section title="Special Tests">
            {/* Orthopedic */}
            {tests.orthopedic && tests.orthopedic.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Orthopedic Tests
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Test
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Side
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Result
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.orthopedic.map((t, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-medium text-gray-800 border border-gray-200">
                            {t.test_name}
                          </td>
                          <td className="py-2 px-3 text-gray-700 border border-gray-200 capitalize">
                            {t.side}
                          </td>
                          <td className="py-2 px-3 border border-gray-200">
                            <ResultBadge result={t.result} />
                          </td>
                          <td className="py-2 px-3 text-gray-600 border border-gray-200 text-xs">
                            {t.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Neurological */}
            {hasAnyNested(tests.neurological) && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Neurological
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {tests.neurological?.reflexes &&
                    Object.keys(tests.neurological.reflexes).length > 0 && (
                      <NeuroBlock
                        title="Reflexes"
                        entries={tests.neurological.reflexes}
                      />
                    )}
                  {tests.neurological?.sensation &&
                    Object.keys(tests.neurological.sensation).length > 0 && (
                      <NeuroBlock
                        title="Sensation"
                        entries={tests.neurological.sensation}
                      />
                    )}
                  {tests.neurological?.muscle_strength &&
                    Object.keys(tests.neurological.muscle_strength).length > 0 && (
                      <NeuroBlock
                        title="Muscle Strength"
                        entries={tests.neurological.muscle_strength}
                      />
                    )}
                </div>
              </div>
            )}

            {/* Functional */}
            {tests.functional && Object.keys(tests.functional).length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Functional Assessment
                </h4>
                <Grid>
                  {Object.entries(tests.functional).map(([k, v]) => (
                    <Field key={k} label={k.replace(/_/g, ' ')} value={v} capitalize />
                  ))}
                </Grid>
              </div>
            )}

            {tests.notes && (
              <Field label="Notes" value={tests.notes} wide />
            )}
          </Section>
        )}

        {/* 8. Goals */}
        {hasAnyGoals(goals) && (
          <Section title="Goals">
            {goals.short_term_goals && goals.short_term_goals.filter((g) => g?.trim()).length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-gray-500">Short-term Goals</span>
                <ul className="mt-1 space-y-1">
                  {goals.short_term_goals
                    .filter((g) => g?.trim())
                    .map((g, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-800 flex items-start gap-2"
                      >
                        <span className="text-gray-400 mt-0.5">&#8226;</span>
                        {g}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {goals.long_term_goals && goals.long_term_goals.filter((g) => g?.trim()).length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-gray-500">Long-term Goals</span>
                <ul className="mt-1 space-y-1">
                  {goals.long_term_goals
                    .filter((g) => g?.trim())
                    .map((g, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-800 flex items-start gap-2"
                      >
                        <span className="text-gray-400 mt-0.5">&#8226;</span>
                        {g}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <Field label="Patient's Own Goals" value={goals.patient_own_goals} wide />
          </Section>
        )}

        {/* 9. Treatment Plan */}
        {hasAnyTreatment(tx) && (
          <Section title="Treatment Plan">
            {tx.modalities && tx.modalities.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-gray-500">Modalities</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tx.modalities.map((m) => (
                    <span
                      key={m}
                      className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tx.manual_therapy && tx.manual_therapy.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-gray-500">Manual Therapy</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tx.manual_therapy.map((m) => (
                    <span
                      key={m}
                      className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tx.exercises && tx.exercises.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-gray-500 block mb-1">Exercises</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Name
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Sets
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Reps
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Frequency
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tx.exercises.map((ex, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-medium text-gray-800 border border-gray-200">
                            {ex.name}
                          </td>
                          <td className="py-2 px-3 text-gray-700 border border-gray-200">
                            {ex.sets ?? '-'}
                          </td>
                          <td className="py-2 px-3 text-gray-700 border border-gray-200">
                            {ex.reps ?? '-'}
                          </td>
                          <td className="py-2 px-3 text-gray-700 border border-gray-200">
                            {ex.frequency || '-'}
                          </td>
                          <td className="py-2 px-3 text-gray-600 border border-gray-200 text-xs">
                            {ex.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <Grid>
              <Field
                label="Frequency / Week"
                value={tx.frequency_per_week ? String(tx.frequency_per_week) : undefined}
              />
              <Field
                label="Duration (Weeks)"
                value={tx.duration_weeks ? String(tx.duration_weeks) : undefined}
              />
              <Field
                label="Follow-up Date"
                value={tx.follow_up_date ? formatDate(tx.follow_up_date) : undefined}
              />
            </Grid>
            <Field label="Home Programme" value={tx.home_program} wide />
            <Field label="Precautions" value={tx.precautions} wide />
            <Field label="Notes" value={tx.notes} wide />
          </Section>
        )}

        {/* Consent */}
        <Section title="Consent">
          <Grid>
            <Field
              label="Consent Given"
              value={assessment.signed_consent ? 'Yes' : 'No'}
            />
            <Field label="Signature" value={assessment.signature_name || undefined} />
          </Grid>
        </Section>

        {/* Timestamps */}
        <div className="text-xs text-gray-400 text-right no-print">
          Created:{' '}
          {assessment.created_at
            ? new Date(assessment.created_at).toLocaleString('en-IN')
            : '-'}
          {assessment.updated_at && (
            <>
              {' '}
              | Updated: {new Date(assessment.updated_at).toLocaleString('en-IN')}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── ROM TABLE ──────────────────────────────────────────────────────────────

function ROMTable({ rom }: { rom: NonNullable<PatientAssessment['rom']> }) {
  // Build flat list of populated rows: (joint, movement, JointMovement)
  const rows: { joint: string; movement: string; data: JointMovement }[] = [];
  for (const [joint, movements] of Object.entries(rom)) {
    if (!movements || typeof movements !== 'object') continue;
    for (const [movement, data] of Object.entries(movements as Record<string, JointMovement>)) {
      if (!data) continue;
      const populated =
        data.left != null ||
        data.right != null ||
        data.degrees != null ||
        data.painful ||
        (data.notes && data.notes.trim());
      if (populated) {
        rows.push({ joint, movement, data });
      }
    }
  }

  if (rows.length === 0) {
    return <p className="text-sm text-gray-400 italic">No ROM data recorded.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
              Joint
            </th>
            <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
              Movement
            </th>
            <th className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200">
              R
            </th>
            <th className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200">
              L
            </th>
            <th className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200">
              Normal
            </th>
            <th className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200">
              Painful
            </th>
            <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.joint}-${r.movement}-${i}`}>
              <td className="py-2 px-3 font-medium text-gray-800 border border-gray-200 capitalize">
                {r.joint}
              </td>
              <td className="py-2 px-3 text-gray-700 border border-gray-200 capitalize">
                {r.movement.replace(/_/g, ' ')}
              </td>
              <td className="py-2 px-3 text-center text-gray-700 border border-gray-200">
                {r.data.right != null
                  ? `${r.data.right}°`
                  : r.data.degrees != null
                    ? `${r.data.degrees}°`
                    : '-'}
              </td>
              <td className="py-2 px-3 text-center text-gray-700 border border-gray-200">
                {r.data.left != null ? `${r.data.left}°` : '-'}
              </td>
              <td className="py-2 px-3 text-center text-gray-500 border border-gray-200 text-xs">
                {r.data.normal != null ? `${r.data.normal}°` : '-'}
              </td>
              <td className="py-2 px-3 text-center border border-gray-200">
                {r.data.painful ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-300 text-xs">-</span>
                )}
              </td>
              <td className="py-2 px-3 text-gray-600 border border-gray-200 text-xs">
                {r.data.notes || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── HELPER COMPONENTS ──────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 print-section">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  wide,
  capitalize: cap,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
  capitalize?: boolean;
}) {
  if (value == null || value === '') return null;
  return (
    <div className={wide ? 'sm:col-span-2 lg:col-span-3 mt-3' : ''}>
      <span className="text-xs text-gray-500">{label}</span>
      <p
        className={`font-medium text-gray-800 text-sm mt-0.5 whitespace-pre-wrap break-words ${
          cap ? 'capitalize' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ResultBadge({ result }: { result: string }) {
  const styles: Record<string, string> = {
    positive: 'bg-red-100 text-red-700',
    negative: 'bg-green-100 text-green-700',
    inconclusive: 'bg-amber-100 text-amber-700',
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
        styles[result] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {result}
    </span>
  );
}

function NeuroBlock({
  title,
  entries,
}: {
  title: string;
  entries: Record<string, string>;
}) {
  const populated = Object.entries(entries).filter(([, v]) => v && v.trim());
  if (populated.length === 0) return null;
  return (
    <div className="bg-gray-50 rounded-md p-3">
      <p className="text-xs font-medium text-gray-700 mb-2">{title}</p>
      <div className="space-y-1">
        {populated.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{k}</span>
            <span className="font-medium text-gray-800">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

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

function hasAny(obj: object | null | undefined): boolean {
  if (!obj) return false;
  return Object.values(obj as Record<string, unknown>).some((v) => {
    if (v == null) return false;
    if (typeof v === 'string') return v.trim() !== '';
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return true;
  });
}

function hasAnyROM(rom: PatientAssessment['rom'] | null | undefined): boolean {
  if (!rom) return false;
  for (const movements of Object.values(rom)) {
    if (!movements || typeof movements !== 'object') continue;
    for (const data of Object.values(movements as Record<string, JointMovement>)) {
      if (!data) continue;
      if (
        data.left != null ||
        data.right != null ||
        data.degrees != null ||
        data.painful ||
        (data.notes && data.notes.trim())
      ) {
        return true;
      }
    }
  }
  return false;
}

function hasAnyNested(obj: object | null | undefined): boolean {
  if (!obj) return false;
  return Object.values(obj as Record<string, Record<string, string> | undefined>).some(
    (sub) => !!sub && Object.keys(sub).length > 0,
  );
}

function hasAnyGoals(goals: PatientAssessment['goals']): boolean {
  if (!goals) return false;
  if (goals.short_term_goals?.some((g) => g?.trim())) return true;
  if (goals.long_term_goals?.some((g) => g?.trim())) return true;
  if (goals.patient_own_goals?.trim()) return true;
  return false;
}

function hasAnyTreatment(tx: PatientAssessment['treatment_plan']): boolean {
  if (!tx) return false;
  if (tx.modalities?.length) return true;
  if (tx.manual_therapy?.length) return true;
  if (tx.exercises?.length) return true;
  if (tx.home_program?.trim()) return true;
  if (tx.precautions?.trim()) return true;
  if (tx.notes?.trim()) return true;
  if (tx.frequency_per_week != null) return true;
  if (tx.duration_weeks != null) return true;
  if (tx.follow_up_date) return true;
  return false;
}
