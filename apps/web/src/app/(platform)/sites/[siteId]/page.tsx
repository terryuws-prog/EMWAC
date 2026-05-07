import { notFound } from "next/navigation";
import { SiteDetailView } from "@/features/sites/site-detail-view";
import { getSiteDetailModel } from "@/features/monitoring/repository";

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const detail = getSiteDetailModel(siteId);

  if (!detail) {
    notFound();
  }

  return <SiteDetailView detail={detail} />;
}
