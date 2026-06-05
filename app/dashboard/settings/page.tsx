"use client";

import { useState } from "react";
import { User, Bell, Shield, Globe } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("English");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [tripReminders, setTripReminders] = useState(true);
  const [deals, setDeals] = useState(false);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-500 mb-10">Manage your account preferences</p>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <User size={20} className="text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-900">Profile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button className="mt-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition">
          Save Changes
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={20} className="text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-900">Preferences</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>JPY</option>
              <option>PKR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Japanese</option>
              <option>Urdu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={20} className="text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive updates about your trips via email", value: emailNotifs, set: setEmailNotifs },
            { label: "Trip Reminders", desc: "Get reminded before your upcoming trips", value: tripReminders, set: setTripReminders },
            { label: "Deals & Offers", desc: "Receive exclusive travel deals and promotions", value: deals, set: setDeals },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => item.set(!item.value)}
                className={`relative w-12 h-6 rounded-full transition-colors ${item.value ? "bg-indigo-600" : "bg-gray-200"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={20} className="text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-900">Security</h2>
        </div>
        <button className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition">
          Change Password
        </button>
      </div>
    </div>
  );
}