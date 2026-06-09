const fs = require('fs');
const content = `'use client';

import { UserProfile } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0f172a]">Settings ⚙️</h1>
          </div>
          <p className="text-[#64748b] ml-1">Manage your account, password, and preferences</p>
        </div>
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-sm border border-gray-100 rounded-3xl",
              navbar: "border-r border-gray-100",
              navbarButton: "text-[#64748b] hover:text-violet-600",
              navbarButtonActive: "text-violet-600 bg-violet-50",
              headerTitle: "text-[#0f172a] font-bold",
              headerSubtitle: "text-[#64748b]",
              formButtonPrimary: "bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 transition",
              formFieldInput: "border-gray-200 rounded-xl focus:ring-violet-500",
              badge: "bg-violet-50 text-violet-700",
            }
          }}
        />
      </div>
    </div>
  );
}
`;
fs.writeFileSync('app/dashboard/settings/page.tsx', content);
console.log('Done settings');