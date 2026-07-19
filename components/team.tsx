import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

export default function Team() {
  return (
    <section className="py-20 px-4 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="aspect-square lg:aspect-[4/3] overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Our Team"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="bg-zinc-800 text-white flex flex-col justify-center px-8 py-12 rounded-3xl border border-zinc-700">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Users className="text-cyan-400 w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Our Team</h3>
            <p className="text-gray-400 text-sm mb-6">
              Passionate developers, designers, and innovators working together to build the future of technology.
            </p>
            <div className="space-y-2">
              <a href="#news" className="text-sm text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">Read Our Story</a>
              <a href="#contact" className="text-sm text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">Join Our Team</a>
            </div>
          </div>
          <div className="aspect-square lg:aspect-[4/3] overflow-hidden rounded-3xl relative">
            <img
              src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&q=80"
              alt="Team member"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute bottom-4 right-4 bg-zinc-900/90 backdrop-blur text-white px-6 py-4 rounded-2xl border border-zinc-700">
              <p className="text-xl font-semibold">Softonic IT Solutions</p>
              <p className="text-sm text-gray-400">Innovating Since 2024</p>
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2">
              <button className="w-10 h-10 bg-zinc-900/90 text-white flex items-center justify-center rounded-full hover:bg-zinc-800">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 bg-zinc-900/90 text-white flex items-center justify-center rounded-full hover:bg-zinc-800">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
