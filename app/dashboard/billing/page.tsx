import { CreditCard, Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["3 trips per month", "Basic itineraries", "Email support"],
    current: true,
    color: "border-gray-200",
    button: "Current Plan",
    disabled: true,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    features: ["Unlimited trips", "AI-powered itineraries", "Priority support", "Export to PDF", "Custom preferences"],
    current: false,
    color: "border-indigo-500",
    button: "Upgrade to Pro",
    disabled: false,
  },
  {
    name: "Business",
    price: "$29",
    period: "per month",
    features: ["Everything in Pro", "Team collaboration", "API access", "Dedicated support", "White label options"],
    current: false,
    color: "border-pink-500",
    button: "Upgrade to Business",
    disabled: false,
  },
];

export default function BillingPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Plans</h1>
      <p className="text-gray-500 mb-10">Choose the plan that works best for you</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan, i) => (
          <div key={i} className={`rounded-2xl border-2 ${plan.color} p-6 relative bg-white shadow-sm hover:shadow-md transition`}>
            {plan.name === "Pro" && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 mb-1">/{plan.period}</span>
            </div>
            <ul className="space-y-3 my-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-gray-600">
                  <Check size={16} className="text-indigo-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled={plan.disabled}
              className={`w-full py-2.5 rounded-xl font-semibold transition ${
                plan.disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:opacity-90"
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={22} className="text-indigo-500" />
          <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
        </div>
        <p className="text-gray-500 mb-4">No payment method added yet.</p>
        <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition">
          Add Payment Method
        </button>
      </div>
    </div>
  );
}