'use client';

import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import { Users, Mail, Phone, MapPin, Calendar, DollarSign, Search, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeUp } from '@/components/motion/FadeUp';

type LeadsPageClientProps = {
  isAdmin: boolean;
};

export function LeadsPageClient({ isAdmin }: LeadsPageClientProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    fetch('/api/get-leads')
      .then(r => r.json())
      .then(data => { if (data.leads) setLeads(data.leads); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card variant="default" className="p-8 text-center">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </Card>
    </div>
  );

  const filtered = leads.filter(l => {
    const s = search.toLowerCase();
    return (l.email || '').toLowerCase().includes(s) ||
      (l.name || '').toLowerCase().includes(s) ||
      (l.destination || '').toLowerCase().includes(s);
  });

  function calcDays(dates: string) {
    if (!dates) return '-';
    const parts = dates.split(' to ');
    if (parts.length < 2) return '-';
    const start = new Date(parts[0] + ' 2026');
    const end = new Date(parts[1] + ' 2026');
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000)) + ' days';
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Phone', 'Destination', 'Dates', 'Stay', 'Travelers', 'Budget', 'Interests'];
    const rows = leads.map(l => [l.name, l.email, l.phone, l.destination, l.dates, calcDays(l.dates), l.travelers, l.budget, l.interests]);
    const csv = [headers, ...rows].map(r => r.map((c: any) => `"${c || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tripmind-leads.csv'; a.click();
  }

  function exportExcel() {
    const rows = leads.map(l => ({
      Name: l.name || '',
      Email: l.email || '',
      Phone: l.phone || '',
      Destination: l.destination || '',
      Dates: l.dates || '',
      'Stay Duration': calcDays(l.dates),
      Travelers: l.travelers || '',
      Budget: l.budget || '',
      Interests: l.interests || '',
      'Created At': l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, 'tripmind-leads.xlsx');
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Travel Leads</h1>
            <p className="text-muted-foreground text-sm">Everyone who chatted with Sarah</p>
          </div>
        </div>
        {leads.length > 0 && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportCSV}>
              <Download size={15} className="mr-2" /> CSV
            </Button>
            <Button variant="secondary" onClick={exportExcel}>
              <Download size={15} className="mr-2" /> Excel
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: leads.length, icon: Users },
          { label: 'With Phone', value: leads.filter(l => l.phone).length, icon: Phone },
          { label: 'Destinations', value: new Set(leads.map(l => l.destination?.split(',').pop()?.trim()).filter(Boolean)).size, icon: MapPin },
        ].map((stat, index) => (
          <FadeUp key={stat.label} delay={index * 0.05}>
            <Card variant="default" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <stat.icon size={18} className="text-accent" />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
            </Card>
          </FadeUp>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or destination..."
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card variant="default" className="overflow-hidden">
        <div className="h-1 bg-accent" />

        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-surface rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No leads yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Leads appear when visitors chat with Sarah and share their email</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Destination</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dates</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stay</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Budget</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Interests</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead, i) => (
                  <tr key={i} className="hover:bg-accent/5 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {(lead.name?.[0] || lead.email?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-primary">{lead.name || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} /> {lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {lead.phone ? (
                        <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>
                      ) : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      {lead.destination ? (
                        <span className="flex items-center gap-1 text-accent font-medium"><MapPin size={12} /> {lead.destination}</span>
                      ) : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {lead.dates ? (
                        <span className="flex items-center gap-1"><Calendar size={12} /> {lead.dates}</span>
                      ) : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="info">
                        {calcDays(lead.dates)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      {lead.budget ? (
                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                          <DollarSign size={10} /> {lead.budget}
                        </Badge>
                      ) : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs max-w-[150px] truncate">
                      {lead.interests || <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground/60">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <p className="text-center text-xs text-muted-foreground mt-4">Showing {filtered.length} of {leads.length} leads</p>
    </div>
  );
}
