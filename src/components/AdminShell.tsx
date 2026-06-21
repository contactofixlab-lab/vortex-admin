"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, LogOut, Settings } from "lucide-react";
import { cerrarSesionAdmin } from "@/app/admin-actions";
import Sidebar from "./Sidebar";

const TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard":       { title: "Dashboard",      sub: "Resumen general del sitio" },
  "/anime":           { title: "Anime",           sub: "Gestión del catálogo de anime" },
  "/anime/nuevo":     { title: "Nuevo Anime",     sub: "Agregar título al catálogo" },
  "/series":          { title: "Series",          sub: "Gestión del catálogo de series" },
  "/series/nuevo":    { title: "Nueva Serie",     sub: "Agregar título al catálogo" },
  "/peliculas":       { title: "Películas",       sub: "Gestión del catálogo de películas" },
  "/peliculas/nuevo": { title: "Nueva Película",  sub: "Agregar título al catálogo" },
  "/usuarios":        { title: "Usuarios",        sub: "Registro de usuarios registrados" },
  "/configuracion":   { title: "Configuración",   sub: "Ajustes generales del sistema" },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const meta = TITLES[pathname] ?? { title: "Vortex Admin", sub: "" };

  async function handleLogout() {
    await cerrarSesionAdmin();
    router.push("/login");
    router.refresh();
  }

  const sidebarW = collapsed ? "var(--sb-w-col)" : "var(--sb-w)";
  const paddingLeft = `calc(${sidebarW} + var(--sb-gap) * 2)`;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      {/* ── Main area — empuja cuando el sidebar se expande/colapsa ── */}
      <div
        style={{
          paddingLeft,
          paddingRight: "var(--sb-gap)",
          transition: "padding-left 0.3s cubic-bezier(0.4,0,0.2,1)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header flotante (sticky) ── */}
        <header
          className="flex items-center justify-between gap-4 flex-shrink-0"
          style={{
            position: "sticky",
            top: "var(--sb-top)",
            zIndex: 40,
            height: 56,
            borderRadius: 16,
            marginTop: "var(--sb-top)",
            marginBottom: 20,
            paddingLeft: 20,
            paddingRight: 16,
            background: "linear-gradient(135deg, rgba(20,15,45,0.85) 0%, rgba(8,6,20,0.80) 100%)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderTopColor: "rgba(255,255,255,0.16)",
            boxShadow: "var(--shadow-glass)",
          }}
        >
          {/* Top highlight */}
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            borderRadius: 1, pointerEvents: "none",
          }} />

          <div>
            <h1
              className="text-sm font-bold leading-tight"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)", letterSpacing: "0.04em" }}
            >
              {meta.title}
            </h1>
            {meta.sub && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{meta.sub}</p>}
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3) inset",
              }}
            >
              <Search size={13} style={{ color: "var(--text-muted)" }} />
              <input
                placeholder="Buscar..."
                className="bg-transparent outline-none text-xs w-36"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            {/* Notifications */}
            <button
              className="relative flex items-center justify-center rounded-xl transition-all hover:scale-105"
              style={{
                width: 34, height: 34,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "var(--text-secondary)",
                boxShadow: "var(--shadow-glass)",
              }}
            >
              <Bell size={15} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "var(--neon-violet)", boxShadow: "0 0 6px var(--neon-violet)" }}
              />
            </button>

            {/* Avatar con dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center rounded-xl text-xs font-black transition-all hover:scale-105"
                style={{
                  width: 34, height: 34,
                  background: "linear-gradient(135deg, rgba(191,95,255,0.2), rgba(191,95,255,0.08))",
                  border: "1px solid rgba(191,95,255,0.4)",
                  borderTopColor: "rgba(191,95,255,0.6)",
                  color: "var(--neon-violet)",
                  fontFamily: "var(--font-orbitron)",
                  boxShadow: "0 2px 8px rgba(191,95,255,0.15)",
                  cursor: "pointer",
                }}
              >
                VA
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg z-50"
                  style={{
                    background: "linear-gradient(135deg, rgba(20,15,45,0.95), rgba(8,6,20,0.90))",
                    border: "1px solid rgba(191,95,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <button
                    onClick={() => router.push("/configuracion")}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/5 transition-colors border-b"
                    style={{ borderColor: "rgba(191,95,255,0.2)", color: "var(--text-primary)" }}
                  >
                    <Settings size={14} style={{ color: "var(--neon-cyan)" }} />
                    Configuración
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                    style={{ color: "var(--neon-pink)" }}
                  >
                    <LogOut size={14} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main style={{ flex: 1, paddingBottom: 32 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
