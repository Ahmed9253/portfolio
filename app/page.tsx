import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import About from '@/components/about';
import TeamServices from '@/components/team-services';
import Portfolio from '@/components/portfolio';
import News from '@/components/news';
import Contact from '@/components/contact';
import PakistanMap from '@/components/pakistan-map';
import Footer from '@/components/footer';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const content = await getContent();
  return (
    <div className="min-h-screen bg-zinc-950">
      <Hero image={content.hero?.image} />
      <Navbar />
      <About socials={content.socials} />
      <TeamServices teamMembers={content.team} />
      <Portfolio projects={content.projects} />
      <News blogs={content.blogs.slice(0, 3)} />
      <Contact />
      <PakistanMap />
      <Footer socials={content.socials} />
    </div>
  );
}
