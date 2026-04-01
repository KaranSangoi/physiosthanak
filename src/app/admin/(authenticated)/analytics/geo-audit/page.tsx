'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, History, CheckCircle2, XCircle, Minus, Loader2 } from 'lucide-react';

const PROMPTS = [
  'Best physiotherapist in Borivali',
  'Physiotherapy clinic near Borivali West Mumbai',
  'Home visit physiotherapy Borivali',
  'Sports injury physiotherapy Mumbai',
  'Mat Pilates classes Borivali',
  'Dr. Shiva Jain physiotherapy',
  'PhysioSthanak reviews',
  'Online physiotherapy consultation India',
  'Back pain treatment Borivali',
  'Post surgery rehabilitation Mumbai',
  'Pediatric physiotherapy near me Mumbai',
  'Neck pain physiotherapist Borivali West',
  'Physiotherapist led Pilates Mumbai',
  "Women's health physiotherapy Borivali",
  'Physiotherapy home visit near Dahisar Kandivali',
];

const PLATFORMS = ['ChatGPT', 'Perplexity', 'Google AI'];

interface AuditEntry {
  prompt: string;
  platform: string;
  is_cited: boolean;
  is_mentioned: boolean;
  facts_accurate: boolean;
  notes: string;
}

interface SavedAudit {
  id: string;
  audit_date: string;
  prompt: string;
  platform: string;
  is_cited: boolean;
  is_mentioned: boolean;
  facts_accurate: boolean;
  notes: string;
  created_at: string;
}

export default function GeoAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SavedAudit[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>(PLATFORMS[0]);

  // Initialize entries for selected platform
  useEffect(() => {
    setEntries(
      PROMPTS.map((prompt) => ({
        prompt,
        platform: selectedPlatform,
        is_cited: false,
        is_mentioned: false,
        facts_accurate: false,
        notes: '',
      }))
    );
    setSaved(false);
  }, [selectedPlatform]);

  const updateEntry = (index: number, field: keyof AuditEntry, value: boolean | string) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    const rows = entries.map((e) => ({
      audit_date: today,
      prompt: e.prompt,
      platform: e.platform,
      is_cited: e.is_cited,
      is_mentioned: e.is_mentioned,
      facts_accurate: e.facts_accurate,
      notes: e.notes || null,
    }));

    const { error } = await supabase.from('geo_audit_results').insert(rows);

    if (error) {
      console.error('Save audit error:', error.message);
      alert('Failed to save audit results. Please try again.');
    } else {
      setSaved(true);
    }
    setSaving(false);
  };

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('geo_audit_results')
      .select('*')
      .order('audit_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200);

    if (!error && data) {
      setHistory(data);
    }
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    if (showHistory) {
      loadHistory();
    }
  }, [showHistory, loadHistory]);

  // Group history by date
  const historyByDate = history.reduce<Record<string, SavedAudit[]>>((acc, item) => {
    if (!acc[item.audit_date]) acc[item.audit_date] = [];
    acc[item.audit_date].push(item);
    return acc;
  }, {});

  const citedCount = entries.filter((e) => e.is_cited).length;
  const mentionedCount = entries.filter((e) => e.is_mentioned).length;
  const accurateCount = entries.filter((e) => e.facts_accurate).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/analytics"
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Back to analytics"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 normal-case">GEO/AEO Audit Checklist</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
              showHistory
                ? 'bg-[#14507c] text-white border-[#14507c]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <History size={16} />
            {showHistory ? 'Back to Audit' : 'View History'}
          </button>
        </div>
      </div>

      {showHistory ? (
        /* History View */
        <div className="space-y-6">
          {historyLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
              <Loader2 size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading audit history...</p>
            </div>
          ) : Object.keys(historyByDate).length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-sm text-gray-500">No audit history yet. Complete your first audit to see results here.</p>
            </div>
          ) : (
            Object.entries(historyByDate).map(([date, items]) => {
              const cited = items.filter((i) => i.is_cited).length;
              const mentioned = items.filter((i) => i.is_mentioned).length;
              return (
                <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-800">
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{items.length} prompts tested</span>
                      <span className="text-green-600 font-medium">{cited} cited</span>
                      <span className="text-blue-600 font-medium">{mentioned} mentioned</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Prompt</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Platform</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-600">Cited</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-600">Mentioned</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-600">Accurate</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-2 px-3 text-gray-800 max-w-xs truncate">{item.prompt}</td>
                            <td className="py-2 px-3 text-gray-600">{item.platform}</td>
                            <td className="py-2 px-3 text-center">
                              <BoolIcon value={item.is_cited} />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <BoolIcon value={item.is_mentioned} />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <BoolIcon value={item.facts_accurate} />
                            </td>
                            <td className="py-2 px-3 text-gray-500 text-xs max-w-xs truncate">
                              {item.notes || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Audit Form */
        <>
          {/* Platform selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Select Platform to Audit</p>
                <p className="text-xs text-gray-500">Test all 15 prompts on one platform at a time.</p>
              </div>
              <div className="flex gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                      selectedPlatform === p
                        ? 'bg-[#14507c] text-white border-[#14507c]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Cited</p>
              <p className="text-xl font-bold text-green-600">{citedCount}/{PROMPTS.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Mentioned</p>
              <p className="text-xl font-bold text-blue-600">{mentionedCount}/{PROMPTS.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Facts Accurate</p>
              <p className="text-xl font-bold text-purple-600">{accurateCount}/{PROMPTS.length}</p>
            </div>
          </div>

          {/* Audit entries */}
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <div key={entry.prompt} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-medium text-gray-400 mt-1 w-5 shrink-0">
                    {i + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 mb-3">
                      &ldquo;{entry.prompt}&rdquo;
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <ToggleButton
                        label="Cited"
                        active={entry.is_cited}
                        onToggle={() => updateEntry(i, 'is_cited', !entry.is_cited)}
                        activeColor="bg-green-100 text-green-700 border-green-300"
                      />
                      <ToggleButton
                        label="Mentioned"
                        active={entry.is_mentioned}
                        onToggle={() => updateEntry(i, 'is_mentioned', !entry.is_mentioned)}
                        activeColor="bg-blue-100 text-blue-700 border-blue-300"
                      />
                      <ToggleButton
                        label="Facts Accurate"
                        active={entry.facts_accurate}
                        onToggle={() => updateEntry(i, 'facts_accurate', !entry.facts_accurate)}
                        activeColor="bg-purple-100 text-purple-700 border-purple-300"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={entry.notes}
                      onChange={(e) => updateEntry(i, 'notes', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#14507c]/20 focus:border-[#14507c]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save button */}
          <div className="sticky bottom-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg shadow-lg transition-colors ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-[#14507c] text-white hover:bg-[#14507c]/90'
              } disabled:opacity-70`}
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : saved ? (
                <CheckCircle2 size={16} />
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving...' : saved ? 'Saved!' : `Save ${selectedPlatform} Audit`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ToggleButton({
  label,
  active,
  onToggle,
  activeColor,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  activeColor: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
        active ? activeColor : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
      }`}
    >
      {active ? <CheckCircle2 size={14} /> : <Minus size={14} />}
      {label}
    </button>
  );
}

function BoolIcon({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle2 size={16} className="text-green-500 mx-auto" />
  ) : (
    <XCircle size={16} className="text-gray-300 mx-auto" />
  );
}
