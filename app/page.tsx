import Link from 'next/link';
import ShipmentLookup from '@/app/components/ShipmentLookup';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Shipping Tracker
              </p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">
                Track your shipment from Colombia to Canada
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Customers can check their package status instantly, while the manager can update progress from one secure dashboard.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/manager"
                className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
              >
                Manager Portal
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <ShipmentLookup />

          <div className="rounded-2xl bg-slate-900 p-8 text-white shadow-sm">
            <h3 className="text-xl font-semibold">What this MVP includes</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Public shipment lookup</li>
              <li>• Manager-only admin portal</li>
              <li>• Shipment status updates</li>
              <li>• Status history view</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
