'use client';

import { motion } from 'motion/react';
import type { SocialLinks } from '@/lib/content';
import { socialHref, socialLinkConfig } from '@/lib/social-links';

export default function About({ socials }: { socials?: SocialLinks }) {
  return (
    <section id="studio" className="relative overflow-hidden bg-[#0c0c0d] px-5 py-24 text-zinc-100 md:py-32">
      <span className="absolute -right-8 top-0 select-none text-[14rem] font-black leading-none text-white/[0.025] md:text-[24rem]">
        dQ
      </span>
      <div className="relative mx-auto max-w-[82rem]">
        <div className="mb-16 flex items-center justify-between border-b border-white/15 pb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
          <span>About DevQuantums</span>
          <span>01 — Studio</span>
        </div>

        <div className="grid items-center gap-16 md:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-start"
          >
            <div className="relative mb-9 flex h-40 w-40 items-center justify-center md:h-48 md:w-48">
              <motion.div
                animate={{ rotate: [0, 4, -3, 0], scale: [1, 1.04, 0.98, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="nav-blob absolute inset-0 bg-gradient-to-br from-cyan-300 via-cyan-500 to-indigo-600"
              />
              <span className="relative font-mono text-4xl font-black tracking-tighter text-zinc-950 md:text-5xl">
                &lt;/dQ&gt;
              </span>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">Software company</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] md:text-5xl">DevQuantums</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.15, ease: 'easeOut' }}
          >
            <h3 className="max-w-3xl text-3xl font-medium leading-[1.15] tracking-[-0.035em] md:text-5xl">
              We turn complex ideas into software experiences that feel
              <span className="italic text-cyan-400"> remarkably simple.</span>
            </h3>
            <div className="mt-10 grid gap-7 border-t border-white/15 pt-8 sm:grid-cols-2">
              <p className="leading-relaxed text-zinc-400">
                Based in Pakistan and working worldwide, we partner with ambitious teams to create reliable, memorable software from first thought to final launch.
              </p>
              <p className="leading-relaxed text-zinc-400">
                Strategy, craft, and engineering move together here. The result is work that looks considered, performs beautifully, and grows with your business.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3 border-t border-white/15 pt-6">
                {socialLinkConfig.map((social) => {
                  const Icon = social.icon;
                  const value = socials?.[social.key] || '';
                  return value ? (
                    <a key={social.key} href={socialHref(social.key, value)}
                      target={social.key === 'gmail' ? undefined : '_blank'} rel="noreferrer" aria-label={social.label}
                      className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-all hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400 hover:text-zinc-950">
                      <Icon size={18} />
                    </a>
                  ) : (
                    <span key={social.key} title={`${social.label} link not configured`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-700">
                      <Icon size={18} />
                    </span>
                  );
                })}
              </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
