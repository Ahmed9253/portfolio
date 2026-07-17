'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function LoadingScreen() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(pathname === '/');

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const steps = duration / interval;
    const increment = 100 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      const next = Math.min(current, 100);
      setProgress(next);
      if (next >= 100) {
        clearInterval(timer);
        setTimeout(() => setVisible(false), 300);
      }
    }, interval);

    return () => { clearInterval(timer); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.06),transparent_70%)]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center gap-10"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-snug text-center tracking-tight text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              Mainframe uplinked.<br />Initializing digital canvas
            </motion.p>

            <div className="flex flex-col items-center gap-5">
              <p className="text-sm font-medium tracking-wide text-zinc-400">
                Setting up link to DevQuantum servers...
              </p>

              <div className="relative h-1 w-72 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.03 }}
                />
              </div>

              <p className="text-xs font-bold tabular-nums text-zinc-600">{Math.round(progress)}%</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
