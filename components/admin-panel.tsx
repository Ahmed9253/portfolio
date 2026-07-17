'use client';

import { useState, useRef, useCallback } from 'react';
import { ExternalLink, LogOut, Plus, Trash2, Pencil, X, Upload, Save, FolderOpen, Newspaper, Users, Image, MessageSquare, Link2, Menu } from 'lucide-react';
import type { Collection, ContentData, Project, Blog, TeamMember, HeroData, SocialLinks, Contact } from '@/lib/content';
import { socialLinkConfig } from '@/lib/social-links';

type Tab = Collection;
type PanelView = Tab | 'hero' | 'socials' | 'contacts';

const tabs: { id: Tab; label: string; icon: typeof FolderOpen }[] = [
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'blogs', label: 'Articles', icon: Newspaper },
  { id: 'team', label: 'Team', icon: Users },
];
const inputClass = 'w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10';

export default function AdminPanel({ initialData }: { initialData: ContentData }) {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState<PanelView>('projects');
  const [editing, setEditing] = useState<(Project | Blog | TeamMember) | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTab = (v: PanelView): v is Tab => v === 'projects' || v === 'blogs' || v === 'team';
  const items = isTab(view) ? data[view] : [];

  function navigate(v: PanelView) {
    setView(v); setEditing(null); setMessage(''); setMobileMenuOpen(false);
  }

  async function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const payload = view === 'team' ? {
      name: values.name, role: values.role, image: values.image,
      socials: { linkedin: values.linkedin, github: values.github, twitter: values.twitter, instagram: values.instagram, whatsapp: values.whatsapp },
    } : values;
    const response = await fetch(`/api/admin/${view}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (response.ok) {
      if (view === 'projects' || view === 'blogs' || view === 'team' || view === 'contacts') {
        setData((c) => ({ ...c, [view]: [...(c[view] as unknown[]), result] })); form.reset(); setMessage('Added successfully.');
      }
    } else setMessage(result.error || 'Unable to add item.');
    setBusy(false);
  }

  async function updateItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!editing) return; setBusy(true); setMessage('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const payload = view === 'team' ? {
      id: editing.id, name: values.name, role: values.role, image: values.image,
      socials: { linkedin: values.linkedin, github: values.github, twitter: values.twitter, instagram: values.instagram, whatsapp: values.whatsapp },
    } : { id: editing.id, ...values };
    const response = await fetch(`/api/admin/${view}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (response.ok) {
      if (view === 'projects' || view === 'blogs' || view === 'team' || view === 'contacts') {
        setData((c) => ({ ...c, [view]: (c[view] as {id:string}[]).map((item) => item.id === editing.id ? result : item) }));
      }
      setEditing(null); setMessage('Updated successfully.');
    } else setMessage(result.error || 'Unable to update item.');
    setBusy(false);
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/${view}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const result = await response.json();
    if (response.ok) {
      if (view === 'projects' || view === 'blogs' || view === 'team' || view === 'contacts') {
        setData((c) => ({ ...c, [view]: (c[view] as {id:string}[]).filter((item) => item.id !== id) }));
      }
      if (editing?.id === id) setEditing(null); setMessage('Deleted successfully.');
    } else setMessage(result.error || 'Unable to delete item.');
  }

  async function removeContact(id: string, name: string) {
    if (!window.confirm(`Delete message from "${name}"?`)) return;
    const response = await fetch(`/api/admin/contacts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (response.ok) { setData((c) => ({ ...c, contacts: c.contacts.filter((c) => c.id !== id) })); setMessage('Deleted.'); }
  }

  async function saveHero(image: string) {
    setBusy(true);
    const response = await fetch('/api/admin/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image }) });
    const result = await response.json();
    if (response.ok) { setData((c) => ({ ...c, hero: { image } })); setMessage('Hero image updated.'); }
    else setMessage(result.error || 'Unable to update hero.');
    setBusy(false);
  }

  async function saveSocials(socials: SocialLinks) {
    setBusy(true);
    const response = await fetch('/api/admin/socials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(socials) });
    const result = await response.json();
    if (response.ok) { setData((c) => ({ ...c, socials: result })); setMessage('Socials updated.'); }
    else setMessage(result.error || 'Unable to update socials.');
    setBusy(false);
  }

  async function logout() { await fetch('/api/admin/logout', { method: 'POST' }); window.location.reload(); }

  const pageTitle = view === 'hero' ? 'Hero Image' : view === 'socials' ? 'Social Links' : view === 'contacts' ? 'Contact Messages' : tabs.find((t) => t.id === view)?.label;
  const pageDescription = view === 'projects' ? 'Create and maintain the work shown across your website.'
    : view === 'blogs' ? 'Publish and update articles from one place.'
    : view === 'team' ? 'Keep your public team profiles current.'
    : view === 'socials' ? 'Manage the five company links shown publicly.'
    : view === 'contacts' ? 'Review messages submitted through the contact form.'
    : 'Update the subtle image used behind the homepage hero.';

  const navItems: { id: PanelView; label: string; icon: typeof FolderOpen; count?: number }[] = [
    ...tabs.map((t) => ({ ...t, count: data[t.id].length })),
    { id: 'socials', label: 'Social Links', icon: Link2 },
    { id: 'contacts', label: 'Messages', icon: MessageSquare, count: data.contacts.length },
  ];

  return (
    <div className="flex min-h-screen bg-[#08080a] text-white">
      {mobileMenuOpen && <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/[0.08] bg-[#0d0d10] transition-transform duration-300 lg:sticky ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-24 items-center gap-3 border-b border-white/[0.08] px-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 font-mono text-sm font-black text-zinc-950">dQ</div>
          <div><p className="text-sm font-black tracking-tight">DevQuantums</p><p className="text-xs text-zinc-500">Content workspace</p></div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.id)} title={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${active ? 'bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-400/10' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'}`}>
                <Icon size={18} className="flex-shrink-0" />
                {item.label}{item.count !== undefined && <span className={`ml-auto text-xs ${active ? 'text-zinc-700' : 'text-zinc-600'}`}>{item.count}</span>}
              </button>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-white/[0.08] p-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white">
            <ExternalLink size={18} />View site
          </a>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
            <LogOut size={18} />Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex min-h-24 items-center gap-4 border-b border-white/[0.08] bg-[#08080a]/85 px-4 backdrop-blur-xl lg:px-8">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"><Menu size={20} /></button>
          <div><h2 className="text-xl font-black tracking-tight lg:text-2xl">{pageTitle}</h2><p className="mt-1 text-xs text-zinc-500 sm:text-sm">{pageDescription}</p></div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.055),transparent_28%)] p-4 lg:p-8">
          <div className="mx-auto max-w-[1500px]">
          {message && (
            <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${message.includes('successfully') || message.includes('updated') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message}<button onClick={() => setMessage('')} className="ml-3 text-zinc-500 hover:text-white"><X size={14} /></button>
            </div>
          )}

          {view === 'socials' && <SocialsSection socials={data.socials} onSave={saveSocials} busy={busy} />}
          {view === 'contacts' && <ContactsSection contacts={data.contacts} onDelete={removeContact} />}

          {isTab(view) && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 lg:p-6">
                <div className="flex items-center justify-between"><h3 className="text-base font-bold">Published items</h3><span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-zinc-400">{items.length}</span></div>
                <div className="mt-5 space-y-3">
                  {items.length ? items.map((item) => {
                    const name = 'title' in item ? item.title : item.name;
                    const detail = 'category' in item ? item.category : item.role;
                    const meta = 'publishedAt' in item ? (item as Blog).publishedAt : undefined;
                    return (
                      <div key={item.id} className={`group flex items-center gap-4 rounded-xl border p-3 transition-all ${editing?.id === item.id ? 'border-cyan-400/70 bg-cyan-400/[0.06]' : 'border-white/[0.07] bg-black/20 hover:border-white/15 hover:bg-white/[0.035]'}`}>
                        <div role="img" aria-label={name} style={{ backgroundImage: `url(${item.image})` }} className="h-16 w-16 flex-shrink-0 rounded-lg bg-cover bg-center" />
                        <div className="min-w-0 flex-1"><p className="truncate font-bold">{name}</p><p className="truncate text-sm text-zinc-500">{detail}{meta ? ` · ${meta}` : ''}</p></div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button aria-label={`Edit ${name}`} onClick={() => { setEditing(item); setMessage(''); }} className="rounded-lg p-2.5 text-zinc-500 transition-colors hover:bg-cyan-400/10 hover:text-cyan-400"><Pencil size={16} /></button>
                          <button aria-label={`Delete ${name}`} onClick={() => remove(item.id, name)} className="rounded-lg p-2.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    );
                  }) : <div className="rounded-xl border border-dashed border-white/10 py-16 text-center"><p className="font-semibold text-zinc-400">Nothing published yet</p><p className="mt-1 text-sm text-zinc-600">Use the form to create your first item.</p></div>}
                </div>
              </section>

              <section className="h-fit rounded-2xl border border-white/[0.08] bg-[#111115] p-5 shadow-2xl shadow-black/20 lg:p-6 xl:sticky xl:top-28">
                {editing ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-black"><Pencil className="text-cyan-400" size={20} /> Edit</h3>
                      <button onClick={() => { setEditing(null); setMessage(''); }} className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"><X size={18} /></button>
                    </div>
                    <form key={`edit-${editing.id}`} onSubmit={updateItem} className="mt-6 space-y-4">
                      {view === 'team' ? <TeamFields member={editing as TeamMember} /> : <ContentFields blog={view === 'blogs'} item={editing as Project | Blog} />}
                      <div className="flex gap-3">
                        <button type="button" onClick={() => { setEditing(null); setMessage(''); }} className="flex-1 rounded-xl border border-zinc-700 px-4 py-3 font-bold text-zinc-300 hover:bg-zinc-800 transition-colors">Cancel</button>
                        <button disabled={busy} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-zinc-950 disabled:opacity-50"><Save size={16} /> {busy ? 'Saving...' : 'Save'}</button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <h3 className="flex items-center gap-2 text-lg font-black"><Plus className="text-cyan-400" size={20} /> Add {view === 'team' ? 'member' : view === 'blogs' ? 'article' : 'project'}</h3>
                    <form key={`add-${view}`} onSubmit={addItem} className="mt-6 space-y-4">
                      {view === 'team' ? <TeamFields /> : <ContentFields blog={view === 'blogs'} />}
                      <button disabled={busy} className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-zinc-950 disabled:opacity-50"><Plus size={16} /> {busy ? 'Saving...' : 'Add item'}</button>
                    </form>
                  </>
                )}
              </section>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}

function ContactsSection({ contacts, onDelete }: { contacts: Contact[]; onDelete: (id: string, name: string) => void }) {
  if (!contacts.length) return <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-zinc-500">No messages yet.</div>;
  return (
    <div className="max-w-5xl space-y-4">
      {contacts.map((c) => (
        <div key={c.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-colors hover:border-white/15">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-bold">{c.name}</p>
                <span className="text-xs text-zinc-500">{c.email}</span>
                <span className="text-xs text-zinc-600">· {c.createdAt}</span>
              </div>
              <p className="text-sm font-semibold text-cyan-400 mb-2">{c.subject}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{c.message}</p>
            </div>
            <button onClick={() => onDelete(c.id, c.name)} className="rounded-xl p-2.5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SocialsSection({ socials, onSave, busy }: { socials: SocialLinks; onSave: (s: SocialLinks) => void; busy: boolean }) {
  const [form, setForm] = useState(socials);
  const changed = JSON.stringify(form) !== JSON.stringify(socials);
  return (
    <div className="mx-auto max-w-3xl">
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 lg:p-8">
        <h3 className="text-xl font-black">Company links</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">Update the links used by the icons in the About section and footer. Empty links remain visible but inactive.</p>
        <div className="mt-7 space-y-3">
          {socialLinkConfig.map((social) => {
            const Icon = social.icon;
            return (
              <label key={social.key} className="grid items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3 sm:grid-cols-[44px_120px_1fr]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-cyan-400"><Icon size={19} /></span>
                <span className="text-sm font-semibold text-zinc-300">{social.label}</span>
                <input type={social.type} value={form[social.key] || ''} placeholder={social.placeholder}
                  onChange={(e) => setForm((current) => ({ ...current, [social.key]: e.target.value }))} className={inputClass} />
              </label>
            );
          })}
          <button disabled={busy || !changed} onClick={() => onSave(form)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-zinc-950 transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40">
            <Save size={16} /> {busy ? 'Saving...' : 'Save company links'}
          </button>
        </div>
      </section>
    </div>
  );
}

function HeroSection({ hero, onSave, busy }: { hero: HeroData; onSave: (image: string) => void; busy: boolean }) {
  const [image, setImage] = useState(hero.image);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData(); formData.append('file', file);
    try { const res = await fetch('/api/admin/upload', { method: 'POST', body: formData }); const r = await res.json(); if (res.ok) setImage(r.url); else alert(r.error || 'Upload failed'); } catch { alert('Upload failed'); }
    setUploading(false);
  }, []);

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) upload(f); };

  return (
    <div className="mx-auto max-w-3xl">
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 lg:p-8">
        <h3 className="text-lg font-black">Current Hero Image</h3>
        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800">
          <div role="img" aria-label="Hero preview" style={{ backgroundImage: `url(${image || hero.image})` }} className="aspect-[16/8] w-full bg-cover bg-center" />
        </div>
        <h3 className="mt-8 text-lg font-black">Change Hero Image</h3>
        <div className="mt-5 space-y-4">
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors ${dragOver ? 'border-cyan-400 bg-cyan-400/5' : 'border-zinc-700 hover:border-zinc-600'}`}>
            <Upload size={24} className="text-zinc-500" /><span className="text-sm text-zinc-500">{uploading ? 'Uploading...' : 'Drop image or click to upload'}</span>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
          <input type="url" placeholder="Or paste image URL" value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} />
          <button disabled={busy || !image || image === hero.image} onClick={() => onSave(image)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-zinc-950 disabled:opacity-50 transition-opacity"><Save size={16} /> {busy ? 'Saving...' : 'Save hero image'}</button>
        </div>
      </section>
    </div>
  );
}

function ImageUpload({ name, label, value }: { name: string; label: string; value?: string }) {
  const [preview, setPreview] = useState(value || '');
  const [fieldValue, setFieldValue] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData(); formData.append('file', file);
    try { const res = await fetch('/api/admin/upload', { method: 'POST', body: formData }); const r = await res.json(); if (res.ok) { setPreview(r.url); setFieldValue(r.url); } else alert(r.error || 'Upload failed'); } catch { alert('Upload failed'); }
    setUploading(false);
  }, []);

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) upload(f); };

  return (
    <label className="block text-sm font-semibold text-zinc-300">
      {label}
      {preview && (
        <div className="relative mt-2 mb-3">
          <div role="img" aria-label={`${label} preview`} style={{ backgroundImage: `url(${preview})` }} className="h-32 w-full rounded-xl bg-cover bg-center" />
          <button type="button" onClick={() => { setPreview(''); setFieldValue(''); }} className="absolute top-2 right-2 rounded-lg bg-zinc-900/80 p-1.5 text-red-400 hover:bg-red-500/20"><X size={14} /></button>
        </div>
      )}
      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
        className={`mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors ${dragOver ? 'border-cyan-400 bg-cyan-400/5' : 'border-zinc-700 hover:border-zinc-600'}`}>
        <Upload size={20} className="text-zinc-500" /><span className="text-xs text-zinc-500">{uploading ? 'Uploading...' : 'Drop image or click to upload'}</span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
      <input type="text" inputMode="url" name={name} required placeholder="Or paste image URL" value={fieldValue}
        onChange={(e) => { setFieldValue(e.target.value); setPreview(e.target.value); }} className={`mt-2 ${inputClass}`} />
    </label>
  );
}

function Field({ name, label, type = 'text', required = true, value }: { name: string; label: string; type?: string; required?: boolean; value?: string }) {
  return <label className="block text-sm font-semibold text-zinc-300">{label}<input name={name} type={type} required={required} defaultValue={value || ''} className={`mt-2 ${inputClass}`} /></label>;
}

function ContentFields({ blog, item }: { blog: boolean; item?: Project | Blog }) {
  return (
    <>
      <Field name="title" label="Title" value={item && 'title' in item ? item.title : undefined} />
      <Field name="slug" label="Slug (optional)" required={false} value={item && 'slug' in item ? (item as Project | Blog).slug : undefined} />
      <Field name="category" label="Category" value={item && 'category' in item ? (item as Project | Blog).category : undefined} />
      <ImageUpload name="image" label="Image" value={item?.image} />
      <label className="block text-sm font-semibold text-zinc-300">Short description<textarea name="excerpt" required rows={3} defaultValue={item?.excerpt || ''} className={`mt-2 ${inputClass}`} /></label>
      <label className="block text-sm font-semibold text-zinc-300">Full content<textarea name="content" required rows={6} defaultValue={item?.content || ''} className={`mt-2 ${inputClass}`} /></label>
      {blog ? <Field name="publishedAt" label="Publish date" type="date" value={item && 'publishedAt' in item ? (item as Blog).publishedAt : undefined} /> : <Field name="url" label="Live project URL (optional)" type="url" required={false} value={item && 'url' in item ? (item as Project).url : undefined} />}
    </>
  );
}

function TeamFields({ member }: { member?: TeamMember }) {
  const s = member?.socials;
  return (
    <>
      <Field name="name" label="Name" value={member?.name} />
      <Field name="role" label="Role" value={member?.role} />
      <ImageUpload name="image" label="Photo" value={member?.image} />
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Social Links</p>
        <Field name="linkedin" label="LinkedIn" type="url" required={false} value={s?.linkedin} />
        <Field name="github" label="GitHub" type="url" required={false} value={s?.github} />
        <Field name="twitter" label="X / Twitter" type="url" required={false} value={s?.twitter} />
        <Field name="instagram" label="Instagram" type="url" required={false} value={s?.instagram} />
        <Field name="whatsapp" label="WhatsApp" type="url" required={false} value={s?.whatsapp} />
      </div>
    </>
  );
}
