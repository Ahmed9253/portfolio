import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { deleteContact, getContent } from '@/lib/content';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { contacts } = await getContent();
  return NextResponse.json(contacts);
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing contact id' }, { status: 400 });
  const deleted = await deleteContact(id);
  if (!deleted) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  revalidatePath('/admin');
  return NextResponse.json({ ok: true });
}
