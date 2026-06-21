import { redirect } from "next/navigation";
import { getSesionAdmin } from "@/lib/auth-admin";
import { obtenerTodosLosUsuariosAdmin } from "@/app/admin-actions";
import ConfiguracionClientPage from "@/components/ConfiguracionClientPage";

export const metadata = { title: "Configuración — Vortex Admin" };
export const revalidate = 0;

export default async function ConfiguracionPage() {
  const sesion = await getSesionAdmin();
  if (!sesion) redirect("/login");

  const usuarios = await obtenerTodosLosUsuariosAdmin();

  return <ConfiguracionClientPage usuarios={usuarios} rolActual={sesion.rol} />;
}
