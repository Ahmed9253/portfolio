import { NextResponse } from 'next/server';
import { addContact } from '@/lib/content';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    await addContact({ name, email, subject, message });
    return NextResponse.json({ message: 'Message sent successfully! We will get back to you soon.' }, { status: 200 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}
