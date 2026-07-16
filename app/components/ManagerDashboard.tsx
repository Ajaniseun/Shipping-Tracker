'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { Shipment } from '@/app/lib/shipments';
import { getStatusOptions } from '@/app/lib/shipments';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const defaultStatus = 'In Transit';

export default function ManagerDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState('');
  const [destination, setDestination] = useState('Toronto, Canada');
  const [activeUpdates, setActiveUpdates] = useState<Record<string, { status: string; location: string }>>({});
  const [creating, setCreating] = useState(false);

  const statusOptions = useMemo(() => getStatusOptions(), []);

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/shipments');
      const data = await response.json();
      setShipments(Array.isArray(data) ? data : []);
    } catch {
      setError('Unable to load shipments.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer.trim()) {
      setError('Customer name is required for a new shipment.');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: customer.trim(), destination: destination.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to create shipment.');
        return;
      }

      setCustomer('');
      setDestination('Toronto, Canada');
      setActiveUpdates((current) => ({
        ...current,
        [data.trackingNumber]: { status: data.status, location: data.location },
      }));
      loadShipments();
    } catch {
      setError('Unable to create shipment.');
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(trackingNumber: string) {
    const update = activeUpdates[trackingNumber];
    if (!update || !update.status.trim() || !update.location.trim()) {
      setError('Status and location are required to update a shipment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/shipments/${encodeURIComponent(trackingNumber)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to update shipment.');
        return;
      }

      loadShipments();
    } catch {
      setError('Unable to update shipment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Manager Portal</p>
            <h1 className="text-3xl font-bold text-slate-900">Shipment dashboard</h1>
          </div>
          <p className="text-sm text-slate-600">Manual site checking only — no customer login needed.</p>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Create a new shipment</h2>
              <p className="mt-1 text-sm text-slate-600">
                Enter a customer name and destination to generate a tracking number.
              </p>
            </div>
          </div>

          <form className="grid gap-4 sm:grid-cols-[1.2fr_1fr]" onSubmit={handleCreate}>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Customer name</label>
              <input
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none ring-0"
                placeholder="e.g. Juan Perez"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Destination</label>
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none ring-0"
                placeholder="Toronto, Canada"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                disabled={creating}
              >
                {creating ? 'Creating shipment…' : 'Create shipment'}
              </button>
            </div>
          </form>
        </div>

        {error ? <p className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active shipments</h2>
            <p className="text-sm text-slate-500">Updates are visible immediately for manual customer checks.</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Tracking</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Customer</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Location</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {shipments.map((shipment) => {
                  const update = activeUpdates[shipment.trackingNumber] ?? {
                    status: shipment.status,
                    location: shipment.location,
                  };
                  return (
                    <tr key={shipment.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{shipment.trackingNumber}</td>
                      <td className="px-4 py-3 text-slate-700">{shipment.customer}</td>
                      <td className="px-4 py-3 text-slate-700">{shipment.status}</td>
                      <td className="px-4 py-3 text-slate-700">{shipment.location}</td>
                      <td className="px-4 py-3 text-slate-700">{formatDate(shipment.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-6">
            {shipments.map((shipment) => {
              const update = activeUpdates[shipment.trackingNumber] ?? {
                status: shipment.status,
                location: shipment.location,
              };

              return (
                <div key={shipment.trackingNumber} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Shipment</p>
                      <p className="text-lg font-semibold text-slate-900">{shipment.trackingNumber}</p>
                      <p className="text-sm text-slate-600">{shipment.customer}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdate(shipment.trackingNumber)}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                      Save update
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700">
                      <span>Status</span>
                      <select
                        value={update.status}
                        onChange={(event) =>
                          setActiveUpdates((current) => ({
                            ...current,
                            [shipment.trackingNumber]: {
                              status: event.target.value,
                              location: update.location,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2 text-sm text-slate-700">
                      <span>Location</span>
                      <input
                        value={update.location}
                        onChange={(event) =>
                          setActiveUpdates((current) => ({
                            ...current,
                            [shipment.trackingNumber]: {
                              status: update.status,
                              location: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
