'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, X, ChevronDown } from 'lucide-react';
import type { PilatesBatch, PilatesRegistration } from '@/types/pilates';

type RegistrationWithBatch = PilatesRegistration & { batch_name: string };

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationWithBatch[]>([]);
  const [batches, setBatches] = useState<PilatesBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [selectedReg, setSelectedReg] = useState<RegistrationWithBatch | null>(null);
  const [editForm, setEditForm] = useState({
    payment_status: '' as string,
    consultation_status: '' as string,
    notes: '' as string,
    batch_id: '' as string,
  });
  const [saving, setSaving] = useState(false);
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

    const [{ data: regData }, { data: batchData }] = await Promise.all([
      supabase
        .from('pilates_registrations')
        .select('*, pilates_batches(name)')
        .order('created_at', { ascending: false }),
      supabase
        .from('pilates_batches')
        .select('*')
        .order('name'),
    ]);

    const mapped = (regData || []).map((r: Record<string, unknown>) => ({
      ...r,
      batch_name: (r.pilates_batches as { name: string } | null)?.name || 'Unassigned',
    })) as RegistrationWithBatch[];

    setRegistrations(mapped);
    setBatches(batchData || []);
    setLoading(false);
  };

  const openDetail = (reg: RegistrationWithBatch) => {
    setSelectedReg(reg);
    setEditForm({
      payment_status: reg.payment_status,
      consultation_status: reg.consultation_status,
      notes: reg.notes || '',
      batch_id: reg.batch_id || '',
    });
  };

  const handleSave = async () => {
    if (!selectedReg) return;
    setSaving(true);

    const supabase = createClient();

    const updates: Record<string, unknown> = {
      payment_status: editForm.payment_status,
      consultation_status: editForm.consultation_status,
      notes: editForm.notes || null,
      updated_at: new Date().toISOString(),
    };

    // Handle batch change
    if (editForm.batch_id !== (selectedReg.batch_id || '')) {
      updates.batch_id = editForm.batch_id || null;

      // Decrement old batch count
      if (selectedReg.batch_id) {
        const oldBatch = batches.find(b => b.id === selectedReg.batch_id);
        if (oldBatch) {
          await supabase
            .from('pilates_batches')
            .update({ current_count: Math.max(0, oldBatch.current_count - 1) })
            .eq('id', selectedReg.batch_id);
        }
      }

      // Increment new batch count
      if (editForm.batch_id) {
        const newBatch = batches.find(b => b.id === editForm.batch_id);
        if (newBatch) {
          await supabase
            .from('pilates_batches')
            .update({ current_count: newBatch.current_count + 1 })
            .eq('id', editForm.batch_id);
        }
      }
    }

    const { error } = await supabase
      .from('pilates_registrations')
      .update(updates)
      .eq('id', selectedReg.id);

    if (error) {
      setToast({ message: 'Failed to update registration', type: 'error' });
    } else {
      setToast({ message: 'Registration updated', type: 'success' });
      setSelectedReg(null);
      loadData();
    }

    setSaving(false);
  };

  const handleCancel = async () => {
    if (!selectedReg) return;
    const confirmed = window.confirm(`Cancel registration for ${selectedReg.name}?`);
    if (!confirmed) return;

    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('pilates_registrations')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedReg.id);

    // Decrement batch count if assigned
    if (!error && selectedReg.batch_id) {
      const batch = batches.find(b => b.id === selectedReg.batch_id);
      if (batch) {
        await supabase
          .from('pilates_batches')
          .update({ current_count: Math.max(0, batch.current_count - 1) })
          .eq('id', selectedReg.batch_id);
      }
    }

    if (error) {
      setToast({ message: 'Failed to cancel registration', type: 'error' });
    } else {
      setToast({ message: 'Registration cancelled', type: 'success' });
      setSelectedReg(null);
      loadData();
    }

    setSaving(false);
  };

  // Filter logic
  const filtered = registrations.filter((reg) => {
    if (statusFilter !== 'all' && reg.status !== statusFilter) return false;
    if (paymentFilter !== 'all' && reg.payment_status !== paymentFilter) return false;
    if (batchFilter !== 'all' && reg.batch_id !== batchFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        reg.name.toLowerCase().includes(q) ||
        reg.phone.toLowerCase().includes(q) ||
        reg.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
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

      <h2 className="text-xl font-semibold text-gray-800 normal-case">Registrations</h2>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, or email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="registered">Registered</option>
              <option value="confirmed">Confirmed</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Payment filter */}
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white"
            >
              <option value="all">All Payment</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Batch filter */}
          <div className="relative">
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            {registrations.length === 0
              ? 'No registrations yet.'
              : 'No registrations match the current filters.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Batch</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Payment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Consultation</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => (
                <tr
                  key={reg.id}
                  onClick={() => openDetail(reg)}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{reg.name}</td>
                  <td className="py-3 px-4 text-gray-600">{reg.phone}</td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{reg.email}</td>
                  <td className="py-3 px-4 text-gray-600">{reg.batch_name}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={reg.status} />
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <PaymentBadge status={reg.payment_status} />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <ConsultationBadge status={reg.consultation_status} />
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">
                    {new Date(reg.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Showing {filtered.length} of {registrations.length} registrations
      </div>

      {/* Detail Panel (modal) */}
      {selectedReg && (
        <div className="fixed inset-0 z-[150] flex items-start justify-end bg-black/40">
          <div className="bg-white h-full w-full max-w-lg shadow-xl overflow-y-auto">
            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Registration Details</h3>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info (read-only) */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Student Info</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Name</span>
                    <p className="font-medium text-gray-800">{selectedReg.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone</span>
                    <p className="font-medium text-gray-800">{selectedReg.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email</span>
                    <p className="font-medium text-gray-800">{selectedReg.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Age</span>
                    <p className="font-medium text-gray-800">{selectedReg.age || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Preference</span>
                    <p className="font-medium text-gray-800 capitalize">{selectedReg.preference}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status</span>
                    <p><StatusBadge status={selectedReg.status} /></p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Medical History</span>
                    <p className="font-medium text-gray-800">{selectedReg.medical_history || 'None reported'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Registered</span>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedReg.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Update</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                    <select
                      value={editForm.batch_id}
                      onChange={(e) => setEditForm({ ...editForm, batch_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                    >
                      <option value="">Unassigned</option>
                      {batches.filter(b => b.is_active).map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.current_count}/{b.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <select
                      value={editForm.payment_status}
                      onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Status</label>
                    <select
                      value={editForm.consultation_status}
                      onChange={(e) => setEditForm({ ...editForm, consultation_status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
                      placeholder="Add notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                {selectedReg.status !== 'cancelled' && (
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="py-2.5 px-4 border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Cancel Reg.
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    registered: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    waitlisted: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700',
    partial: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

function ConsultationBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    scheduled: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
