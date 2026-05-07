import { Playfair_Display, DM_Sans } from 'next/font/google';
import GI2ENavbar from '@/components/gi2e/layout/Navbar';
import GI2EFooter from '@/components/gi2e/layout/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${dmSans.variable}`}>
      <GI2ENavbar />
      <main>{children}</main>
      <GI2EFooter />
    </div>
  );
}
