import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/footer';
import SiteHeader from '@/components/site-header';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = (await getContent()).blogs.find((item) => item.slug === slug);
  return blog ? { title: `${blog.title} | Softonic IT Solutions`, description: blog.excerpt } : {};
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const blog = content.blogs.find((item) => item.slug === slug);
  if (!blog) notFound();
  return (
    <div className="min-h-screen bg-zinc-950">
      <SiteHeader />
      <main>
        <header className="mx-auto max-w-4xl px-4 pb-12 pt-8 text-center">
          <nav className="mb-8 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-cyan-400 transition-colors">Blogs</Link>
            <span>/</span>
            <span className="text-zinc-300 truncate max-w-[200px]">{blog.title}</span>
          </nav>
          <Link href="/blogs" className="text-sm font-bold text-cyan-400">← Back to all articles</Link>
          <p className="mt-10 font-bold uppercase tracking-[0.25em] text-cyan-400">{blog.category} · {blog.publishedAt}</p>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white md:text-7xl">{blog.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-zinc-400">{blog.excerpt}</p>
        </header>
        <div className="mx-auto max-w-6xl px-4"><div role="img" aria-label={blog.title} style={{ backgroundImage: `url(${blog.image})` }} className="aspect-[4/3] sm:aspect-[16/8] w-full rounded-[1.5rem] sm:rounded-[2.5rem] bg-cover bg-center" /></div>
        <article className="mx-auto max-w-3xl whitespace-pre-line px-4 py-10 sm:py-16 text-base sm:text-lg leading-7 sm:leading-8 text-zinc-300">{blog.content}</article>
      </main>
      <Footer socials={content.socials} />
    </div>
  );
}
