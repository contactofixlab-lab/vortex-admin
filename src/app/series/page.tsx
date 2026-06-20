import AdminShell from "@/components/AdminShell";
import CatalogPage from "@/components/CatalogPage";
import { getCatalogoEpisodico } from "@/lib/catalogo";

export const revalidate = 0;

export default async function SeriesPage() {
  const SERIES = await getCatalogoEpisodico("serie");

  return (
    <AdminShell>
      <CatalogPage type="SERIE" items={SERIES} />
    </AdminShell>
  );
}
