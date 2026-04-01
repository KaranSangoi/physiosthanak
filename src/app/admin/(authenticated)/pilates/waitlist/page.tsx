'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserPlus } from 'lucide-react';
import type { PilatesBatch, PilatesRegistration } from '@/types/pilates';

export default function WaitlistPage() {
  const [waitlisted, setWaitlisted] = useState<PilatesRegistration[]>([]);
  const [batches, setBatches] = useState<PilatesBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const loadData = async () => {
    const supabase = createClient();

    const [{ data: waitData }, { data: batchData }] = await Promise.all([
      supabase
        .from('pilates_registrations')
        .select('*')
        .eq('status', 'waitlisted')
        .order('created_at', { ascending: true }),
      supabase
        .from('pilates_batches')
        .select('*')
        .eq('is_active', true)
        .order('name'),
    ]);

    setWaitlisted(waitData || []);
    setBatches(batchData || []);
    setLoading(false);
  };

  const handlePromote = async (reg: PilatesRegistration) => {
    const batchId = selectedBatch[reg.id];
    if (!batchId) {
      setToast({ message: 'Please select a batch first', type: 'error' });
      return;
    }

    const batch = batches.find((b) => b.id === batchId);
    if (!batch) return;

    if (batch.current_count >= batch.capacity) {
      setToast({ message: 'Selected batch is full', type: 'error' });
      return;
    }

    setPromoting(reg.id);
    const supabase = createClient();

    // Update registration
    const { error: regError } = await supabase
      .from('pilates_registrations')
      .update({
        status: 'registered',
        batch_id: batchId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reg.id);

    if (regError) {
      setToast({ message: 'Failed to promote student', type: 'error' });
      setPromoting(null);
      return;
    }

    // Increment batch count
    await supabase
      .from('pilates_batches')
      .update({
        current_count: batch.current_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', batchId);

    setToast({ message: `${reg.name} promoted to ${batch.name}`, type: 'success' });
    setPromoting(null);
    loadData();
  };

  const availableBatches = batches.filter((b) => b.current_count < b.capacity);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-md text-sm font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 normal-case">Waitlist</h2>

      {availableBatches.length === 0 && waitlisted.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
          All active batches are full. Create a new batch or increase capacity to promote waitlisted students.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {waitlisted.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No students on the waitlist.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {waitlisted.map((reg) => (
              <div
                key={reg.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                {/* Student info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm">{reg.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {reg.phone} &middot; {reg.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      reg.preference === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {reg.preference}
                    </span>
                    <span className="text-xs text-gray-400">
                      Waitlisted {new Date(reg.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Promote controls */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedBatch[reg.id] || ''}
                    onChange={(e) =>
                      setSelectedBatch({ ...selectedBatch, [reg.id]: e.target.value })
                    }
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white min-w-[160px]"
                  >
                    <option value="">Select batch...</option>
                    {availableBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.current_count}/{b.capacity})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handlePromote(reg)}
                    disabled={promoting === reg.id || !selectedBatch[reg.id]}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <UserPlus size={14} />
                    {promoting === reg.id ? 'Promoting...' : 'Promote'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        {waitlisted.length} student{waitlisted.length !== 1 ? 's' : ''} on waitlist
      </div>
    </div>
  );
}
