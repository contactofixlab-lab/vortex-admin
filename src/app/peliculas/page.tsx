import AdminShell from "@/components/AdminShell";
import CatalogPage from "@/components/CatalogPage";
import { getCatalogoPeliculas } from "@/lib/catalogo";

export const revalidate = 0;

export default async function PeliculasPage() {
  const PELICULAS = await getCatalogoPeliculas();

  return (
    <AdminShell>
      <CatalogPage type="PELÍCULA" items={PELICULAS} />
    </AdminShell>
  );
}
