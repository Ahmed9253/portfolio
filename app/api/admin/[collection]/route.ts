import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { addContent, deleteContent, updateContent, isCollection } from '@/lib/content';

type Context = { params: Promise<{ collection: string }> };

function refreshPages() {
  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath('/blogs');
  revalidatePath('/admin');
}

export async function POST(request: Request, { params }: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { collection } = await params;
  if (!isCollection(collection)) return NextResponse.json({ error: 'Invalid collection' }, { status: 404 });
  try {
    const created = await addContent(collection, await request.json());
    refreshPages();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to add item' }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { collection } = await params;
  if (!isCollection(collection)) return NextResponse.json({ error: 'Invalid collection' }, { status: 404 });
  const { id, ...input } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });
  try {
    const updated = await updateContent(collection, id, input);
    if (!updated) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    refreshPages();
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update item' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { collection } = await params;
  if (!isCollection(collection)) return NextResponse.json({ error: 'Invalid collection' }, { status: 404 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });
  const deleted = await deleteContent(collection, id);
  if (!deleted) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  refreshPages();
  return NextResponse.json({ ok: true });
}