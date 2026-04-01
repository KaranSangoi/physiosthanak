'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PilatesAdminSetting } from '@/types/pilates';

export default function SettingsPage() {
  const [settings, setSettings] = useState<PilatesAdminSetting[]>([]);
  const [notificationEmail, setNotificationEmail] = useState('');
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
      const emailSetting = data.find((s) => s.key === 'notification_email');
      if (emailSetting) {
        setNotificationEmail(emailSetting.value);
      }
    }
    setLoading(false);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

    // Check if setting exists
    const existing = settings.find((s) => s.key === 'notification_email');

    if (existing) {
      const { error } = await supabase
        .from('pilates_admin_settings')
        .update({ value: notificationEmail })
        .eq('id', existing.id);

      if (error) {
        setToast({ message: 'Failed to save settings', type: 'error' });
      } else {
        setToast({ message: 'Settings saved', type: 'success' });
      }
    } else {
      const { error } = await supabase.from('pilates_admin_settings').insert({
        key: 'notification_email',
        value: notificationEmail,
      });

      if (error) {
        setToast({ message: 'Failed to save settings', type: 'error' });
      } else {
        setToast({ message: 'Settings saved', type: 'success' });
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
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Email
            </label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
              placeholder="admin@physiosthanak.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email address for receiving registration notifications.
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
