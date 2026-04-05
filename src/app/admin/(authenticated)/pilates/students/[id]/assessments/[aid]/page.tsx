'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Edit, Calendar, User, Download } from 'lucide-react';
import type { PilatesRegistration, PilatesAssessment } from '@/types/pilates';
import { BodyMapReadOnly } from '@/components/admin/BodyMap';

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const assessmentId = params.aid as string;

  const [student, setStudent] = useState<PilatesRegistration | null>(null);
  const [assessment, setAssessment] = useState<PilatesAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [studentId, assessmentId]);

  const loadData = async () => {
    const supabase = createClient();

    const [{ data: regData }, { data: assessData }] = await Promise.all([
      supabase.from('pilates_registrations').select('*').eq('id', studentId).single(),
      supabase.from('pilates_assessments').select('*').eq('id', assessmentId).single(),
    ]);

    if (regData) setStudent(regData as PilatesRegistration);
    if (assessData) setAssessment(assessData as PilatesAssessment);
    setLoading(false);
  };

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

  if (!assessment || !student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Assessment not found.</p>
        <button
          onClick={() => router.push(`/admin/pilates/students/${studentId}`)}
          className="text-[#14507c] hover:underline text-sm"
        >
          Back to Student Profile
        </button>
      </div>
    );
  }

  const isInitial = assessment.type === 'initial';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/pilates/students/${studentId}`)}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800 normal-case">
                {isInitial ? 'Initial' : 'Progress'} Assessment
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isInitial ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {isInitial ? 'Initial' : 'Progress'}
              </span>
            </div>
            <p className="text-sm text-gray-500">{student.name} &middot; {formatDate(assessment.assessment_date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`/api/assessment-pdf?id=${assessmentId}`, '_blank')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#14507c] rounded-md hover:bg-[#0f3e61] transition-colors"
          >
            <Download size={14} />
            Download PDF
          </button>
          <Link
            href={isInitial
              ? `/admin/pilates/students/${studentId}/assess`
              : `/admin/pilates/students/${studentId}/progress`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#14507c] border border-[#14507c] rounded-md hover:bg-blue-50 transition-colors"
          >
            <Edit size={14} />
            Edit
          </Link>
        </div>
      </div>

      {/* Assessment Meta */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block text-xs">Date</span>
              <p className="font-medium text-gray-800">{formatDate(assessment.assessment_date)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block text-xs">Assessor</span>
              <p className="font-medium text-gray-800">{assessment.assessor_name}</p>
            </div>
          </div>
          {assessment.session_number && (
            <div>
              <span className="text-gray-500 block text-xs">Session #</span>
              <p className="font-medium text-gray-800">{assessment.session_number}</p>
            </div>
          )}
          <div>
            <span className="text-gray-500 block text-xs">Consent</span>
            <p className={`font-medium ${assessment.consent_given ? 'text-green-700' : 'text-amber-600'}`}>
              {assessment.consent_given ? 'Given' : 'Draft'}
            </p>
          </div>
        </div>
      </div>

      {/* Initial Assessment Sections */}
      {isInitial && (
        <>
          <Section title="Client Details">
            <Grid>
              <Field label="Gender" value={assessment.gender} />
              <Field label="Occupation" value={assessment.occupation} />
              <Field label="Referred By" value={assessment.referred_by} />
              <Field label="Emergency Contact" value={assessment.emergency_contact} />
              <Field label="Emergency Relation" value={assessment.emergency_relation} />
            </Grid>
          </Section>

          <Section title="History of Present Condition">
            <Field label="Presenting Complaint" value={assessment.presenting_complaint} wide />
            <Field label="Past Medical History" value={assessment.past_medical_history} wide />
            <Field label="Medications / Supplements" value={assessment.medications_supplements} wide />
            {assessment.red_flags && Object.entries(assessment.red_flags).some(([, v]) => v) && (
              <div className="mt-3">
                <span className="text-xs text-gray-500">Red Flags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(assessment.red_flags)
                    .filter(([, v]) => v)
                    .map(([flag]) => (
                      <span key={flag} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        {flag}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </Section>

          <Section title="Lifestyle">
            <Grid>
              <Field label="Activity Level" value={assessment.activity_level} capitalize />
              <Field label="Exercise Type" value={assessment.exercise_type} />
              <Field label="Sitting Hours" value={assessment.sitting_hours} />
              <Field label="Sleep Quality" value={assessment.sleep_quality} />
              <Field label="Stress Level" value={assessment.stress_level} capitalize />
              <Field label="Smoking" value={assessment.smoking} capitalize />
            </Grid>
          </Section>
        </>
      )}

      {/* Pain Assessment (both types) */}
      <Section title="Pain Assessment">
        <Grid>
          <Field label="Location" value={assessment.pain_location} />
          <div>
            <span className="text-xs text-gray-500">VAS Score</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                <div
                  className={`h-full rounded-full ${
                    (assessment.pain_vas || 0) <= 3
                      ? 'bg-green-500'
                      : (assessment.pain_vas || 0) <= 6
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${((assessment.pain_vas || 0) / 10) * 100}%` }}
                />
              </div>
              <span className="font-bold text-gray-800">{assessment.pain_vas ?? '-'}/10</span>
            </div>
          </div>
          <Field label="Duration" value={assessment.pain_duration} />
          <Field label="Frequency" value={assessment.pain_frequency} capitalize />
        </Grid>
        {assessment.pain_nature && assessment.pain_nature.length > 0 && (
          <div className="mt-3">
            <span className="text-xs text-gray-500">Nature</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {assessment.pain_nature.map((n) => (
                <span key={n} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
        <Field label="Aggravating Factors" value={assessment.pain_aggravating} wide />
        <Field label="Easing Factors" value={assessment.pain_easing} wide />
      </Section>

      {/* Posture (initial only) */}
      {isInitial && (
        <Section title="Posture Assessment">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Anterior View" value={assessment.posture_anterior} />
            <Field label="Lateral View" value={assessment.posture_lateral} />
            <Field label="Posterior View" value={assessment.posture_posterior} />
          </div>
          {assessment.posture_key_findings && assessment.posture_key_findings.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-gray-500">Key Findings</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {assessment.posture_key_findings.map((f) => (
                  <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
          {assessment.body_map && assessment.body_map.markers && assessment.body_map.markers.length > 0 && (
            <div className="mt-4">
              <span className="text-xs text-gray-500 block mb-2">Body Map</span>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                <BodyMapReadOnly markers={assessment.body_map.markers} />
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ROM (initial only) */}
      {isInitial && assessment.spinal_rom && Object.keys(assessment.spinal_rom).length > 0 && (
        <Section title="Spinal Range of Motion">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">Region</th>
                  {['Flexion', 'Extension', 'L.Rotation', 'R.Rotation', 'L.Lateral', 'R.Lateral'].map((m) => (
                    <th key={m} className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200 text-xs">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(assessment.spinal_rom).map(([region, movements]) => (
                  <tr key={region}>
                    <td className="py-2 px-3 font-medium text-gray-800 border border-gray-200">{region}</td>
                    {['Flexion', 'Extension', 'L.Rotation', 'R.Rotation', 'L.Lateral', 'R.Lateral'].map((m) => (
                      <td key={m} className="py-2 px-3 text-gray-600 border border-gray-200 text-xs">
                        {(movements as Record<string, string>)[m] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Muscle Tests (initial only) */}
      {isInitial && assessment.muscle_tests && Object.keys(assessment.muscle_tests).length > 0 && (
        <Section title="Muscle Length Tests">
          <Grid>
            {Object.entries(assessment.muscle_tests).map(([test, result]) => (
              <Field key={test} label={test} value={result} />
            ))}
          </Grid>
        </Section>
      )}

      {/* APPI Elements */}
      {(() => {
        const appiData = isInitial ? assessment.appi_elements : assessment.appi_reassessment;
        if (!appiData || Object.keys(appiData).length === 0) return null;
        return (
          <Section title={isInitial ? 'APPI Key Elements' : 'APPI Re-assessment'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(appiData).map(([key, val]) => {
                const v = val as { rating?: string; notes?: string } | Record<string, string>;
                const rating = 'rating' in v ? v.rating : '';
                const notes = 'notes' in v ? v.notes : '';
                return (
                  <div key={key} className="bg-gray-50 rounded-md p-3">
                    <span className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingBadge rating={rating || ''} />
                      {notes && <span className="text-xs text-gray-600">{notes}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        );
      })()}

      {/* Movement Control (initial only) */}
      {isInitial && assessment.movement_control && Object.keys(assessment.movement_control).length > 0 && (
        <Section title="Movement Control">
          <Grid>
            {Object.entries(assessment.movement_control).map(([ex, rating]) => (
              <div key={ex} className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                <span className="text-xs text-gray-700 capitalize">{ex.replace(/_/g, ' ')}</span>
                <RatingBadge rating={rating} />
              </div>
            ))}
          </Grid>
        </Section>
      )}

      {/* Functional Assessment (initial only) */}
      {isInitial && assessment.functional_assessment && Object.keys(assessment.functional_assessment).length > 0 && (
        <Section title="Functional Assessment">
          <Grid>
            {Object.entries(assessment.functional_assessment).map(([test, result]) => (
              <Field key={test} label={test.replace(/_/g, ' ')} value={result} capitalize />
            ))}
          </Grid>
        </Section>
      )}

      {/* Muscle Slings (initial only) */}
      {isInitial && assessment.muscle_slings && Object.keys(assessment.muscle_slings).length > 0 && (
        <Section title="Muscle Sling Assessment">
          <Grid>
            {Object.entries(assessment.muscle_slings).map(([sling, rating]) => (
              <div key={sling} className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                <span className="text-xs text-gray-700 capitalize">{sling.replace(/_/g, ' ')}</span>
                <RatingBadge rating={rating} />
              </div>
            ))}
          </Grid>
        </Section>
      )}

      {/* Exercise Competency (progress only) */}
      {!isInitial && assessment.exercise_competency && Object.keys(assessment.exercise_competency).length > 0 && (
        <Section title="Exercise Competency">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">Exercise</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200">Form</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200">Control</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200">Endurance</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(assessment.exercise_competency).map(([ex, criteria]) => (
                  <tr key={ex}>
                    <td className="py-2 px-3 text-gray-800 capitalize border border-gray-200">
                      {ex.replace(/_/g, ' ')}
                    </td>
                    {['form', 'control', 'endurance'].map((c) => (
                      <td key={c} className="py-2 px-3 text-center border border-gray-200">
                        <RatingBadge rating={(criteria as Record<string, string>)[c] || ''} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Outcome Measures (progress only) */}
      {!isInitial && assessment.outcome_measures && Object.keys(assessment.outcome_measures).length > 0 && (
        <Section title="Outcome Measures">
          <Grid>
            {Object.entries(assessment.outcome_measures).map(([key, val]) => (
              <Field key={key} label={key.replace(/_/g, ' ')} value={val} capitalize />
            ))}
          </Grid>
        </Section>
      )}

      {/* Clinical Impression & Goals */}
      <Section title={isInitial ? 'Clinical Impression & Goals' : 'Progression Decision'}>
        {isInitial && (
          <>
            <Field label="Clinical Impression" value={assessment.clinical_impression} wide />
            {assessment.short_term_goals && assessment.short_term_goals.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-gray-500">Short-term Goals</span>
                <ul className="mt-1 space-y-1">
                  {assessment.short_term_goals.map((g, i) => (
                    <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">&#8226;</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {assessment.long_term_goals && assessment.long_term_goals.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-gray-500">Long-term Goals</span>
                <ul className="mt-1 space-y-1">
                  {assessment.long_term_goals.map((g, i) => (
                    <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">&#8226;</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Field label="Patient's Own Goals" value={assessment.patient_own_goals} wide />
          </>
        )}

        {!isInitial && (
          <>
            <Grid>
              <Field label="Current Level" value={assessment.current_level} capitalize />
              <Field label="Weeks at Level" value={assessment.weeks_at_level ? String(assessment.weeks_at_level) : undefined} />
              <Field label="Decision" value={assessment.progression_decision} capitalize />
              <Field label="Client Satisfaction" value={assessment.client_satisfaction?.replace(/_/g, ' ')} capitalize />
            </Grid>
            {assessment.progression_decision === 'progress' && (
              <Field label="Next Level" value={assessment.next_level} capitalize />
            )}
            {assessment.progression_decision === 'repeat' && (
              <Field label="Repeat Weeks" value={assessment.repeat_weeks ? String(assessment.repeat_weeks) : undefined} />
            )}
            {assessment.progression_decision === 'modify' && (
              <Field label="Modification Details" value={assessment.modify_details} wide />
            )}
            <Field label="Therapist Notes" value={assessment.therapist_notes} wide />
            <Field label="Next Review Date" value={assessment.next_review_date ? formatDate(assessment.next_review_date) : undefined} />
          </>
        )}
      </Section>

      {/* Programme (initial only) */}
      {isInitial && (
        <Section title="Recommended Programme">
          <Grid>
            <Field label="Starting Level" value={assessment.starting_level} capitalize />
            <Field label="Frequency" value={assessment.frequency} />
            <Field label="Duration" value={assessment.duration} />
            <Field label="Review Weeks" value={assessment.review_weeks ? String(assessment.review_weeks) : undefined} />
            <Field label="Batch Days" value={assessment.batch_days} />
          </Grid>
          {assessment.mode && assessment.mode.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-gray-500">Mode / Equipment</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {assessment.mode.map((m) => (
                  <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Field label="Programme Notes" value={assessment.programme_notes} wide />
          {assessment.info_sheets_provided && assessment.info_sheets_provided.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-gray-500">Info Sheets Provided</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {assessment.info_sheets_provided.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Consent */}
      <Section title="Consent">
        <Grid>
          <Field label="Consent Given" value={assessment.consent_given ? 'Yes' : 'No'} />
          <Field label="Client Signature" value={assessment.client_signature} />
        </Grid>
      </Section>

      {/* Timestamps */}
      <div className="text-xs text-gray-400 text-right">
        Created: {assessment.created_at ? new Date(assessment.created_at).toLocaleString('en-IN') : '-'}
        {assessment.updated_at && (
          <> | Updated: {new Date(assessment.updated_at).toLocaleString('en-IN')}</>
        )}
      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">{children}</div>;
}

function Field({ label, value, wide, capitalize: cap }: {
  label: string;
  value?: string | null;
  wide?: boolean;
  capitalize?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={wide ? 'sm:col-span-2 lg:col-span-3 mt-3' : ''}>
      <span className="text-xs text-gray-500">{label}</span>
      <p className={`font-medium text-gray-800 text-sm mt-0.5 ${cap ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}

function RatingBadge({ rating }: { rating: string }) {
  if (!rating) return <span className="text-xs text-gray-300">-</span>;

  const styles: Record<string, string> = {
    good: 'bg-green-100 text-green-700',
    independent: 'bg-green-100 text-green-700',
    fair: 'bg-amber-100 text-amber-700',
    with_cues: 'bg-amber-100 text-amber-700',
    poor: 'bg-red-100 text-red-700',
    unable: 'bg-red-100 text-red-700',
    weak: 'bg-amber-100 text-amber-700',
    dysfunctional: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
      styles[rating] || 'bg-gray-100 text-gray-700'
    }`}>
      {rating.replace(/_/g, ' ')}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
