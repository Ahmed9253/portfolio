import type { Metadata } from 'next';
import ContentCard from '@/components/content-card';
import Footer from '@/components/footer';
import SiteHeader from '@/components/site-header';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Projects | Softonic IT Solutions', description: 'Explore our software projects.' };

export default async function ProjectsPage() {
  const { projects, socials } = await getContent();
  return (
    <div className="min-h-screen bg-zinc-950">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-20">
        <p className="font-bold uppercase tracking-[0.25em] text-cyan-400">Our work</p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-black text-white md:text-7xl">Projects built for impact.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">Strategy, design, and engineering working together to create lasting digital products.</p>
        {projects.length ? (
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {projects.map((project) => <ContentCard key={project.id} href={`/projects/${project.slug}`} {...project} />)}
          </div>
        ) : <p className="mt-16 text-zinc-500">Projects will appear here soon.</p>}
      </main>
      <Footer socials={socials} />
    </div>
  );
}