import Link from 'next/link';
import ShipmentLookup from '@/app/components/ShipmentLookup';

const features = [
  'Public shipment lookup without login',
  'Manager dashboard for tracking updates',
  'Status history for every shipment',
  'Manual updates now, carrier integration later',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-12 pt-6 sm:pt-10 animate-fade-up">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-blue-900 to-sky-700 px-8 py-10 text-white shadow-2xl shadow-slate-900/15">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">Shipping Tracker</p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
                Track shipments from Colombia to Canada with confidence.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-200/90">
                Customers can check shipment status instantly, while your team can update delivery progress through one manager portal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/manager"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Manager Portal
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/20"
                >
                  How it works
                </a>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-950/85 p-6 text-white shadow-lg shadow-slate-950/20 transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Demo snapshot</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/10 p-4 transition duration-300 hover:bg-white/15">
                      <p className="text-sm text-slate-300">Latest shipment</p>
                      <p className="mt-2 text-lg font-semibold">COL-1002</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 p-4 transition duration-300 hover:bg-white/15">
                      <p className="text-sm text-slate-300">Next tracking number</p>
                      <p className="mt-2 text-lg font-semibold">COL-1003</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Why this works</p>
                  <ul className="mt-5 space-y-3 text-sm text-slate-600">
                    <li>• Instant public lookup for customers</li>
                    <li>• Manager dashboard for shipment updates</li>
                    <li>• History tracking for every shipment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <ShipmentLookup />

          <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">What this MVP includes</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Everything your team needs for a cleaner tracking experience.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="rounded-3xl border border-slate-200 p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-sm">
                  <p className="text-base font-semibold text-slate-900">{feature}</p>
                </div>
              ))}
            </div>
            <div id="how-it-works" className="rounded-3xl bg-slate-900 p-6 text-white transition duration-300 hover:scale-[1.01] hover:bg-slate-800/95">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">How it works</p>
              <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                <li>1. Customers enter a tracking number on the public page.</li>
                <li>2. Staff create an order record and assign the shipment ID.</li>
                <li>3. The manager updates status and location as the package moves.</li>
                <li>4. Customers see the latest status and history instantly.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
