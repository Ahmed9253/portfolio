'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

const TITLE = 'Softonic IT Solutions';
const MERIDIANS = [0, 30, 60, 90, 120, 150];
const STARS = Array.from({ length: 22 });

export default function Hero({ image }: { image?: string }) {
  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-zinc-950 hero-perspective"
    >
      {image && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-[0.045] grayscale"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#111d31_0%,#070a11_44%,#030305_78%)]" />
      <div className="hero-grid absolute inset-0 opacity-55" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-zinc-950 to-transparent" />

      {/* Twinkling stars */}
      <div className="absolute inset-0">
        {STARS.map((_, i) => (
          <span
            key={i}
            className="hero-twinkle absolute h-0.5 w-0.5 rounded-full bg-cyan-300"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 7) * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[47%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 sm:h-[420px] sm:w-[420px] md:h-[700px] md:w-[700px]">
        <div className="hero-glow absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),transparent_67%)] blur-3xl" />
        <div className="absolute -inset-10 rounded-full border border-cyan-300/[0.08]" />
        <div className="absolute -inset-24 rounded-full border border-indigo-300/[0.05]" />
        <div className="hero-globe">
          <div className="hero-ring !border-cyan-400/40" />
          {MERIDIANS.map((deg) => (
            <div
              key={deg}
              className="hero-ring"
              style={{ transform: `rotateY(${deg}deg)`, borderColor: 'rgba(129,140,248,0.22)' }}
            />
          ))}
          <div className="hero-ring" style={{ transform: 'rotateX(90deg)', borderColor: 'rgba(34,211,238,0.28)' }} />
          <div className="hero-ring" style={{ transform: 'rotateX(90deg) translateZ(140px) scale(0.82)' }} />
          <div className="hero-ring" style={{ transform: 'rotateX(90deg) translateZ(-140px) scale(0.82)' }} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-5 top-1/2 hidden -translate-y-1/2 items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-white/25 lg:flex">
        <span className="[writing-mode:vertical-rl]">Designing digital futures</span>
        <span className="[writing-mode:vertical-rl] rotate-180">Pakistan · Worldwide</span>
      </div>

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-7 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-200/70"
        >
          <span className="h-px w-8 bg-cyan-300/50" />
          Strategy · Design · Engineering
          <span className="h-px w-8 bg-cyan-300/50" />
        </motion.div>

        <div className="relative mb-7">
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
            className="hero-title-hollow font-display text-[clamp(3.3rem,9.5vw,8.5rem)] font-black leading-[0.9] tracking-[0.02em]"
          >
            {TITLE.split(' ').map((word, wi) => (
              <span key={wi} className="inline-block">
                {word.split('').map((ch, ci) => (
                  <motion.span
                    key={ci}
                    variants={{
                      hidden: { opacity: 0, y: 40, rotateX: -90 },
                      show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                    }}
                    className="inline-block"
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            )).reduce<React.ReactNode[]>((acc, word, i) => {
              if (i > 0) acc.push(<span key={`gap-${i}`} className="inline-block w-[0.3em]" />);
              acc.push(word);
              return acc;
            }, [])}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg md:text-xl"
        >
          We shape ambitious ideas into thoughtful digital products—built to move
          <span className="font-semibold text-white"> people and businesses forward.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.03]"
          >
            Start a Project <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 px-2 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Explore Our Work <span className="h-px w-8 bg-cyan-400 transition-all group-hover:w-12" />
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
          Scroll Down
        </span>
        <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/25 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1 rounded-full bg-cyan-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
