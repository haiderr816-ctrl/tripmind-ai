'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Users, Mail, Calendar, Sparkles, TrendingUp, Search } from 'lucide-react';

const ADMIN_EMAIL = 'haiderr816@gmail.com';

export default function UsersPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    fetch('/api/get-users')
      .then(r => r.json())
      .then(data => {
        if (data.users) setUsers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <p className="text-[#64748b]">Access denied. Admin only.</p>
      </div>
    </div>
  );

  const filtered = users.filter(u => {
    const email = u.email_addresses?.[0]?.email_address || '';
    const name = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
    return email.includes(search.toLowerCase()) || name.includes(search.toLowerCase());
  });

  const totalUsers = users.length;
  const thisMonth = users.filter(u => {
    const created = new Date(u.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const googleUsers = users.filter(u =>
    u.external_accounts?.some((a: any) => a.provider === 'google')
  ).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
            <Users size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f172a]">Users</h1>
        </div>
        <p className="text-[#64748b]">Everyone who signed up to TripMind AI</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Users', value: totalUsers, icon: Users, color: 'violet', change: 'All time signups' },
          { label: 'This Month', value: thisMonth, icon: TrendingUp, color: 'pink', change: 'New signups' },
          { label: 'Google Auth', value: googleUsers, icon: Sparkles, color: 'purple', change: 'Signed in with Google' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#64748b] text-sm font-medium">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color === 'violet' ? 'bg-violet-50' : stat.color === 'pink' ? 'bg-pink-50' : 'bg-purple-50'}`}>
                <stat.icon size={18} className={stat.color === 'violet' ? 'text-violet-600' : stat.color === 'pink' ? 'text-pink-600' : 'text-purple-600'} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0f172a] mb-1">{stat.value}</div>
            <div className="text-xs text-[#64748b]">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-600 to-pink-600" />

        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-[#64748b]">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Header */}
            <div className="grid grid-cols-4 px-6 py-3 bg-[#f8fafc]">
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">User</span>
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Email</span>
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Joined</span>
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Auth Method</span>
            </div>

            {filtered.map((u: any) => {
              const email = u.email_addresses?.[0]?.email_address || 'No email';
              const name = `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Unknown';
              const joined = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const isGoogle = u.external_accounts?.some((a: any) => a.provider === 'google');
              const lastSeen = new Date(u.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div key={u.id} className="grid grid-cols-4 px-6 py-4 hover:bg-violet-50 transition items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                      {name[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0f172a] text-sm">{name}</p>
                      <p className="text-xs text-[#64748b]">Last seen: {lastSeen}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-gray-400" />
                    <span className="text-sm text-[#64748b] truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-gray-400" />
                    <span className="text-sm text-[#64748b]">{joined}</span>
                  </div>
                  <div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isGoogle ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-violet-50 text-violet-700 border border-violet-100'}`}>
                      {isGoogle ? '🔵 Google' : '📧 Email'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-[#64748b] mt-4">
        Showing {filtered.length} of {totalUsers} users · Powered by Clerk
      </p>
    </div>
  );
}