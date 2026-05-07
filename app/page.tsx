import { Playfair_Display, DM_Sans } from 'next/font/google';
import GI2ENavbar from '@/components/gi2e/layout/Navbar';
import GI2EFooter from '@/components/gi2e/layout/Footer';
import Hero from '@/components/gi2e/home/Hero';
import Stats from '@/components/gi2e/home/Stats';
import About from '@/components/gi2e/home/About';
import Services from '@/components/gi2e/home/Services';
import ZoneMap from '@/components/gi2e/home/ZoneMap';
import Testimonials from '@/components/gi2e/home/Testimonials';
import NewsPreview from '@/components/gi2e/home/NewsPreview';
import Partners from '@/components/gi2e/home/Partners';
import CtaFinal from '@/components/gi2e/home/CtaFinal';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });

export const metadata = {
  title: 'GI2E — Groupement Ivoire Eco Environnement',
  description:
    "Depuis 2013, GI2E accompagne collectivités, entreprises et acteurs du BTP dans la gestion durable des déchets et l'assainissement urbain en Côte d'Ivoire et au Togo.",
};

export default function Home() {
  return (
    <div className={`${playfair.variable} ${dmSans.variable}`}>
      <GI2ENavbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <ZoneMap />
        <Testimonials />
        <NewsPreview />
        <Partners />
        <CtaFinal />
      </main>
      <GI2EFooter />
    </div>
  );
}

