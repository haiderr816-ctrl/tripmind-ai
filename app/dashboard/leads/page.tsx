'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Users, Mail, Phone, MapPin, Calendar, DollarSign, Search, Download } from 'lucide-react';

const ADMIN_EMAIL = 'haiderr816@gmail.com';

export default function LeadsPage() {
  const { user } = useUser();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    fetch('/api/get-leads')
      .then(r => r.json())
      .then(data => { if (data.leads) setLeads(data.leads); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <p className="text-[#64748b]">Access denied. Admin only.</p>
      </div>
    </div>
  );

  const filtered = leads.filter(l => {
    const s = search.toLowerCase();
    return (l.email || '').toLowerCase().includes(s) ||
      (l.name || '').toLowerCase().includes(s) ||
      (l.destination || '').toLowerCase().includes(s);
  });

  function exportCSV() {
    const headers = ['Name', 'Email', 'Phone', 'Destination', 'Dates', 'Travelers', 'Budget', 'Interests'];
    const rows = leads.map(l => [l.name, l.email, l.phone, l.destination, l.dates, l.travelers, l.budget, l.interests]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tripmind-leads.csv'; a.click();
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">Travel Leads</h1>
              <p className="text-[#64748b] text-sm">Everyone who chatted with Sarah</p>
            </div>
          </div>
          {leads.length > 0 && (
            <button onClick={exportCSV}
              className="flex items-center gap-2 bg-white border border-gray-200 text-[#64748b] px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-violet-300 hover:text-violet-600 transition shadow-sm">
              <Download size={15} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: leads.length, icon: Users, color: 'violet' },
          { label: 'With Phone', value: leads.filter(l => l.phone).length, icon: Phone, color: 'pink' },
          { label: 'Destinations', value: new Set(leads.map(l => l.destination?.split(',').pop()?.trim()).filter(Boolean)).size, icon: MapPin, color: 'purple' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#64748b] text-sm font-medium">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color === 'violet' ? 'bg-violet-50' : stat.color === 'pink' ? 'bg-pink-50' : 'bg-purple-50'}`}>
                <stat.icon size={18} className={stat.color === 'violet' ? 'text-violet-600' : stat.color === 'pink' ? 'text-pink-600' : 'text-purple-600'} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0f172a]">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or destination..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm" />
      </div>

      {/* Leads */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-600 to-pink-600" />

        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-[#64748b] font-medium">No leads yet</p>
            <p className="text-xs text-gray-400 mt-1">Leads appear when visitors chat with Sarah and share their email</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((lead, i) => (
              <div key={i} className="p-5 hover:bg-violet-50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                      {(lead.name?.[0] || lead.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a] text-sm">{lead.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-1 text-xs text-[#64748b]">
                        <Mail size={11} /> {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-xs text-[#64748b]">
                          <Phone size={11} /> {lead.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pl-13">
                  {lead.destination && (
                    <span className="flex items-center gap-1 text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full border border-violet-100">
                      <MapPin size={10} /> {lead.destination}
                    </span>
                  )}
                  {lead.dates && (
                    <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                      <Calendar size={10} /> {lead.dates}
                    </span>
                  )}
                  {lead.budget && (
                    <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100">
                      <DollarSign size={10} /> {lead.budget}
                    </span>
                  )}
                  {lead.travelers && (
                    <span className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full border border-pink-100">
                      {lead.travelers}
                    </span>
                  )}
                  {lead.interests && (
                    <span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-100">
                      {lead.interests}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-center text-xs text-[#64748b] mt-4">Showing {filtered.length} of {leads.length} leads</p>
    </div>
  );
}