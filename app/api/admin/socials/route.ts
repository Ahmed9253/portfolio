import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { updateSocials } from '@/lib/content';

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const socials = await updateSocials(await request.json());
    revalidatePath('/');
    return NextResponse.json(socials);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update socials' }, { status: 400 });
  }
}
