import AdminShell from "@/components/AdminShell";
import UsuariosClient from "@/components/UsuariosClient";
import { obtenerTodosLosUsuarios } from "@/lib/usuarios";

export const metadata = { title: "Usuarios — Vortex Admin" };
export const revalidate = 0;

export default async function UsuariosPage() {
  const usuarios = await obtenerTodosLosUsuarios();

  return (
    <AdminShell>
      <UsuariosClient usuarios={usuarios} />
    </AdminShell>
  );
}
