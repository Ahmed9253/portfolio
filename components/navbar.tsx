'use client';

import { Zap, X } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';

const navItems = [
    { name: 'Home', href: '#home', active: true },
    { name: 'Our Studio', href: '#studio', active: false },
    { name: 'Projects', href: '#portfolio', active: false },
    { name: 'Blogs', href: '#news', active: false },
    { name: 'Contact Us', href: '#contact', active: false },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
            <motion.div
                layout
                animate={{
                    width: open ? 290 : 72,
                    height: open ? 382 : 72,
                    borderRadius: open ? 34 : 36,
                    y: open ? 0 : [0, -6, 0],
                }}
                transition={open
                    ? { type: 'spring', stiffness: 220, damping: 24 }
                    : { y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }, layout: { type: 'spring' } }
                }
                className={`relative overflow-hidden border shadow-2xl ${
                    open
                        ? 'border-white/15 bg-zinc-950/95 shadow-black/60 backdrop-blur-2xl'
                        : 'border-white/40 bg-gradient-to-br from-cyan-300 via-cyan-500 to-indigo-600 shadow-cyan-400/50'
                }`}
            >
                {!open && <span className="nav-blob pointer-events-none absolute inset-1 bg-white/15" />}
                {!open && (
                    <button
                        type="button"
                        aria-label="Open menu"
                        aria-expanded="false"
                        onClick={() => setOpen(true)}
                        className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center text-white"
                    >
                        <motion.span whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}>
                            <Zap size={25} />
                        </motion.span>
                    </button>
                )}
                <div className={`relative flex h-[72px] items-center px-5 ${open ? 'justify-between' : 'justify-center'}`}>
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                className="flex items-center gap-3"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-zinc-950">
                                    <Zap size={18} />
                                </span>
                                <span className="text-sm font-bold tracking-tight text-white">Softonic IT Solutions</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {open && (
                        <button
                            type="button"
                            aria-label="Close menu"
                            aria-expanded="true"
                            onClick={() => setOpen(false)}
                            className="relative z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        >
                            <motion.span initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ type: 'spring' }}>
                                <X size={20} />
                            </motion.span>
                        </button>
                    )}
                </div>

            <AnimatePresence>
                {open && (
                    <motion.nav
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={{
                            open: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
                            closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                        }}
                        className="border-t border-white/10 px-4 pb-4 pt-3"
                    >
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                variants={{
                                    open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 320, damping: 24 } },
                                    closed: { opacity: 0, x: 22 },
                                }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="group flex items-center justify-between border-b border-white/[0.08] px-2 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                                >
                                    <span className="flex items-center gap-4">
                                        <span className="text-[10px] text-cyan-400/70">0{index + 1}</span>
                                        {item.name}
                                    </span>
                                    <span className="text-cyan-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">→</span>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.nav>
                )}
            </AnimatePresence>
            </motion.div>
            <AnimatePresence>
                {!open && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 top-[78px] -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/60"
                    >
                        Menu
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
}
