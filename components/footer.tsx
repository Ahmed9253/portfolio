'use client';

import { motion } from 'motion/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { SocialLinks } from '@/lib/content';
import { socialHref, socialLinkConfig } from '@/lib/social-links';

export default function Footer({ socials }: { socials?: SocialLinks }) {
  const email = socials?.gmail || 'info@devquantums.com';

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-5"
          >
            <h3 className="text-2xl font-bold text-cyan-400">DevQuantums</h3>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              A software company building dependable web, cloud, AI, and business solutions from Pakistan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="mb-5 text-lg font-semibold">Contact</h4>
            <div className="flex items-center gap-3 text-zinc-400"><MapPin size={18} /><span className="text-sm">Rawalpindi, Pakistan</span></div>
            <a href={`mailto:${email}`} className="flex items-center gap-3 text-zinc-400 transition-colors hover:text-cyan-400"><Mail size={18} /><span className="text-sm">{email}</span></a>
            <div className="flex items-center gap-3 text-zinc-400"><Phone size={18} /><span className="text-sm">+92 300 123 4567</span></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="mb-5 text-lg font-semibold">Connect</h4>
            <div className="flex flex-wrap gap-3">
                {socialLinkConfig.map((social) => {
                  const Icon = social.icon;
                  const value = socials?.[social.key] || '';
                  return value ? (
                    <a key={social.key} href={socialHref(social.key, value)}
                      target={social.key === 'gmail' ? undefined : '_blank'} rel="noreferrer" aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all hover:-translate-y-1 hover:border-cyan-500 hover:text-cyan-400">
                      <Icon size={18} />
                    </a>
                  ) : (
                    <span key={social.key} title={`${social.label} link not configured`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-900 text-zinc-700">
                      <Icon size={18} />
                    </span>
                  );
                })}
              </div>
          </motion.div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          © 2026 DevQuantums. All rights reserved.
          <a href="/admin" className="ml-2 text-zinc-600 hover:text-cyan-400 transition-colors">Admin</a>
        </div>
      </div>
    </footer>
  );
}