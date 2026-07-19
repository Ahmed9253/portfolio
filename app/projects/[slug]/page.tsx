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
  const project = (await getContent()).projects.find((item) => item.slug === slug);
  return project ? { title: `${project.title} | Softonic IT Solutions`, description: project.excerpt } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const project = content.projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <div className="min-h-screen bg-zinc-950">
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-cyan-400 transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-zinc-300 truncate max-w-[200px]">{project.title}</span>
          </nav>
          <Link href="/projects" className="text-sm font-bold text-cyan-400">← Back to all projects</Link>
          <p className="mt-10 font-bold uppercase tracking-[0.25em] text-cyan-400">{project.category}</p>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-white md:text-7xl">{project.title}</h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-zinc-400">{project.excerpt}</p>
        </div>
        <div className="mx-auto max-w-6xl px-4"><div role="img" aria-label={project.title} style={{ backgroundImage: `url(${project.image})` }} className="aspect-[4/3] sm:aspect-[16/8] w-full rounded-[1.5rem] sm:rounded-[2.5rem] bg-cover bg-center" /></div>
        <article className="mx-auto max-w-3xl whitespace-pre-line px-4 py-10 sm:py-16 text-base sm:text-lg leading-7 sm:leading-8 text-zinc-300">{project.content}</article>
        {project.url && <div className="pb-20 text-center"><a href={project.url} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-400 px-7 py-4 font-bold text-zinc-950 hover:bg-cyan-300 transition-colors">Visit project ↗</a></div>}
      </main>
      <Footer socials={content.socials} />
    </div>
  );
}
