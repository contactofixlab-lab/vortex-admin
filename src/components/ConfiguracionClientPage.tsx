"use client";

import { useState } from "react";
import UsuariosAdminClient from "@/components/UsuariosAdminClient";
import ConfigClient from "@/components/ConfigClient";
import { Settings, Users, Sliders } from "lucide-react";

interface ConfiguracionClientPageProps {
  usuarios: any[];
  rolActual: string;
}

export default function ConfiguracionClientPage({ usuarios, rolActual }: ConfiguracionClientPageProps) {
  const [tab, setTab] = useState<"pagina" | "usuarios">("pagina");

  const tabs = [
    { id: "pagina" as const, label: "Configuración de Página", icon: Sliders },
    { id: "usuarios" as const, label: "Usuarios del Sistema", icon: Users },
  ];

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
          <p className="page-subtitle">Gestiona la página y los permisos de usuarios</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all"
            style={{
              color: tab === id ? "var(--neon-cyan)" : "var(--text-secondary)",
              borderBottom: tab === id ? "2px solid var(--neon-cyan)" : "none",
              cursor: "pointer",
            }}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div>
        {tab === "pagina" && <ConfigClient />}
        {tab === "usuarios" && <UsuariosAdminClient usuariosIniciales={usuarios} rolActual={rolActual} />}
      </div>
    </div>
  );
}
