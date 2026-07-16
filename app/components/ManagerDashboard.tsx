'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { Shipment } from '@/app/lib/shipments';
import { getStatusOptions } from '@/app/lib/shipments';
import StatusBadge from './StatusBadge';
import DashboardCard from './DashboardCard';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ManagerDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState('');
  const [destination, setDestination] = useState('Toronto, Canada');
  const [activeUpdates, setActiveUpdates] = useState<Record<string, { status: string; location: string }>>({});
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState('');

  const statusOptions = useMemo(() => getStatusOptions(), []);

  useEffect(() => {
    loadShipments();
  }, []);
  async function loadShipments(p = page) {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (filterStatus) params.set('status', filterStatus);
      params.set('page', String(p));
      params.set('pageSize', String(pageSize));

      const response = await fetch(`/api/shipments?${params.toString()}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        // backward compat
        setShipments(data);
        setTotal(data.length);
      } else {
        setShipments(Array.isArray(data.items) ? data.items : []);
        setTotal(typeof data.total === 'number' ? data.total : 0);
        setPage(typeof data.page === 'number' ? data.page : p);
      }
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
      setSuccess('');
      return;
    }

    setCreating(true);
    setError('');
    setSuccess('');

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
      setSuccess(`Shipment created with tracking number ${data.trackingNumber}.`);
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
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

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

      setSuccess(`Shipment ${trackingNumber} updated successfully.`);
      loadShipments();
    } catch {
      setError('Unable to update shipment.');
    } finally {
      setLoading(false);
    }
  }

  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter((shipment) => shipment.status === 'In Transit').length;
  const deliveredCount = shipments.filter((shipment) => shipment.status === 'Delivered').length;

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Manager Portal</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">Shipment dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Manual package updates for now, built to look polished and future-ready.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <DashboardCard title="Total shipments" value={totalShipments} />
            <DashboardCard title="In transit" value={inTransitCount} />
            <DashboardCard title="Delivered" value={deliveredCount} />
          </div>
        </div>

        <div className="mb-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Create a new shipment</h2>
                <p className="mt-2 text-slate-600">Enter the customer and destination to generate a tracking number automatically.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm text-slate-600">Demo workflow</div>
            </div>

            <form className="mt-6 grid gap-4 sm:grid-cols-[1.2fr_1fr]" onSubmit={handleCreate}>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Customer name</label>
                <input
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-slate-400"
                  placeholder="e.g. Juan Perez"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Destination</label>
                <input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-slate-400"
                  placeholder="Toronto, Canada"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  disabled={creating}
                >
                  {creating ? 'Creating shipment…' : 'Create shipment'}
                </button>
              </div>
            </form>

            {success ? <p className="mt-6 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-800">{success}</p> : null}
            {error ? <p className="mt-6 rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
          </section>

          <section className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10">
            <h3 className="text-2xl font-semibold">Manager essentials</h3>
            <p className="mt-3 text-slate-300">Use this interface to update status, location, and keep customers informed with a clean workflow.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Note</p>
                <p className="mt-3 text-sm text-slate-300">The site is designed for manual updates today, with future support for automatic carrier updates.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-200">Manager tips</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li>• Use clear status labels so customers see the right stage.</li>
                  <li>• Keep destination and location info accurate.</li>
                  <li>• Use the tracking number when communicating with customers.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Active shipments</h2>
              <p className="mt-2 text-sm text-slate-600">Manage shipments and update each tracking status quickly.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                placeholder="Search tracking or customer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
              >
                <option value="">All statuses</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  loadShipments(1);
                }}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Search
              </button>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{loading ? 'Refreshing…' : `${total} shipments`}</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200">
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
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{shipment.trackingNumber}</td>
                    <td className="px-4 py-3 text-slate-700">{shipment.customer}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">{shipment.location}</td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(shipment.updatedAt)}</td>
                  </tr>
                ))}
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
                <div key={shipment.trackingNumber} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-500">Shipment</p>
                        <StatusBadge status={shipment.status} />
                      </div>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{shipment.trackingNumber}</p>
                      <p className="text-sm text-slate-600">{shipment.customer}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdate(shipment.trackingNumber)}
                      className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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
                        className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 outline-none"
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
                        className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 outline-none"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                loadShipments(next);
              }}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              Prev
            </button>
            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                loadShipments(next);
              }}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
