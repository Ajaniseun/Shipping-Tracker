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
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Track a shipment</h2>
      <p className="mt-2 text-slate-600">
        Enter your tracking number to see the latest status and shipment history.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none ring-0"
          placeholder="Enter tracking number"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error ? (
        <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
      ) : null}

      {shipment ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Tracking</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{shipment.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-blue-700">{shipment.status}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Location</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{shipment.location}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Last updated</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{formatDate(shipment.updatedAt)}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">History</p>
            <div className="mt-3 space-y-3">
              {shipment.history.map((entry, index) => (
                <div key={`${entry.timestamp}-${index}`} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-slate-700">{entry.status}</p>
                    <p className="text-sm text-slate-500">{formatDate(entry.timestamp)}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{entry.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : searched && !loading && !error ? (
        <p className="mt-6 text-sm text-slate-600">Enter a tracking number to view the shipment.</p>
      ) : null}
    </div>
  );
}
