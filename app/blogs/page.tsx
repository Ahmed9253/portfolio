import type { Metadata } from 'next';
import ContentCard from '@/components/content-card';
import Footer from '@/components/footer';
import SiteHeader from '@/components/site-header';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Blog | DevQuantums', description: 'Ideas from the DevQuantums team.' };

export default async function BlogsPage() {
  const { blogs, socials } = await getContent();
  return (
    <div className="min-h-screen bg-zinc-950">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-20">
        <p className="font-bold uppercase tracking-[0.25em] text-cyan-400">Insights</p>
        <h1 className="mt-4 text-5xl font-black text-white md:text-7xl">Ideas worth sharing.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">Notes on engineering, design, AI, and building products people value.</p>
        {blogs.length ? (
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {blogs.map((blog) => <ContentCard key={blog.id} href={`/blogs/${blog.slug}`} {...blog} meta={blog.publishedAt} />)}
          </div>
        ) : <p className="mt-16 text-zinc-500">Articles will appear here soon.</p>}
      </main>
      <Footer socials={socials} />
    </div>
  );
}