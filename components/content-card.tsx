import Link from 'next/link';

type Props = {
  href: string; title: string; category: string; excerpt: string; image: string; meta?: string;
};

export default function ContentCard({ href, title, category, excerpt, image, meta }: Props) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
      <Link href={href} className="block aspect-[16/10] overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </Link>
      <div className="p-7">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest text-cyan-400">
          <span>{category}</span>{meta && <span className="text-zinc-500">{meta}</span>}
        </div>
        <Link href={href} className="text-2xl font-bold text-white transition hover:text-cyan-400">{title}</Link>
        <p className="mt-3 leading-relaxed text-zinc-400">{excerpt}</p>
        <Link href={href} className="mt-6 inline-block text-sm font-bold text-white hover:text-cyan-400">View details →</Link>
      </div>
    </article>
  );
}