import { redirect } from "next/navigation";
import { getSesionAdmin } from "@/lib/auth-admin";
import { obtenerTodosLosUsuariosAdmin } from "@/app/admin-actions";
import UsuariosAdminClient from "@/components/UsuariosAdminClient";
import { Settings, Users } from "lucide-react";

export const metadata = { title: "Configuración — Vortex Admin" };
export const revalidate = 0;

export default async function ConfiguracionPage() {
  const sesion = await getSesionAdmin();
  if (!sesion) redirect("/login");

  const usuarios = await obtenerTodosLosUsuariosAdmin();

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: "rgba(191,95,255,0.15)",
            border: "1px solid rgba(191,95,255,0.35)",
            color: "var(--neon-violet)",
          }}>
          <Settings size={20} />
        </div>
        <div>
          <h1 className="page-title">Configuración</h1>
          <p className="page-subtitle">Gestiona usuarios y permisos de la aplicación</p>
        </div>
      </div>

      {/* Tabs/Sections */}
      <div className="space-y-8">
        {/* Sección de usuarios */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                background: "rgba(0,245,255,0.15)",
                border: "1px solid rgba(0,245,255,0.35)",
                color: "var(--neon-cyan)",
              }}>
              <Users size={16} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              Usuarios del Sistema
            </h2>
          </div>

          <UsuariosAdminClient usuariosIniciales={usuarios} rolActual={sesion.rol} />
        </div>

        {/* Información de roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              rol: "Admin",
              color: "#bf5fff",
              permisos: ["Ver todo", "Crear/editar/borrar contenido", "Gestionar usuarios", "Cambiar roles"],
            },
            {
              rol: "Creador",
              color: "#00f5ff",
              permisos: ["Crear contenido", "Editar contenido", "Ver configuración", "❌ No puede borrar"],
            },
            {
              rol: "Marketing",
              color: "#39ff14",
              permisos: ["Ver dashboard", "Ver configuración", "Análisis de contenido", "❌ No crear/editar"],
            },
          ].map(rol => (
            <div
              key={rol.rol}
              className="glass-card p-4 rounded-lg"
              style={{ background: `rgba(191,95,255,0.04)`, border: `1px solid rgba(191,95,255,0.2)` }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: rol.color }}>
                {rol.rol}
              </h3>
              <ul className="space-y-2">
                {rol.permisos.map(permiso => (
                  <li key={permiso} className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {permiso}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
