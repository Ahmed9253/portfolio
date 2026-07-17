import { Globe, Code2, Cloud, Server, Brain, Palette, Layout, ShieldCheck } from 'lucide-react';

const services = [
  {
    title: 'Web Development',
    description: 'Modern, responsive websites with React, Next.js, and cutting-edge tech.',
    icon: Globe,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business needs.',
    icon: Code2,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    title: 'Cloud Computing',
    description: 'AWS, Azure, GCP solutions for scalable infrastructure.',
    icon: Cloud,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'DevOps & VPS',
    description: 'CI/CD pipelines, server management, and infrastructure as code.',
    icon: Server,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by AI/ML algorithms.',
    icon: Brain,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Graphic Designing',
    description: 'Stunning visuals for your brand identity.',
    icon: Palette,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    title: 'CMS Development',
    description: 'WordPress, Shopify, and custom CMS solutions.',
    icon: Layout,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    title: 'Cybersecurity',
    description: 'Secure your digital assets with our expert services.',
    icon: ShieldCheck,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
];

export default function Services() {
  return (
    <section className="py-20 px-4 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Comprehensive software development services tailored to elevate your business
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-zinc-800 p-6 rounded-3xl border border-zinc-700 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${service.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`${service.color} w-7 h-7`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
