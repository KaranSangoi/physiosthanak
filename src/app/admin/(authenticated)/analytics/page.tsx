'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Bot, Eye, FileSearch, TrendingUp, ArrowRight } from 'lucide-react';

interface BotSummary {
  bot_name: string;
  count: number;
  last_seen: string;
}

interface PageSummary {
  path: string;
  count: number;
}

interface DailyCount {
  date: string;
  count: number;
}

export default function AnalyticsPage() {
  const [totalVisits, setTotalVisits] = useState(0);
  const [weekVisits, setWeekVisits] = useState(0);
  const [botBreakdown, setBotBreakdown] = useState<BotSummary[]>([]);
  const [topPages, setTopPages] = useState<PageSummary[]>([]);
  const [dailyTrend, setDailyTrend] = useState<DailyCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBotData();
  }, []);

  const loadBotData = async () => {
    const supabase = createClient();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Load all data in parallel
    const [
      { count: total },
      { count: week },
      { data: allVisits },
    ] = await Promise.all([
      supabase.from('bot_visits').select('*', { count: 'exact', head: true }),
      supabase.from('bot_visits').select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo),
      supabase.from('bot_visits').select('bot_name, path, created_at')
        .order('created_at', { ascending: false })
        .limit(5000),
    ]);

    setTotalVisits(total || 0);
    setWeekVisits(week || 0);

    if (allVisits && allVisits.length > 0) {
      // Bot breakdown
      const botMap = new Map<string, { count: number; last_seen: string }>();
      for (const v of allVisits) {
        const existing = botMap.get(v.bot_name);
        if (existing) {
          existing.count++;
          if (v.created_at > existing.last_seen) {
            existing.last_seen = v.created_at;
          }
        } else {
          botMap.set(v.bot_name, { count: 1, last_seen: v.created_at });
        }
      }
      const bots: BotSummary[] = Array.from(botMap.entries())
        .map(([bot_name, data]) => ({ bot_name, ...data }))
        .sort((a, b) => b.count - a.count);
      setBotBreakdown(bots);

      // Page breakdown
      const pageMap = new Map<string, number>();
      for (const v of allVisits) {
        pageMap.set(v.path, (pageMap.get(v.path) || 0) + 1);
      }
      const pages: PageSummary[] = Array.from(pageMap.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      setTopPages(pages);

      // Daily trend (last 7 days)
      const dailyMap = new Map<string, number>();
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        dailyMap.set(key, 0);
      }
      for (const v of allVisits) {
        const dateKey = v.created_at.split('T')[0];
        if (dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
        }
      }
      const daily: DailyCount[] = Array.from(dailyMap.entries())
        .map(([date, count]) => ({ date, count }));
      setDailyTrend(daily);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxDaily = Math.max(...dailyTrend.map(d => d.count), 1);

  const STAT_CARDS = [
    { label: 'Total Bot Visits', value: totalVisits, icon: Bot, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'This Week', value: weekVisits, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Unique Bots', value: botBreakdown.length, icon: Eye, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 normal-case">Bot Traffic Analytics</h2>
        <Link
          href="/admin/analytics/geo-audit"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#14507c] hover:text-[#14507c]/80 transition-colors"
        >
          <FileSearch size={16} />
          GEO Audit Checklist
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Trend (last 7 days) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Daily Bot Visits (Last 7 Days)</h3>
        {totalVisits === 0 ? (
          <p className="text-sm text-gray-500">No bot visits recorded yet. Bot visits will appear here once AI crawlers visit your site.</p>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {dailyTrend.map((d) => {
              const heightPct = maxDaily > 0 ? (d.count / maxDaily) * 100 : 0;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">{d.count}</span>
                  <div className="w-full flex items-end" style={{ height: '120px' }}>
                    <div
                      className="w-full bg-[#14507c] rounded-t transition-all"
                      style={{ height: `${Math.max(heightPct, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bot Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Visits by Bot</h3>
        {botBreakdown.length === 0 ? (
          <p className="text-sm text-gray-500">No bot visits recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Bot Name</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Visits</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {botBreakdown.map((bot) => (
                  <tr key={bot.bot_name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <span className="font-medium text-gray-800">{bot.bot_name}</span>
                    </td>
                    <td className="py-2 px-3 text-gray-600">{bot.count}</td>
                    <td className="py-2 px-3 text-gray-500">
                      {new Date(bot.last_seen).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Most Crawled Pages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Most Crawled Pages</h3>
        {topPages.length === 0 ? (
          <p className="text-sm text-gray-500">No bot visits recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Path</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Visits</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page) => (
                  <tr key={page.path} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <span className="font-mono text-xs text-gray-800">{page.path}</span>
                    </td>
                    <td className="py-2 px-3 text-gray-600">{page.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
