'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Blog } from '@/lib/content';

const badgeColors = ['bg-yellow-400', 'bg-blue-500', 'bg-emerald-500'];

export default function News({ blogs: newsItems }: { blogs: Blog[] }) {
  if (!newsItems.length) return null;
  return (
    <section id="news" className="py-14 sm:py-24 px-4 bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 sm:mb-16"
        >
          News & Events
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Large News Item */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group cursor-pointer"
          >
            <Link href={`/blogs/${newsItems[0].slug}`} className="block relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] mb-6">
              <img
                src={newsItems[0].image}
                alt={newsItems[0].title}
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className={`absolute top-6 left-6 ${badgeColors[0]} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5`}>
                {newsItems[0].category}
              </span>
            </Link>
            <Link href={`/blogs/${newsItems[0].slug}`} className="block text-2xl font-bold text-white hover:text-cyan-400 mb-3 leading-tight">{newsItems[0].title}</Link>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">{newsItems[0].publishedAt}</p>
          </motion.div>

          {/* Smaller News Stack */}
          <div className="flex flex-col gap-8">
            {newsItems.slice(1).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
                className="group cursor-pointer flex flex-col md:flex-row gap-6"
              >
                <div className="md:w-1/2 flex-shrink-0">
                  <Link href={`/blogs/${item.slug}`} className="block relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] h-48 md:h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className={`absolute top-4 left-4 ${badgeColors[(index + 1) % badgeColors.length]} text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1`}>
                      {item.category}
                    </span>
                  </Link>
                </div>
                <div className="md:w-1/2 flex flex-col justify-center">
                  <Link href={`/blogs/${item.slug}`} className="text-xl font-bold text-white hover:text-cyan-400 mb-3 leading-tight">{item.title}</Link>
                  <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">{item.publishedAt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <Link href="/blogs" className="group flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-zinc-700 text-white rounded-full hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300">
            <span className="text-sm font-bold uppercase tracking-widest">View all articles</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
