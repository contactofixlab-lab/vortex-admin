import AdminShell from "@/components/AdminShell";
import CatalogPage from "@/components/CatalogPage";
import { getCatalogoEpisodico } from "@/lib/catalogo";

export const revalidate = 0;

export default async function AnimePage() {
  const ANIME = await getCatalogoEpisodico("anime");

  return (
    <AdminShell>
      <CatalogPage type="ANIME" items={ANIME} />
    </AdminShell>
  );
}
