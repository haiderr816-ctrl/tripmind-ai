const fs = require('fs');

const content = `'use client';

import { useEffect, useState } from 'react';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-leads')
      .then(r => r.json())
      .then(data => {
        setLeads(data.leads || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Travel Leads ({leads.length})</h1>
      {leads.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No leads yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{lead.name || 'Anonymous'}</h3>
                {lead.destination && (
                  <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full">{lead.destination}</span>
                )}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                {lead.email && <p>Email: {lead.email}</p>}
                {lead.phone && <p>Phone: {lead.phone}</p>}
                {lead.dates && <p>Dates: {lead.dates}</p>}
                {lead.travelers && <p>Travelers: {lead.travelers}</p>}
                {lead.budget && <p>Budget: {lead.budget}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                {lead.email && (
                  <a href={"mailto:" + lead.email} className="flex-1 text-center bg-indigo-50 text-indigo-600 text-xs py-2 rounded-xl">Email</a>
                )}
                {lead.phone && (
                  <a href={"https://wa.me/" + lead.phone.replace(/\D/g, '')} target="_blank" className="flex-1 text-center bg-green-50 text-green-600 text-xs py-2 rounded-xl">WhatsApp</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('app/dashboard/leads/page.tsx', content);
console.log('Done');