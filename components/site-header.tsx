import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-cyan-400">Softonic IT Solutions</Link>
        <nav className="flex items-center gap-5 text-sm font-semibold text-zinc-300">
          <Link href="/projects" className="hover:text-cyan-400">Projects</Link>
          <Link href="/blogs" className="hover:text-cyan-400">Blogs</Link>
          <Link href="/#contact" className="hidden hover:text-cyan-400 sm:block">Contact</Link>
        </nav>
      </div>
    </header>
  );
}