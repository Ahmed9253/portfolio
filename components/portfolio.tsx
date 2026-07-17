'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, type MotionValue } from 'motion/react';
import type { Project } from '@/lib/content';

const accents = ['#22d3ee', '#f472b6', '#34d399', '#fbbf24', '#a78bfa'];

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function ProjectCard({ project, index, total, progress }: ProjectCardProps) {
  const step = 1 / Math.max(total, 1);
  const enterStart = index === 0 ? 0 : index * step - step * 0.42;
  const enterEnd = index === 0 ? 0.001 : index * step;
  const isLast = index === total - 1;
  const nextStart = isLast ? 1 : (index + 1) * step - step * 0.2;
  const nextEnd = isLast ? 1.001 : (index + 1) * step;
  const y = useTransform(progress, [enterStart, enterEnd], index === 0 ? ['0%', '0%'] : ['112%', '0%']);
  const scale = useTransform(progress, [nextStart, nextEnd], [1, 0.95]);
  const opacity = useTransform(progress, [nextStart, nextEnd], [1, 0.6]);
  const imageScale = useTransform(progress, [enterStart, isLast ? 1 : nextEnd], [1.12, 1]);

  return (
    <motion.article
      style={{ y, scale, opacity, zIndex: index + 1 }}
      className="absolute inset-0 origin-top overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:rounded-[2.5rem]"
    >
      <Link href={`/projects/${project.slug}`} className="group block h-full">
        <motion.div
          style={{ scale: imageScale, backgroundImage: `url(${project.image})` }}
          className="absolute inset-0 bg-cover bg-center transition-[filter] duration-700 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 md:p-9">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/65">
            Project {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/15 text-white backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-black">
            <ArrowUpRight size={19} />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-7 md:p-11">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accents[index % accents.length] }} />
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">{project.category}</span>
          </div>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h3 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">{project.title}</h3>
            <p className="max-w-md text-sm leading-relaxed text-zinc-300 md:text-right md:text-base">{project.excerpt}</p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Portfolio({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const progressMV = useMotionValue(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const height = rect.height;
      const viewH = window.innerHeight;
      const totalScroll = Math.max(height - viewH, 1);
      const scrolled = window.scrollY - top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      progressMV.set(p);
      setBarWidth(p);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [projects.length, progressMV]);

  if (projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-[#080809]"
      style={{ height: `${Math.max(projects.length + 1, 2) * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 pb-6 pt-16 md:px-8 md:pb-8 md:pt-20">
        <div className="mx-auto mb-6 flex w-full max-w-7xl items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400">Selected projects</p>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">Work we are proud of.</h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-relaxed text-zinc-500 md:block">Scroll to explore each project</p>
        </div>

        <div className="relative mx-auto w-full max-w-7xl flex-1">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              progress={progressMV}
            />
          ))}
        </div>

        <div className="mx-auto mt-5 flex w-full max-w-7xl items-center gap-5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Scroll</span>
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <div style={{ width: `${barWidth * 100}%` }} className="h-full bg-cyan-400 transition-none" />
          </div>
          <Link href="/projects" className="group text-[10px] font-semibold uppercase tracking-widest text-zinc-400 transition-colors hover:text-white">
            Full archive <span className="inline-block transition-transform group-hover:translate-x-1">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
