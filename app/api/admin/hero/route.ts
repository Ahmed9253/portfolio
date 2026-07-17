import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { updateHero } from '@/lib/content';

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { image } = await request.json();
  if (!image || typeof image !== 'string') return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  try {
    await updateHero(image);
    revalidatePath('/');
    return NextResponse.json({ image });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update hero' }, { status: 400 });
  }
}
