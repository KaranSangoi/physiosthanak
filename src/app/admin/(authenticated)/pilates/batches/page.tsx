'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, ToggleLeft, ToggleRight, X } from 'lucide-react';
import type { PilatesBatch } from '@/types/pilates';

interface BatchForm {
  name: string;
  type: 'online' | 'offline';
  days: string;
  time: string;
  schedule: string;
  capacity: number;
}

const EMPTY_FORM: BatchForm = {
  name: '',
  type: 'offline',
  days: '',
  time: '',
  schedule: '',
  capacity: 10,
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<PilatesBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BatchForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const loadBatches = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pilates_batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setToast({ message: 'Failed to load batches', type: 'error' });
    } else {
      setBatches(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (batch: PilatesBatch) => {
    setForm({
      name: batch.name,
      type: batch.type,
      days: batch.days,
      time: batch.time,
      schedule: batch.schedule,
      capacity: batch.capacity,
    });
    setEditingId(batch.id);
    setShowModal(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

    if (editingId) {
      // Update
      const { error } = await supabase
        .from('pilates_batches')
        .update({
          name: form.name,
          type: form.type,
          days: form.days,
          time: form.time,
          schedule: form.schedule,
          capacity: form.capacity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) {
        setToast({ message: 'Failed to update batch', type: 'error' });
      } else {
        setToast({ message: 'Batch updated successfully', type: 'success' });
      }
    } else {
      // Create
      const { error } = await supabase.from('pilates_batches').insert({
        name: form.name,
        type: form.type,
        days: form.days,
        time: form.time,
        schedule: form.schedule,
        capacity: form.capacity,
        current_count: 0,
        is_active: true,
      });

      if (error) {
        setToast({ message: 'Failed to create batch', type: 'error' });
      } else {
        setToast({ message: 'Batch created successfully', type: 'success' });
      }
    }

    setSaving(false);
    setShowModal(false);
    loadBatches();
  };

  const toggleActive = async (batch: PilatesBatch) => {
    if (batch.is_active && batch.current_count > 0) {
      const confirmed = window.confirm(
        `This batch has ${batch.current_count} active registration(s). Are you sure you want to deactivate it?`
      );
      if (!confirmed) return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('pilates_batches')
      .update({
        is_active: !batch.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', batch.id);

    if (error) {
      setToast({ message: 'Failed to update batch status', type: 'error' });
    } else {
      setToast({
        message: `Batch ${batch.is_active ? 'deactivated' : 'activated'}`,
        type: 'success',
      });
      loadBatches();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-full mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 normal-case">Batches</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors"
        >
          <Plus size={16} />
          New Batch
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        {batches.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No batches yet. Create your first batch to get started.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Days</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Capacity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{batch.name}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      batch.type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {batch.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{batch.days}</td>
                  <td className="py-3 px-4 text-gray-600">{batch.time}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {batch.current_count}/{batch.capacity}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      batch.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {batch.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(batch)}
                        className="p-1.5 text-gray-500 hover:text-[#14507c] hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => toggleActive(batch)}
                        className={`p-1.5 rounded transition-colors ${
                          batch.is_active
                            ? 'text-green-600 hover:text-red-600 hover:bg-red-50'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={batch.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {batch.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Edit Batch' : 'Create New Batch'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  placeholder="e.g., Morning Batch A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'online' | 'offline' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                >
                  <option value="offline">Offline (At Clinic)</option>
                  <option value="online">Online (Video Call)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                <input
                  type="text"
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  placeholder="e.g., Mon, Wed, Fri"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  placeholder="e.g., 7:00 AM - 8:00 AM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Description</label>
                <input
                  type="text"
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  placeholder="e.g., 3 sessions/week"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
                  required
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
