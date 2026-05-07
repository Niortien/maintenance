import { Metadata } from 'next';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import SectionTag from '@/components/gi2e/ui/SectionTag';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = { title: 'Article — GI2E Actualités' };

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className={playfair.variable}>
      <section className="pt-32 pb-24 bg-white">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm text-[#22a05a] hover:text-[#145e38] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux actualités
          </Link>

          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full bg-[#f0fdf4] text-[#145e38] mb-5">
            <Tag className="h-3 w-3" />
            Actualité
          </span>

          <h1
            className="gi2e-h2 text-[#052e16] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Article : {slug.replace(/-/g, ' ')}
          </h1>

          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-10">
            <Calendar className="h-4 w-4" />
            <span>2025</span>
          </div>

          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 leading-relaxed text-lg">
              Le contenu complet de cet article sera disponible prochainement.
              Revenez bientôt pour découvrir les dernières actualités de GI2E.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
