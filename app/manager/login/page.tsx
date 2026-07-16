'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Invalid password');
        return;
      }
      router.push('/manager');
    } catch (err) {
      setError('Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold">Manager sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Enter the manager password to continue.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              placeholder="Manager password"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div>
            <button className="w-full btn-primary" disabled={loading} type="submit">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
