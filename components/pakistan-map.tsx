'use client';

import { motion } from 'motion/react';

export default function PakistanMap() {
  return (
    <section className="py-12 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-4 text-zinc-400 text-sm mb-6">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Based in Pakistan</span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="relative">
            <div className="text-8xl md:text-[10rem] font-black text-zinc-800">
              PAKISTAN
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg"
                alt="Pakistan Flag"
                className="w-32 h-20 object-contain opacity-90"
              />
            </div>
          </div>
          <p className="text-zinc-500 mt-6 text-sm">
            Delivering excellence from the heart of South Asia
          </p>
        </motion.div>
      </div>
    </section>
  );
}
