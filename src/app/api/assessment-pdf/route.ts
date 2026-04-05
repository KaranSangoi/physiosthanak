import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { AssessmentPDF } from '@/components/admin/pdf/AssessmentPDF';
import type { PilatesAssessment, PilatesRegistration } from '@/types/pilates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing assessment id' },
        { status: 400 },
      );
    }

    // Fetch the assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('pilates_assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 },
      );
    }

    const typedAssessment = assessment as PilatesAssessment;

    // Fetch the student registration
    const { data: student, error: studentError } = await supabase
      .from('pilates_registrations')
      .select('*')
      .eq('id', typedAssessment.student_id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 },
      );
    }

    const typedStudent = student as PilatesRegistration;

    // Generate the PDF buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfElement = React.createElement(AssessmentPDF, {
      assessment: typedAssessment,
      student: typedStudent,
    }) as any;
    const buffer = await renderToBuffer(pdfElement);

    // Build a filename: "Name - Initial Assessment - 3 Apr 2026.pdf"
    const dateStr = new Date(typedAssessment.assessment_date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const typeLabel = typedAssessment.type === 'initial' ? 'Initial Assessment' : 'Progress Assessment';
    const safeName = typedStudent.name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    const filename = `${safeName} - ${typeLabel} - ${dateStr}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 },
    );
  }
}
