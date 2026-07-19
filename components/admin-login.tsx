'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError('');
    const password = String(new FormData(event.currentTarget).get('password') || '');
    const response = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
    });
    const result = await response.json();
    if (response.ok) window.location.reload();
    else { setError(result.error || 'Unable to sign in.'); setBusy(false); }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-cyan-400 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to site
        </Link>
        <p className="font-bold text-cyan-400">Softonic IT Solutions</p>
        <h1 className="mt-3 text-3xl font-black text-white">Admin sign in</h1>
        <p className="mt-2 text-sm text-zinc-400">Use the password configured in your environment.</p>
        <label className="mt-8 block text-sm font-semibold text-zinc-300">Password</label>
        <input name="password" type="password" required autoFocus className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-cyan-400" />
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-zinc-950 disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}
