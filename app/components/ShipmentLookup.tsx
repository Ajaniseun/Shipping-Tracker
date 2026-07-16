'use client';

import { FormEvent, useState } from 'react';
import type { Shipment } from '@/app/lib/shipments';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ShipmentLookup() {
  const [query, setQuery] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trackingNumber = query.trim();
    setShipment(null);
    setError('');
    setSearched(true);

    if (!trackingNumber) {
      setError('Please enter a tracking number.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/shipments?trackingNumber=${encodeURIComponent(trackingNumber)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Shipment not found.');
        return;
      }

      setShipment(data);
    } catch {
      setError('Unable to retrieve shipment details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Track a shipment</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Enter your tracking number below.</h2>
        </div>
        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Latest status updates are shown instantly.
        </div>
      </div>

      <p className="mt-4 text-slate-600">Search by tracking number to view current status, location, and the full shipment history.</p>

      <form onSubmit={handleSearch} className="mt-6 grid gap-3 sm:grid-cols-[1.7fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-slate-400"
          placeholder="COL-1001"
        />
        <button
          type="submit"
          className="rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error ? <p className="mt-5 rounded-3xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p> : null}

      {shipment ? (
        <div className="mt-8 space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Tracking</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{shipment.trackingNumber}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Status</p>
              <p className="mt-3 text-xl font-semibold text-blue-700">{shipment.status}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Location</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{shipment.location}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Last updated</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{formatDate(shipment.updatedAt)}</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">History</p>
            <div className="mt-4 space-y-3">
              {shipment.history.map((entry, index) => (
                <div key={`${entry.timestamp}-${index}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-slate-700">{entry.status}</p>
                    <p className="text-sm text-slate-500">{formatDate(entry.timestamp)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{entry.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : searched && !loading && !error ? (
        <p className="mt-6 rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">Enter a tracking number to view the shipment.</p>
      ) : null}
    </div>
  );
}
