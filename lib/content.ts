import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getDb } from './mongodb';

export type Project = {
  id: string; slug: string; title: string; category: string; excerpt: string;
  content: string; image: string; url: string;
};

export type Blog = {
  id: string; slug: string; title: string; category: string; excerpt: string;
  content: string; image: string; publishedAt: string;
};

export type TeamMember = {
  id: string; name: string; role: string; image: string;
  socials: { linkedin: string; github: string; twitter: string; instagram: string; whatsapp: string };
};

export type HeroData = { image: string };

export type SocialLinks = {
  instagram: string; whatsapp: string; gmail: string; x: string; linkedin: string;
};

export type Contact = {
  id: string; name: string; email: string; subject: string; message: string; createdAt: string;
};

export type ContentData = {
  projects: Project[]; blogs: Blog[]; team: TeamMember[];
  hero: HeroData; socials: SocialLinks; contacts: Contact[];
};
export type Collection = 'projects' | 'blogs' | 'team';

const dataFile = path.join(process.cwd(), 'content', 'content.json');
let writeQueue = Promise.resolve();

const defaultHero: HeroData = { image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&q=80' };
const defaultSocials: SocialLinks = { instagram: '', whatsapp: '', gmail: '', x: '', linkedin: '' };

function text(input: Record<string, unknown>, key: string, required = true) {
  const value = typeof input[key] === 'string' ? input[key].trim() : '';
  if (required && !value) throw new Error(`${key} is required`);
  if (value.length > 10000) throw new Error(`${key} is too long`);
  return value;
}

function url(input: Record<string, unknown>, key: string, required = false) {
  const value = text(input, key, required);
  if (!value) return '';
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error();
    return value;
  } catch {
    throw new Error(`${key} must be a valid http(s) URL`);
  }
}

function imageUrl(input: Record<string, unknown>, key: string) {
  const value = text(input, key);
  if (value.startsWith('/uploads/')) return value;
  return url(input, key, true);
}

function normalizeSocialLinks(input: unknown): SocialLinks {
  const values = typeof input === 'object' && input ? input as Record<string, unknown> : {};
  const gmail = text(values, 'gmail', false);
  if (gmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmail)) {
    throw new Error('gmail must be a valid email address');
  }
  return {
    instagram: url(values, 'instagram'),
    whatsapp: url(values, 'whatsapp'),
    gmail,
    x: url(values, 'x'),
    linkedin: url(values, 'linkedin'),
  };
}

export function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizeProject(input: Record<string, unknown>, id: string): Project {
  return {
    id, slug: makeSlug(text(input, 'slug', false) || text(input, 'title')),
    title: text(input, 'title'), category: text(input, 'category'), excerpt: text(input, 'excerpt'),
    content: text(input, 'content'), image: imageUrl(input, 'image'), url: url(input, 'url'),
  };
}

function normalizeBlog(input: Record<string, unknown>, id: string): Blog {
  return {
    id, slug: makeSlug(text(input, 'slug', false) || text(input, 'title')),
    title: text(input, 'title'), category: text(input, 'category'), excerpt: text(input, 'excerpt'),
    content: text(input, 'content'), image: imageUrl(input, 'image'), publishedAt: text(input, 'publishedAt'),
  };
}

function normalizeTeam(input: Record<string, unknown>, id: string): TeamMember {
  const socials = typeof input.socials === 'object' && input.socials ? input.socials as Record<string, unknown> : {};
  return {
    id, name: text(input, 'name'), role: text(input, 'role'), image: imageUrl(input, 'image'),
    socials: {
      linkedin: url(socials, 'linkedin'), github: url(socials, 'github'), twitter: url(socials, 'twitter'),
      instagram: url(socials, 'instagram'), whatsapp: url(socials, 'whatsapp'),
    },
  };
}

function normalize(collection: Collection, input: Record<string, unknown>, id: string) {
  if (collection === 'projects') return normalizeProject(input, id);
  if (collection === 'blogs') return normalizeBlog(input, id);
  return normalizeTeam(input, id);
}

// ── JSON file storage (fallback) ──────────────────────────────────

async function readJson(): Promise<ContentData> {
  const raw = JSON.parse(await fs.readFile(dataFile, 'utf8'));
  if (!raw.hero) raw.hero = defaultHero;
  raw.socials = normalizeSocialLinks(raw.socials || defaultSocials);
  if (!raw.contacts) raw.contacts = [];
  return raw as ContentData;
}

async function writeJson(data: ContentData) {
  await fs.writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`);
}

// ── MongoDB storage ───────────────────────────────────────────────

async function mongoGetAll(): Promise<ContentData | null> {
  const db = await getDb();
  if (!db) return null;
  const [projects, blogs, team, heroSetting, socialsSetting, contacts] = await Promise.all([
    db.collection<Project>('projects').find().toArray(),
    db.collection<Blog>('blogs').find().toArray(),
    db.collection<TeamMember>('team').find().toArray(),
    db.collection<{ key: string; value: unknown }>('settings').findOne({ key: 'hero' }),
    db.collection<{ key: string; value: unknown }>('settings').findOne({ key: 'socials' }),
    db.collection<Contact>('contacts').find().sort({ createdAt: -1 }).toArray(),
  ]);
  const stripMongoId = <T extends { _id?: unknown }>(document: T) => {
    const copy = { ...document };
    delete copy._id;
    return copy;
  };
  return {
    projects: projects.map(stripMongoId),
    blogs: blogs.map(stripMongoId),
    team: team.map(stripMongoId),
    hero: (heroSetting?.value as HeroData) || defaultHero,
    socials: normalizeSocialLinks(socialsSetting?.value || defaultSocials),
    contacts: contacts.map(stripMongoId),
  };
}

async function mongoAdd(collection: Collection, item: Project | Blog | TeamMember) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.collection(collection).insertOne(item);
}

async function mongoUpdate(collection: Collection, id: string, item: Project | Blog | TeamMember) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.collection(collection).updateOne({ id }, { $set: item });
}

async function mongoDelete(collection: Collection, id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db.collection(collection).deleteOne({ id });
  return result.deletedCount > 0;
}

async function mongoUpdateSettings(key: string, value: unknown) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.collection('settings').updateOne({ key }, { $set: { key, value } }, { upsert: true });
}

// ── Public API (auto-detects storage backend) ─────────────────────

export async function getContent(): Promise<ContentData> {
  const mongo = await mongoGetAll();
  if (mongo) return mongo;
  return readJson();
}

export async function getHero(): Promise<HeroData> {
  const content = await getContent();
  return content.hero || defaultHero;
}

export async function updateHero(image: string) {
  const hero = { image };
  const db = await getDb();
  if (db) {
    await mongoUpdateSettings('hero', hero);
  } else {
    writeQueue = writeQueue.catch(() => undefined).then(async () => {
      const data = await readJson();
      data.hero = hero;
      await writeJson(data);
    });
    await writeQueue;
  }
}

export async function updateSocials(input: unknown) {
  const socials = normalizeSocialLinks(input);
  const db = await getDb();
  if (db) {
    await mongoUpdateSettings('socials', socials);
  } else {
    writeQueue = writeQueue.catch(() => undefined).then(async () => {
      const data = await readJson();
      data.socials = socials;
      await writeJson(data);
    });
    await writeQueue;
  }
  return socials;
}

export async function addContact(input: { name: string; email: string; subject: string; message: string }) {
  const contact: Contact = { id: randomUUID(), ...input, createdAt: new Date().toISOString().split('T')[0] };
  const db = await getDb();
  if (db) {
    await db.collection('contacts').insertOne(contact);
  } else {
    writeQueue = writeQueue.catch(() => undefined).then(async () => {
      const data = await readJson();
      data.contacts.unshift(contact);
      await writeJson(data);
    });
    await writeQueue;
  }
  return contact;
}

export async function deleteContact(id: string): Promise<boolean> {
  const db = await getDb();
  if (db) {
    const result = await db.collection('contacts').deleteOne({ id });
    return result.deletedCount > 0;
  }
  let deleted = false;
  writeQueue = writeQueue.catch(() => undefined).then(async () => {
    const data = await readJson();
    const before = data.contacts.length;
    data.contacts = data.contacts.filter((c) => c.id !== id);
    deleted = data.contacts.length < before;
    if (deleted) await writeJson(data);
  });
  await writeQueue;
  return deleted;
}

export async function addContent(collection: Collection, input: Record<string, unknown>) {
  let created: Project | Blog | TeamMember | undefined;
  const db = await getDb();
  if (db) {
    const id = randomUUID();
    const item = normalize(collection, input, id);
    if (collection === 'projects' || collection === 'blogs') {
      const slug = (item as Project | Blog).slug;
      const existing = await db.collection(collection).countDocuments({ slug });
      if (existing) throw new Error('Slug must be unique');
    }
    await mongoAdd(collection, item);
    created = item;
  } else {
    writeQueue = writeQueue.catch(() => undefined).then(async () => {
      const data = await readJson();
      const id = randomUUID();
      const item = normalize(collection, input, id);
      if (collection === 'projects' || collection === 'blogs') {
        const slug = (item as Project | Blog).slug;
        if (!slug || data[collection].some((s) => s.slug === slug)) throw new Error('Slug must be unique');
      }
      created = item;
      (data[collection] as (Project | Blog | TeamMember)[]).push(item);
      await writeJson(data);
    });
    await writeQueue;
  }
  return created;
}

export async function updateContent(collection: Collection, id: string, input: Record<string, unknown>) {
  let updated: Project | Blog | TeamMember | undefined;
  const db = await getDb();
  if (db) {
    const item = normalize(collection, input, id);
    if (collection === 'projects' || collection === 'blogs') {
      const slug = (item as Project | Blog).slug;
      const existing = await db.collection(collection).countDocuments({ slug, id: { $ne: id } });
      if (existing) throw new Error('Slug must be unique');
    }
    await mongoUpdate(collection, id, item);
    updated = item;
  } else {
    writeQueue = writeQueue.catch(() => undefined).then(async () => {
      const data = await readJson();
      const current = data[collection] as (Project | Blog | TeamMember)[];
      const index = current.findIndex((item) => item.id === id);
      if (index === -1) throw new Error('Item not found');
      const item = normalize(collection, input, id);
      if (collection === 'projects' || collection === 'blogs') {
        const slug = (item as Project | Blog).slug;
        const existing = data[collection] as (Project | Blog)[];
        if (!slug || existing.some((s) => s.slug === slug && s.id !== id)) throw new Error('Slug must be unique');
      }
      updated = item;
      (data[collection] as (Project | Blog | TeamMember)[])[index] = item;
      await writeJson(data);
    });
    await writeQueue;
  }
  return updated;
}

export async function deleteContent(collection: Collection, id: string) {
  const db = await getDb();
  if (db) {
    return mongoDelete(collection, id);
  }
  let deleted = false;
  writeQueue = writeQueue.catch(() => undefined).then(async () => {
    const data = await readJson();
    const current = data[collection] as { id: string }[];
    const next = current.filter((item) => item.id !== id);
    deleted = next.length !== current.length;
    if (deleted) {
      if (collection === 'projects') data.projects = next as Project[];
      if (collection === 'blogs') data.blogs = next as Blog[];
      if (collection === 'team') data.team = next as TeamMember[];
      await writeJson(data);
    }
  });
  await writeQueue;
  return deleted;
}

export function isCollection(value: string): value is Collection {
  return value === 'projects' || value === 'blogs' || value === 'team';
}
