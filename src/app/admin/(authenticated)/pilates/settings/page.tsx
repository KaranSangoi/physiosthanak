'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PilatesAdminSetting } from '@/types/pilates';
import { X, Plus } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<PilatesAdminSetting[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const loadSettings = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pilates_admin_settings')
      .select('*');

    if (!error && data) {
      setSettings(data);
      // Check both key names (notification_emails and notification_email)
      const emailSetting = data.find((s) => s.key === 'notification_emails' || s.key === 'notification_email');
      if (emailSetting && emailSetting.value) {
        setEmails(emailSetting.value.split(',').map((e: string) => e.trim()).filter(Boolean));
      }
    }
    setLoading(false);
  };

  const addEmail = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) return;
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setToast({ message: 'Invalid email format', type: 'error' });
      return;
    }
    if (emails.includes(trimmed)) {
      setToast({ message: 'Email already added', type: 'error' });
      return;
    }
    setEmails([...emails, trimmed]);
    setNewEmail('');
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (emails.length === 0) {
      setToast({ message: 'Add at least one email', type: 'error' });
      return;
    }
    setSaving(true);

    const supabase = createClient();
    const emailValue = emails.join(', ');

    // Check if setting exists (try both key names)
    const existing = settings.find((s) => s.key === 'notification_emails' || s.key === 'notification_email');

    if (existing) {
      const { error } = await supabase
        .from('pilates_admin_settings')
        .update({ value: emailValue, key: 'notification_emails' })
        .eq('id', existing.id);

      if (error) {
        setToast({ message: 'Failed to save: ' + error.message, type: 'error' });
      } else {
        setToast({ message: 'Settings saved successfully', type: 'success' });
        loadSettings();
      }
    } else {
      const { error } = await supabase.from('pilates_admin_settings').insert({
        key: 'notification_emails',
        value: emailValue,
      });

      if (error) {
        setToast({ message: 'Failed to save: ' + error.message, type: 'error' });
      } else {
        setToast({ message: 'Settings saved successfully', type: 'success' });
        loadSettings();
      }
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-10 bg-gray-100 rounded w-full mb-4" />
          <div className="h-10 bg-gray-100 rounded w-32" />
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

      <h2 className="text-xl font-semibold text-gray-800 normal-case">Settings</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-lg">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Emails
            </label>

            {/* Existing emails as pills */}
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {emails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14507c]/10 text-[#14507c] rounded-full text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="hover:bg-[#14507c]/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add new email */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addEmail();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                placeholder="Add email address"
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-3 py-2 bg-[#14507c] text-white text-sm rounded-md hover:bg-[#0e3a5a] transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              All listed emails will receive registration notifications. Press Enter or click Add to add an email.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
