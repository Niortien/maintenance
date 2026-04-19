import { getSiteDashboard } from '@/service/site/site.action';
import SiteDashboard from '@/components/site/site-dashboard';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SiteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getSiteDashboard(id);

  if (!result.success) {
    notFound();
  }

  return <SiteDashboard dashboard={result.data} />;
}
