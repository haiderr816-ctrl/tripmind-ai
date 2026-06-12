'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { Settings, User, Mail, Shield, Bell, Palette, LogOut, ChevronRight, Camera } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeUp } from '@/components/motion/FadeUp';

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
    <div className="min-h-screen bg-background p-6 lg:p-8">

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Settings size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card variant="default" className="overflow-hidden">
            <div className="h-1 bg-accent" />

            {/* Avatar */}
            <div className="p-6 text-center border-b border-border">
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-accent/30">
                  {user?.firstName?.[0] || 'H'}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-surface border border-border rounded-lg flex items-center justify-center shadow-sm hover:bg-accent/10 transition">
                  <Camera size={12} className="text-accent" />
                </button>
              </div>
              <p className="font-bold text-primary text-sm">{user?.fullName || 'Haider Rana'}</p>
              <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>

            {/* Nav */}
            <div className="p-2">
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition mb-1 ${activeSection === s.id ? 'bg-accent text-white shadow-md shadow-accent/30' : 'text-muted-foreground hover:bg-surface hover:text-primary'}`}>
                  <s.icon size={16} />
                  {s.label}
                  {activeSection !== s.id && <ChevronRight size={14} className="ml-auto opacity-40" />}
                </button>
              ))}

              <div className="mt-4 pt-4 border-t border-border">
                <button onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card variant="default" className="overflow-hidden">
            <div className="h-1 bg-accent" />

            {activeSection === 'profile' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-primary mb-1">Profile Details</h2>
                <p className="text-sm text-muted-foreground mb-6">Your public profile information</p>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-primary mb-2 block">First Name</label>
                      <input defaultValue={user?.firstName || ''} readOnly
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-primary mb-2 block">Last Name</label>
                      <input defaultValue={user?.lastName || ''} readOnly
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-primary mb-2 block">Email Address</label>
                    <div className="flex items-center gap-3">
                      <input defaultValue={user?.primaryEmailAddress?.emailAddress || ''} readOnly
                        className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-sm text-primary focus:outline-none" />
                      <Badge variant="info">Primary</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-primary mb-2 block">Connected Accounts</label>
                    <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-border">
                        <span className="text-sm">G</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">Google</p>
                        <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                      <Badge variant="success" className="ml-auto">Connected</Badge>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="accent">
                      Update Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-primary mb-1">Account & Security</h2>
                <p className="text-sm text-muted-foreground mb-6">Manage your security settings</p>

                <div className="space-y-4">
                  {[
                    { title: 'Change Password', desc: 'Update your account password', icon: Shield },
                    { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security', icon: Shield },
                    { title: 'Active Sessions', desc: 'Manage devices logged into your account', icon: User },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-accent transition group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center">
                          <item.icon size={16} className="text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition" />
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                    <p className="font-semibold text-destructive text-sm mb-1">Danger Zone</p>
                    <p className="text-xs text-destructive/80 mb-3">Once you delete your account, there is no going back.</p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-primary mb-1">Notifications</h2>
                <p className="text-sm text-muted-foreground mb-6">Choose what you want to be notified about</p>

                <div className="space-y-3">
                  {[
                    { key: 'tripReminders', label: 'Trip Reminders', desc: 'Get reminded before your trips' },
                    { key: 'aiSuggestions', label: 'AI Suggestions', desc: 'Receive personalized travel tips' },
                    { key: 'priceAlerts', label: 'Price Alerts', desc: 'Know when flight prices drop' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Monthly travel inspiration' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                      <div>
                        <p className="font-semibold text-primary text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-accent' : 'bg-border'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <Button variant="accent" className="mt-6">
                  Save Preferences
                </Button>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-primary mb-1">Appearance</h2>
                <p className="text-sm text-muted-foreground mb-6">Customize how TripMind looks for you</p>

                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Light', bg: 'bg-white border-accent', active: true },
                        { label: 'Dark', bg: 'bg-gray-900 border-gray-700', active: false },
                        { label: 'System', bg: 'bg-gradient-to-br from-white to-gray-900 border-border', active: false },
                      ].map(t => (
                        <div key={t.label} className={`p-4 rounded-xl border-2 cursor-pointer text-center ${t.active ? 'border-accent' : 'border-border'}`}>
                          <div className={`w-full h-12 rounded-lg mb-2 ${t.bg} border border-border`} />
                          <p className="text-xs font-semibold text-primary">{t.label}</p>
                          {t.active && <p className="text-xs text-accent font-bold">Active</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-primary mb-3">Accent Color</p>
                    <div className="flex gap-3">
                      {[
                        { color: 'bg-accent', active: true },
                        { color: 'bg-blue-500', active: false },
                        { color: 'bg-success', active: false },
                        { color: 'bg-warning', active: false },
                      ].map((c, i) => (
                        <button key={i} className={`w-10 h-10 rounded-xl ${c.color} ${c.active ? 'ring-2 ring-offset-2 ring-accent' : ''} transition`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
}