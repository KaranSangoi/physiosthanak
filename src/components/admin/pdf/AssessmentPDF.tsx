import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { PilatesAssessment, PilatesRegistration, BodyMapMarker } from '@/types/pilates';

// ─── COLORS ─────────────────────────────────────────────────────────────────
const BLUE = '#14507c';
const PINK = '#e8899c';
const LIGHT_BLUE = '#e8f0f7';
const LIGHT_PINK = '#fdf0f3';
const LIGHT_GRAY = '#f8f9fa';
const GRAY = '#6b7280';
const DARK = '#1f2937';
const WHITE = '#ffffff';
const RED = '#dc2626';
const GREEN = '#16a34a';
const AMBER = '#d97706';

// ─── STYLES ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: DARK,
  },
  // Header
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: BLUE,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {},
  clinicName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 7,
    color: PINK,
    letterSpacing: 2,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerContact: {
    fontSize: 7,
    color: GRAY,
    marginBottom: 1,
  },
  // Title
  reportTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    textAlign: 'center',
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 8,
    color: GRAY,
    textAlign: 'center',
    marginBottom: 16,
  },
  // Section
  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderBottomColor: PINK,
  },
  // Grid rows
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  fieldContainer: {
    flex: 1,
    paddingRight: 8,
  },
  fieldLabel: {
    fontSize: 7,
    color: GRAY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  fieldValue: {
    fontSize: 9,
    color: DARK,
    fontFamily: 'Helvetica-Bold',
  },
  fieldValueNormal: {
    fontSize: 9,
    color: DARK,
  },
  // Wide field (full width)
  wideField: {
    marginBottom: 6,
  },
  // Table
  table: {
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: BLUE,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    padding: 5,
    borderWidth: 0.5,
    borderColor: BLUE,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: LIGHT_GRAY,
  },
  tableCell: {
    fontSize: 8,
    color: DARK,
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  tableCellBold: {
    fontSize: 8,
    color: DARK,
    fontFamily: 'Helvetica-Bold',
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  // Tags
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 3,
  },
  tag: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: LIGHT_BLUE,
    color: BLUE,
  },
  tagRed: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    color: RED,
  },
  tagPink: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: LIGHT_PINK,
    color: '#be185d',
  },
  // VAS bar
  vasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  vasBarBg: {
    width: 100,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  vasBarFill: {
    height: 8,
    borderRadius: 4,
  },
  vasText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  // Bullet list
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 9,
    color: PINK,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: DARK,
  },
  // Rating badges
  ratingGood: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#dcfce7',
    color: GREEN,
    fontFamily: 'Helvetica-Bold',
  },
  ratingFair: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#fef3c7',
    color: AMBER,
    fontFamily: 'Helvetica-Bold',
  },
  ratingPoor: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    color: RED,
    fontFamily: 'Helvetica-Bold',
  },
  ratingDefault: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: LIGHT_GRAY,
    color: GRAY,
    fontFamily: 'Helvetica-Bold',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: GRAY,
  },
  footerPage: {
    fontSize: 7,
    color: GRAY,
  },
  // Consent box
  consentBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 12,
    marginTop: 6,
    backgroundColor: LIGHT_GRAY,
  },
  consentText: {
    fontSize: 8,
    color: GRAY,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: DARK,
    marginBottom: 4,
    height: 20,
  },
  signatureLabel: {
    fontSize: 7,
    color: GRAY,
    textTransform: 'uppercase',
  },
  signatureName: {
    fontSize: 9,
    color: DARK,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  // Comparison table for progress
  comparisonRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  comparisonLabel: {
    width: '35%',
    fontSize: 8,
    color: GRAY,
    padding: 4,
  },
  comparisonValueInitial: {
    width: '30%',
    fontSize: 8,
    color: DARK,
    padding: 4,
    backgroundColor: LIGHT_GRAY,
    textAlign: 'center',
  },
  comparisonValueCurrent: {
    width: '35%',
    fontSize: 8,
    color: DARK,
    fontFamily: 'Helvetica-Bold',
    padding: 4,
    backgroundColor: LIGHT_BLUE,
    textAlign: 'center',
  },
});

// ─── HELPERS ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getRatingStyle(rating: string) {
  const good = ['good', 'independent', 'functional', 'normal', 'pass'];
  const fair = ['fair', 'with_cues', 'weak', 'moderate', 'partial'];
  const poor = ['poor', 'unable', 'dysfunctional', 'severe', 'fail'];

  const r = rating.toLowerCase();
  if (good.some((g) => r.includes(g))) return s.ratingGood;
  if (fair.some((f) => r.includes(f))) return s.ratingFair;
  if (poor.some((p) => r.includes(p))) return s.ratingPoor;
  return s.ratingDefault;
}

function getVasColor(vas: number): string {
  if (vas <= 3) return GREEN;
  if (vas <= 6) return AMBER;
  return RED;
}

function getVasBar(vas: number): string {
  const filled = Math.round(vas);
  const empty = 10 - filled;
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty);
}

function capitalize(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function Header() {
  return (
    <View fixed>
      <View style={s.headerBar} />
      <View style={s.headerContainer}>
        <View style={s.headerLeft}>
          <Text style={s.clinicName}>PHYSIOSTHANAK</Text>
          <Text style={s.tagline}>MOVE  ·  HEAL  ·  IMPROVE</Text>
        </View>
        <View style={s.headerRight}>
          <Text style={s.headerContact}>Dr. Shiva Jain Sangoi | MPTh (Ortho)</Text>
          <Text style={s.headerContact}>+91 9324254297 | physiosthanak@gmail.com</Text>
          <Text style={s.headerContact}>Borivali West, Mumbai 400092</Text>
        </View>
      </View>
    </View>
  );
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>PhysioSthanak | Move · Heal · Improve | +91 9324254297</Text>
      <Text style={s.footerPage} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={s.sectionHeader}>{title}</Text>;
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <View style={s.row}>{children}</View>;
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <View style={s.fieldContainer}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={s.fieldValue}>{String(value)}</Text>
    </View>
  );
}

function WideField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={s.wideField}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={s.fieldValueNormal}>{value}</Text>
    </View>
  );
}

function RatingBadge({ rating }: { rating: string }) {
  if (!rating) return <Text style={s.ratingDefault}>-</Text>;
  return <Text style={getRatingStyle(rating)}>{capitalize(rating)}</Text>;
}

// ─── INITIAL ASSESSMENT PAGES ───────────────────────────────────────────────

function InitialAssessmentPages({
  assessment: a,
  student,
}: {
  assessment: PilatesAssessment;
  student: PilatesRegistration;
}) {
  return (
    <>
      {/* Page 1: Client Info */}
      <Page size="A4" style={s.page}>
        <Header />
        <Text style={s.reportTitle}>Mat Pilates — Initial Assessment Report</Text>
        <Text style={s.reportSubtitle}>
          Assessment Date: {formatDate(a.assessment_date)} | Assessor: {a.assessor_name}
        </Text>

        <View style={s.section}>
          <SectionTitle title="Client Information" />
          <FieldRow>
            <Field label="Name" value={student.name} />
            <Field label="Age" value={student.age} />
            <Field label="Gender" value={a.gender ? capitalize(a.gender) : undefined} />
          </FieldRow>
          <FieldRow>
            <Field label="Phone" value={student.phone} />
            <Field label="Email" value={student.email} />
            <Field label="Occupation" value={a.occupation} />
          </FieldRow>
          <FieldRow>
            <Field label="Emergency Contact" value={a.emergency_contact} />
            <Field label="Relation" value={a.emergency_relation} />
            <Field label="Referred By" value={a.referred_by} />
          </FieldRow>
        </View>

        <View style={s.section}>
          <SectionTitle title="History of Presenting Complaint" />
          <WideField label="Presenting Complaint" value={a.presenting_complaint} />
          <WideField label="Past Medical History" value={a.past_medical_history} />
          <WideField label="Medications / Supplements" value={a.medications_supplements} />

          {a.red_flags && Object.entries(a.red_flags).some(([, v]) => v) && (
            <View style={{ marginTop: 6 }}>
              <Text style={s.fieldLabel}>Red Flags</Text>
              <View style={s.tagContainer}>
                {Object.entries(a.red_flags)
                  .filter(([, v]) => v)
                  .map(([flag]) => (
                    <Text key={flag} style={s.tagRed}>{capitalize(flag)}</Text>
                  ))}
              </View>
            </View>
          )}
        </View>

        <View style={s.section}>
          <SectionTitle title="Activity Level & Lifestyle" />
          <FieldRow>
            <Field label="Activity Level" value={a.activity_level ? capitalize(a.activity_level) : undefined} />
            <Field label="Exercise Type" value={a.exercise_type} />
            <Field label="Sitting Hours/Day" value={a.sitting_hours} />
          </FieldRow>
          <FieldRow>
            <Field label="Sleep Quality" value={a.sleep_quality} />
            <Field label="Stress Level" value={a.stress_level ? capitalize(a.stress_level) : undefined} />
            <Field label="Smoking" value={a.smoking ? capitalize(a.smoking) : undefined} />
          </FieldRow>
        </View>

        <Footer />
      </Page>

      {/* Page 2: Pain & Posture */}
      <Page size="A4" style={s.page}>
        <Header />

        <View style={s.section}>
          <SectionTitle title="Pain Assessment" />
          <FieldRow>
            <Field label="Location" value={a.pain_location} />
            <Field label="Duration" value={a.pain_duration} />
            <Field label="Frequency" value={a.pain_frequency ? capitalize(a.pain_frequency) : undefined} />
          </FieldRow>

          {a.pain_vas !== undefined && a.pain_vas !== null && (
            <View style={{ marginBottom: 6 }}>
              <Text style={s.fieldLabel}>VAS Score</Text>
              <View style={s.vasContainer}>
                <View style={s.vasBarBg}>
                  <View
                    style={[
                      s.vasBarFill,
                      {
                        width: `${(a.pain_vas / 10) * 100}%`,
                        backgroundColor: getVasColor(a.pain_vas),
                      },
                    ]}
                  />
                </View>
                <Text style={[s.vasText, { color: getVasColor(a.pain_vas) }]}>
                  {a.pain_vas}/10
                </Text>
                <Text style={{ fontSize: 8, color: GRAY, fontFamily: 'Courier' }}>
                  {getVasBar(a.pain_vas)}
                </Text>
              </View>
            </View>
          )}

          {a.pain_nature && a.pain_nature.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <Text style={s.fieldLabel}>Nature of Pain</Text>
              <View style={s.tagContainer}>
                {a.pain_nature.map((n) => (
                  <Text key={n} style={s.tag}>{capitalize(n)}</Text>
                ))}
              </View>
            </View>
          )}

          <WideField label="Aggravating Factors" value={a.pain_aggravating} />
          <WideField label="Easing Factors" value={a.pain_easing} />
        </View>

        <View style={s.section}>
          <SectionTitle title="Posture Assessment" />
          <FieldRow>
            <Field label="Anterior View" value={a.posture_anterior} />
            <Field label="Lateral View" value={a.posture_lateral} />
            <Field label="Posterior View" value={a.posture_posterior} />
          </FieldRow>

          {a.posture_key_findings && a.posture_key_findings.length > 0 && (
            <View style={{ marginTop: 4 }}>
              <Text style={s.fieldLabel}>Key Findings</Text>
              <View style={s.tagContainer}>
                {a.posture_key_findings.map((f) => (
                  <Text key={f} style={s.tagPink}>{f}</Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Body Map as text table */}
        {a.body_map?.markers && a.body_map.markers.length > 0 && (
          <View style={s.section}>
            <SectionTitle title="Body Map Findings" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '25%' }]}>Region</Text>
                <Text style={[s.tableHeaderCell, { width: '15%' }]}>View</Text>
                <Text style={[s.tableHeaderCell, { width: '18%' }]}>Type</Text>
                <Text style={[s.tableHeaderCell, { width: '15%' }]}>Severity</Text>
                <Text style={[s.tableHeaderCell, { width: '27%' }]}>Note</Text>
              </View>
              {a.body_map.markers.map((m: BodyMapMarker, i: number) => (
                <View key={m.id} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCellBold, { width: '25%' }]}>{m.region}</Text>
                  <Text style={[s.tableCell, { width: '15%' }]}>{capitalize(m.view)}</Text>
                  <Text style={[s.tableCell, { width: '18%' }]}>{capitalize(m.type)}</Text>
                  <Text style={[s.tableCell, { width: '15%' }]}>{capitalize(m.severity)}</Text>
                  <Text style={[s.tableCell, { width: '27%' }]}>{m.note || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Footer />
      </Page>

      {/* Page 3: Physical Assessment */}
      <Page size="A4" style={s.page}>
        <Header />

        {/* Spinal ROM */}
        {a.spinal_rom && Object.keys(a.spinal_rom).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="Spinal Range of Motion" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '16%' }]}>Region</Text>
                {['Flexion', 'Extension', 'L.Rotation', 'R.Rotation', 'L.Lateral', 'R.Lateral'].map((m) => (
                  <Text key={m} style={[s.tableHeaderCell, { width: '14%' }]}>{m}</Text>
                ))}
              </View>
              {Object.entries(a.spinal_rom).map(([region, movements], i) => (
                <View key={region} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCellBold, { width: '16%' }]}>{region}</Text>
                  {['Flexion', 'Extension', 'L.Rotation', 'R.Rotation', 'L.Lateral', 'R.Lateral'].map((m) => (
                    <Text key={m} style={[s.tableCell, { width: '14%', textAlign: 'center' }]}>
                      {(movements as Record<string, string>)[m] || '-'}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Muscle Length Tests */}
        {a.muscle_tests && Object.keys(a.muscle_tests).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="Muscle Length Tests" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '50%' }]}>Test</Text>
                <Text style={[s.tableHeaderCell, { width: '50%' }]}>Result</Text>
              </View>
              {Object.entries(a.muscle_tests).map(([test, result], i) => (
                <View key={test} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCellBold, { width: '50%' }]}>{capitalize(test)}</Text>
                  <Text style={[s.tableCell, { width: '50%' }]}>{result || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {a.additional_tests && (
          <WideField label="Additional Tests" value={a.additional_tests} />
        )}

        {/* APPI 5 Key Elements */}
        {a.appi_elements && Object.keys(a.appi_elements).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="APPI 5 Key Elements" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '35%' }]}>Element</Text>
                <Text style={[s.tableHeaderCell, { width: '25%' }]}>Rating</Text>
                <Text style={[s.tableHeaderCell, { width: '40%' }]}>Notes</Text>
              </View>
              {Object.entries(a.appi_elements).map(([key, val], i) => {
                const v = val as { rating?: string; notes?: string };
                return (
                  <View key={key} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                    <Text style={[s.tableCellBold, { width: '35%' }]}>{capitalize(key)}</Text>
                    <View style={[{ width: '25%', padding: 5, borderWidth: 0.5, borderColor: '#e5e7eb', justifyContent: 'center' }]}>
                      <RatingBadge rating={v.rating || ''} />
                    </View>
                    <Text style={[s.tableCell, { width: '40%' }]}>{v.notes || '-'}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <Footer />
      </Page>

      {/* Page 4: Movement & Functional */}
      <Page size="A4" style={s.page}>
        <Header />

        {/* Movement Control */}
        {a.movement_control && Object.keys(a.movement_control).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="Movement Dissociation & Control" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '60%' }]}>Exercise</Text>
                <Text style={[s.tableHeaderCell, { width: '40%' }]}>Rating</Text>
              </View>
              {Object.entries(a.movement_control).map(([ex, rating], i) => (
                <View key={ex} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCellBold, { width: '60%' }]}>{capitalize(ex)}</Text>
                  <View style={[{ width: '40%', padding: 5, borderWidth: 0.5, borderColor: '#e5e7eb', justifyContent: 'center' }]}>
                    <RatingBadge rating={rating} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Functional Assessment */}
        {a.functional_assessment && Object.keys(a.functional_assessment).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="Functional Assessment" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '50%' }]}>Test</Text>
                <Text style={[s.tableHeaderCell, { width: '50%' }]}>Result</Text>
              </View>
              {Object.entries(a.functional_assessment).map(([test, result], i) => (
                <View key={test} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCellBold, { width: '50%' }]}>{capitalize(test)}</Text>
                  <Text style={[s.tableCell, { width: '50%' }]}>{capitalize(result)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Muscle Slings */}
        {a.muscle_slings && Object.keys(a.muscle_slings).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="Muscle Sling Assessment" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '60%' }]}>Sling</Text>
                <Text style={[s.tableHeaderCell, { width: '40%' }]}>Rating</Text>
              </View>
              {Object.entries(a.muscle_slings).map(([sling, rating], i) => (
                <View key={sling} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCellBold, { width: '60%' }]}>{capitalize(sling)}</Text>
                  <View style={[{ width: '40%', padding: 5, borderWidth: 0.5, borderColor: '#e5e7eb', justifyContent: 'center' }]}>
                    <RatingBadge rating={rating} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <Footer />
      </Page>

      {/* Page 5: Goals & Programme */}
      <Page size="A4" style={s.page}>
        <Header />

        <View style={s.section}>
          <SectionTitle title="Clinical Impression & Goals" />
          <WideField label="Clinical Impression" value={a.clinical_impression} />

          {a.short_term_goals && a.short_term_goals.length > 0 && (
            <View style={{ marginTop: 6 }}>
              <Text style={s.fieldLabel}>Short-term Goals</Text>
              {a.short_term_goals.map((g, i) => (
                <View key={i} style={s.bulletItem}>
                  <Text style={s.bulletDot}>{i + 1}.</Text>
                  <Text style={s.bulletText}>{g}</Text>
                </View>
              ))}
            </View>
          )}

          {a.long_term_goals && a.long_term_goals.length > 0 && (
            <View style={{ marginTop: 6 }}>
              <Text style={s.fieldLabel}>Long-term Goals</Text>
              {a.long_term_goals.map((g, i) => (
                <View key={i} style={s.bulletItem}>
                  <Text style={s.bulletDot}>{i + 1}.</Text>
                  <Text style={s.bulletText}>{g}</Text>
                </View>
              ))}
            </View>
          )}

          <WideField label="Patient's Own Goals" value={a.patient_own_goals} />
        </View>

        <View style={s.section}>
          <SectionTitle title="Recommended Programme" />
          <FieldRow>
            <Field label="Starting Level" value={a.starting_level ? capitalize(a.starting_level) : undefined} />
            <Field label="Frequency" value={a.frequency} />
            <Field label="Duration" value={a.duration} />
          </FieldRow>
          <FieldRow>
            <Field label="Review Period" value={a.review_weeks ? `${a.review_weeks} weeks` : undefined} />
            <Field label="Batch Days" value={a.batch_days} />
            <Field label="" value="" />
          </FieldRow>

          {a.mode && a.mode.length > 0 && (
            <View style={{ marginTop: 4 }}>
              <Text style={s.fieldLabel}>Mode / Equipment</Text>
              <View style={s.tagContainer}>
                {a.mode.map((m) => (
                  <Text key={m} style={s.tag}>{m}</Text>
                ))}
              </View>
            </View>
          )}

          <WideField label="Programme Notes" value={a.programme_notes} />

          {a.info_sheets_provided && a.info_sheets_provided.length > 0 && (
            <View style={{ marginTop: 4 }}>
              <Text style={s.fieldLabel}>Information Sheets Provided</Text>
              <View style={s.tagContainer}>
                {a.info_sheets_provided.map((sheet) => (
                  <Text key={sheet} style={s.tag}>{sheet}</Text>
                ))}
              </View>
            </View>
          )}
        </View>

        <Footer />
      </Page>

      {/* Page 6: Consent */}
      <Page size="A4" style={s.page}>
        <Header />

        <View style={s.section}>
          <SectionTitle title="Consent & Declaration" />
          <View style={s.consentBox}>
            <Text style={s.consentText}>
              I hereby confirm that the information provided above is accurate to the best of my knowledge.
              I understand and consent to the Mat Pilates programme recommended by the physiotherapist.
              I have been informed about the nature of the exercises, potential risks, and expected outcomes.
              I agree to follow the prescribed programme and report any discomfort or adverse effects immediately.
            </Text>

            <View style={s.signatureRow}>
              <View style={s.signatureBlock}>
                {a.client_signature && (
                  <Text style={s.signatureName}>{a.client_signature}</Text>
                )}
                <View style={s.signatureLine} />
                <Text style={s.signatureLabel}>Client Signature</Text>
              </View>
              <View style={s.signatureBlock}>
                <Text style={s.signatureName}>{a.assessor_name}</Text>
                <View style={s.signatureLine} />
                <Text style={s.signatureLabel}>Therapist</Text>
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={[s.fieldLabel, { fontSize: 8 }]}>
                Date: {formatDate(a.assessment_date)}
              </Text>
              <Text style={[s.fieldLabel, { fontSize: 8, marginTop: 2 }]}>
                Consent: {a.consent_given ? 'Given' : 'Not given'}
              </Text>
            </View>
          </View>
        </View>

        <Footer />
      </Page>
    </>
  );
}

// ─── PROGRESS ASSESSMENT PAGES ──────────────────────────────────────────────

function ProgressAssessmentPages({
  assessment: a,
  student,
}: {
  assessment: PilatesAssessment;
  student: PilatesRegistration;
}) {
  return (
    <>
      {/* Page 1: Header + Pain Re-assessment */}
      <Page size="A4" style={s.page}>
        <Header />
        <Text style={s.reportTitle}>Mat Pilates — Progress Assessment Report</Text>
        <Text style={s.reportSubtitle}>
          Assessment Date: {formatDate(a.assessment_date)} | Assessor: {a.assessor_name}
          {a.session_number ? ` | Session #${a.session_number}` : ''}
        </Text>

        <View style={s.section}>
          <SectionTitle title="Client Information" />
          <FieldRow>
            <Field label="Name" value={student.name} />
            <Field label="Age" value={student.age} />
            <Field label="Phone" value={student.phone} />
          </FieldRow>
          <FieldRow>
            <Field label="Current Level" value={a.current_level ? capitalize(a.current_level) : undefined} />
            <Field label="Weeks at Level" value={a.weeks_at_level} />
            <Field label="Email" value={student.email} />
          </FieldRow>
        </View>

        {/* Pain Re-assessment */}
        <View style={s.section}>
          <SectionTitle title="Pain Re-assessment" />
          <FieldRow>
            <Field label="Location" value={a.pain_location} />
            <Field label="Duration" value={a.pain_duration} />
            <Field label="Frequency" value={a.pain_frequency ? capitalize(a.pain_frequency) : undefined} />
          </FieldRow>

          {a.pain_vas !== undefined && a.pain_vas !== null && (
            <View style={{ marginBottom: 6 }}>
              <Text style={s.fieldLabel}>Current VAS Score</Text>
              <View style={s.vasContainer}>
                <View style={s.vasBarBg}>
                  <View
                    style={[
                      s.vasBarFill,
                      {
                        width: `${(a.pain_vas / 10) * 100}%`,
                        backgroundColor: getVasColor(a.pain_vas),
                      },
                    ]}
                  />
                </View>
                <Text style={[s.vasText, { color: getVasColor(a.pain_vas) }]}>
                  {a.pain_vas}/10
                </Text>
                <Text style={{ fontSize: 8, color: GRAY, fontFamily: 'Courier' }}>
                  {getVasBar(a.pain_vas)}
                </Text>
              </View>
            </View>
          )}

          {a.pain_nature && a.pain_nature.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <Text style={s.fieldLabel}>Nature of Pain</Text>
              <View style={s.tagContainer}>
                {a.pain_nature.map((n) => (
                  <Text key={n} style={s.tag}>{capitalize(n)}</Text>
                ))}
              </View>
            </View>
          )}

          <WideField label="Aggravating Factors" value={a.pain_aggravating} />
          <WideField label="Easing Factors" value={a.pain_easing} />
        </View>

        {/* APPI Re-assessment */}
        {a.appi_reassessment && Object.keys(a.appi_reassessment).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="APPI Re-assessment" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '30%' }]}>Element</Text>
                <Text style={[s.tableHeaderCell, { width: '25%' }]}>Initial</Text>
                <Text style={[s.tableHeaderCell, { width: '25%' }]}>Current</Text>
                <Text style={[s.tableHeaderCell, { width: '20%' }]}>Notes</Text>
              </View>
              {Object.entries(a.appi_reassessment).map(([key, val], i) => {
                const v = val as Record<string, string>;
                return (
                  <View key={key} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                    <Text style={[s.tableCellBold, { width: '30%' }]}>{capitalize(key)}</Text>
                    <View style={[{ width: '25%', padding: 5, borderWidth: 0.5, borderColor: '#e5e7eb', justifyContent: 'center' }]}>
                      <RatingBadge rating={v.initial || ''} />
                    </View>
                    <View style={[{ width: '25%', padding: 5, borderWidth: 0.5, borderColor: '#e5e7eb', justifyContent: 'center' }]}>
                      <RatingBadge rating={v.current || ''} />
                    </View>
                    <Text style={[s.tableCell, { width: '20%' }]}>{v.notes || '-'}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <Footer />
      </Page>

      {/* Page 2: Competency + Outcomes + Progression */}
      <Page size="A4" style={s.page}>
        <Header />

        {/* Exercise Competency */}
        {a.exercise_competency && Object.keys(a.exercise_competency).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="Exercise Competency" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '30%' }]}>Exercise</Text>
                <Text style={[s.tableHeaderCell, { width: '23%' }]}>Form</Text>
                <Text style={[s.tableHeaderCell, { width: '24%' }]}>Control</Text>
                <Text style={[s.tableHeaderCell, { width: '23%' }]}>Endurance</Text>
              </View>
              {Object.entries(a.exercise_competency).map(([ex, criteria], i) => {
                const c = criteria as Record<string, string>;
                return (
                  <View key={ex} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                    <Text style={[s.tableCellBold, { width: '30%' }]}>{capitalize(ex)}</Text>
                    {['form', 'control', 'endurance'].map((criterion) => (
                      <View key={criterion} style={[{ width: criterion === 'control' ? '24%' : '23%', padding: 5, borderWidth: 0.5, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }]}>
                        <RatingBadge rating={c[criterion] || ''} />
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Outcome Measures */}
        {a.outcome_measures && Object.keys(a.outcome_measures).length > 0 && (
          <View style={s.section}>
            <SectionTitle title="Outcome Measures" />
            <View style={s.table}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: '50%' }]}>Measure</Text>
                <Text style={[s.tableHeaderCell, { width: '50%' }]}>Result</Text>
              </View>
              {Object.entries(a.outcome_measures).map(([key, val], i) => (
                <View key={key} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCellBold, { width: '50%' }]}>{capitalize(key)}</Text>
                  <Text style={[s.tableCell, { width: '50%' }]}>{capitalize(val)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Progression Decision */}
        <View style={s.section}>
          <SectionTitle title="Progression Decision" />
          <FieldRow>
            <Field label="Decision" value={a.progression_decision ? capitalize(a.progression_decision) : undefined} />
            <Field label="Client Satisfaction" value={a.client_satisfaction ? capitalize(a.client_satisfaction.replace(/_/g, ' ')) : undefined} />
            <Field label="" value="" />
          </FieldRow>

          {a.progression_decision === 'progress' && (
            <FieldRow>
              <Field label="Next Level" value={a.next_level ? capitalize(a.next_level) : undefined} />
            </FieldRow>
          )}
          {a.progression_decision === 'repeat' && (
            <FieldRow>
              <Field label="Repeat Weeks" value={a.repeat_weeks} />
            </FieldRow>
          )}
          {a.progression_decision === 'modify' && (
            <WideField label="Modification Details" value={a.modify_details} />
          )}

          <WideField label="Therapist Notes" value={a.therapist_notes} />
          <Field label="Next Review Date" value={a.next_review_date ? formatDate(a.next_review_date) : undefined} />
        </View>

        {/* Consent */}
        <View style={s.section}>
          <SectionTitle title="Consent" />
          <FieldRow>
            <Field label="Consent Given" value={a.consent_given ? 'Yes' : 'No'} />
            <Field label="Client Signature" value={a.client_signature} />
            <Field label="Date" value={formatDate(a.assessment_date)} />
          </FieldRow>
        </View>

        <Footer />
      </Page>
    </>
  );
}

// ─── MAIN DOCUMENT ──────────────────────────────────────────────────────────

interface AssessmentPDFProps {
  assessment: PilatesAssessment;
  student: PilatesRegistration;
}

export function AssessmentPDF({ assessment, student }: AssessmentPDFProps) {
  const isInitial = assessment.type === 'initial';

  return (
    <Document
      title={`${student.name} - ${isInitial ? 'Initial' : 'Progress'} Assessment - PhysioSthanak`}
      author="Dr. Shiva Jain Sangoi - PhysioSthanak"
      subject="Mat Pilates Assessment Report"
      creator="PhysioSthanak"
    >
      {isInitial ? (
        <InitialAssessmentPages assessment={assessment} student={student} />
      ) : (
        <ProgressAssessmentPages assessment={assessment} student={student} />
      )}
    </Document>
  );
}
