'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeftIcon, ChevronRightIcon, EarthIcon, TerminalIcon, CloudUploadIcon, ZapIcon, BrainIcon, PenToolIcon, LayoutGridIcon, LockIcon } from 'lucide-animated';
import type { TeamMember } from '@/lib/content';

const teamSocialIcons: Record<string, { label: string; path: string }> = {
  linkedin: { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  github: { label: 'GitHub', path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' },
  twitter: { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  instagram: { label: 'Instagram', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z' },
  whatsapp: { label: 'WhatsApp', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z' },
};

const services = [
  { title: 'Web Dev', icon: EarthIcon, color: 'text-blue-400' },
  { title: 'Software', icon: TerminalIcon, color: 'text-cyan-400' },
  { title: 'Cloud', icon: CloudUploadIcon, color: 'text-green-400' },
  { title: 'DevOps', icon: ZapIcon, color: 'text-orange-400' },
  { title: 'AI/ML', icon: BrainIcon, color: 'text-purple-400' },
  { title: 'Design', icon: PenToolIcon, color: 'text-pink-400' },
  { title: 'CMS', icon: LayoutGridIcon, color: 'text-yellow-400' },
  { title: 'Security', icon: LockIcon, color: 'text-red-400' },
];

export default function TeamServices({ teamMembers }: { teamMembers: TeamMember[] }) {
  const [currentMemberIdx, setCurrentMemberIdx] = useState(0);

  const nextMember = () => {
    setCurrentMemberIdx((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentMemberIdx((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const currentMember = teamMembers[currentMemberIdx] ?? null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <section id="studio" className="py-20 md:py-24 px-4 bg-zinc-950">
      <div className="max-w-[90rem] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl"
        >
          {/* Column 1: Services Grid */}
          <motion.div variants={columnVariants} className="bg-zinc-900/60 p-10 md:p-12 flex flex-col justify-center z-10">
            <h3 className="text-white font-bold mb-10 text-3xl tracking-tight">Our Services</h3>
            <div className="grid grid-cols-2 gap-8">
              {services.map((s, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="mb-4 flex items-center justify-center">
                    <s.icon className={s.color} size={40} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">{s.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Dark Text Box */}
          <motion.div variants={columnVariants} className="bg-zinc-900 text-white flex flex-col justify-center px-12 py-20 z-20 shadow-2xl">
            <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white">We&apos;re idealists and strategic thinkers.</h3>
            <p className="text-zinc-400 text-base mb-12 leading-relaxed">
              Transforming complex challenges into elegant digital solutions with a focus on innovation and scalability.
            </p>
            <div className="flex flex-col gap-6">
              <a href="#news" className="text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-cyan-400 transition-colors flex items-center gap-3">
                <span className="w-8 h-px bg-cyan-500"></span> Read News & Events
              </a>
              <a href="#contact" className="text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-cyan-400 transition-colors flex items-center gap-3">
                <span className="w-8 h-px bg-cyan-500"></span> Work with Us
              </a>
            </div>
          </motion.div>

          {/* Column 3: Team Image with Label */}
          <motion.div variants={columnVariants} className="relative aspect-square md:aspect-auto min-h-[500px] overflow-hidden bg-zinc-800 z-10">
            {currentMember ? <><AnimatePresence mode="wait">
              <motion.img
                key={currentMember.id}
                src={currentMember.image}
                alt={currentMember.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-0 right-0 bg-cyan-500 text-zinc-950 px-8 py-6 rounded-tl-[2rem] shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMember.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xl font-black tracking-tight">{currentMember.name}</p>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">{currentMember.role}</p>
                  <div className="flex gap-2.5 mt-3">
                    {Object.entries(currentMember.socials).filter(([,url]) => url).map(([key]) => {
                      const icon = teamSocialIcons[key];
                      if (!icon) return null;
                      return (
                        <a key={key} aria-label={icon.label} href={currentMember.socials[key as keyof typeof currentMember.socials]} target="_blank" rel="noreferrer"
                          className="w-4 h-4 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]"><path d={icon.path} /></svg>
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div></> : <div className="absolute inset-0 grid place-items-center text-zinc-500">Add team members from the admin panel.</div>}
            {teamMembers.length > 1 && <div className="absolute bottom-6 left-6 flex gap-3">
              <button
                onClick={prevMember}
                className="w-12 h-12 bg-zinc-900/80 backdrop-blur-sm text-white flex items-center justify-center rounded-full hover:bg-cyan-500 hover:text-zinc-950 transition-all shadow-lg border border-zinc-700/50 hover:border-cyan-400"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button
                onClick={nextMember}
                className="w-12 h-12 bg-zinc-900/80 backdrop-blur-sm text-white flex items-center justify-center rounded-full hover:bg-cyan-500 hover:text-zinc-950 transition-all shadow-lg border border-zinc-700/50 hover:border-cyan-400"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
