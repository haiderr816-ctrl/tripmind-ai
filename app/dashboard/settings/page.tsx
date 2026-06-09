'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { Settings, User, Mail, Shield, Bell, Palette, LogOut, ChevronRight, Camera } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    tripReminders: true,
    aiSuggestions: true,
    priceAlerts: false,
    newsletter: true,
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
            <Settings size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f172a]">Settings</h1>
        </div>
        <p className="text-[#64748b]">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-600 to-pink-600" />

            {/* Avatar */}
            <div className="p-6 text-center border-b border-gray-100">
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-200">
                  {user?.firstName?.[0] || 'H'}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-violet-50 transition">
                  <Camera size={12} className="text-violet-600" />
                </button>
              </div>
              <p className="font-bold text-[#0f172a] text-sm">{user?.fullName || 'Haider Rana'}</p>
              <p className="text-xs text-[#64748b]">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>

            {/* Nav */}
            <div className="p-2">
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition mb-1 ${activeSection === s.id ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md shadow-violet-200' : 'text-[#64748b] hover:bg-violet-50 hover:text-violet-700'}`}>
                  <s.icon size={16} />
                  {s.label}
                  {activeSection !== s.id && <ChevronRight size={14} className="ml-auto opacity-40" />}
                </button>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-600 to-pink-600" />

            {activeSection === 'profile' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-[#0f172a] mb-1">Profile Details</h2>
                <p className="text-sm text-[#64748b] mb-6">Your public profile information</p>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#0f172a] mb-2 block">First Name</label>
                      <input defaultValue={user?.firstName || ''} readOnly
                        className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#0f172a] mb-2 block">Last Name</label>
                      <input defaultValue={user?.lastName || ''} readOnly
                        className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0f172a] mb-2 block">Email Address</label>
                    <div className="flex items-center gap-3">
                      <input defaultValue={user?.primaryEmailAddress?.emailAddress || ''} readOnly
                        className="flex-1 px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl text-sm text-[#0f172a] focus:outline-none" />
                      <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-lg">Primary</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0f172a] mb-2 block">Connected Accounts</label>
                    <div className="flex items-center gap-3 p-4 bg-[#f8fafc] border border-gray-200 rounded-xl">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                        <span className="text-sm">G</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">Google</p>
                        <p className="text-xs text-[#64748b]">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                      <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-lg">Connected</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-violet-200">
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-[#0f172a] mb-1">Account & Security</h2>
                <p className="text-sm text-[#64748b] mb-6">Manage your security settings</p>

                <div className="space-y-4">
                  {[
                    { title: 'Change Password', desc: 'Update your account password', icon: Shield },
                    { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security', icon: Shield },
                    { title: 'Active Sessions', desc: 'Manage devices logged into your account', icon: User },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-xl border border-gray-100 hover:border-violet-200 transition group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                          <item.icon size={16} className="text-violet-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#0f172a] text-sm">{item.title}</p>
                          <p className="text-xs text-[#64748b]">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-violet-600 transition" />
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="font-semibold text-red-700 text-sm mb-1">Danger Zone</p>
                    <p className="text-xs text-red-500 mb-3">Once you delete your account, there is no going back.</p>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-[#0f172a] mb-1">Notifications</h2>
                <p className="text-sm text-[#64748b] mb-6">Choose what you want to be notified about</p>

                <div className="space-y-3">
                  {[
                    { key: 'tripReminders', label: 'Trip Reminders', desc: 'Get reminded before your trips' },
                    { key: 'aiSuggestions', label: 'AI Suggestions', desc: 'Receive personalized travel tips' },
                    { key: 'priceAlerts', label: 'Price Alerts', desc: 'Know when flight prices drop' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Monthly travel inspiration' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold text-[#0f172a] text-sm">{item.label}</p>
                        <p className="text-xs text-[#64748b]">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-gradient-to-r from-violet-600 to-pink-600' : 'bg-gray-200'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <button className="mt-6 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-violet-200">
                  Save Preferences
                </button>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-[#0f172a] mb-1">Appearance</h2>
                <p className="text-sm text-[#64748b] mb-6">Customize how TripMind looks for you</p>

                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Light', bg: 'bg-white border-violet-500', active: true },
                        { label: 'Dark', bg: 'bg-gray-900 border-gray-700', active: false },
                        { label: 'System', bg: 'bg-gradient-to-br from-white to-gray-900 border-gray-300', active: false },
                      ].map(t => (
                        <div key={t.label} className={`p-4 rounded-xl border-2 cursor-pointer text-center ${t.active ? 'border-violet-500' : 'border-gray-200'}`}>
                          <div className={`w-full h-12 rounded-lg mb-2 ${t.bg} border border-gray-200`} />
                          <p className="text-xs font-semibold text-[#0f172a]">{t.label}</p>
                          {t.active && <p className="text-xs text-violet-600 font-bold">Active</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] mb-3">Accent Color</p>
                    <div className="flex gap-3">
                      {[
                        { color: 'bg-gradient-to-r from-violet-600 to-pink-600', active: true },
                        { color: 'bg-gradient-to-r from-blue-600 to-cyan-500', active: false },
                        { color: 'bg-gradient-to-r from-green-500 to-teal-500', active: false },
                        { color: 'bg-gradient-to-r from-orange-500 to-red-500', active: false },
                      ].map((c, i) => (
                        <button key={i} className={`w-10 h-10 rounded-xl ${c.color} ${c.active ? 'ring-2 ring-offset-2 ring-violet-500' : ''} transition`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}