"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Tv2, Film, Clapperboard, Settings,
  ChevronLeft, ChevronRight, LogOut, Shield,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard, color: "#bf5fff" },
  { href: "/anime",         label: "Anime",         icon: Tv2,             color: "#00f5ff" },
  { href: "/series",        label: "Series",        icon: Film,            color: "#ff2d78" },
  { href: "/peliculas",     label: "Películas",     icon: Clapperboard,    color: "#ffe600" },
  { href: "/usuarios",      label: "Usuarios",      icon: Shield,          color: "#39ff14" },
  { href: "/configuracion", label: "Configuración", icon: Settings,        color: "#39ff14" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? "var(--sb-w-col)" : "var(--sb-w)" }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: "fixed",
        left: "var(--sb-gap)",
        top: "var(--sb-top)",
        bottom: "var(--sb-top)",
        zIndex: 50,
        borderRadius: "var(--sb-radius)",
        /* Glassmorphism 3D */
        background: "linear-gradient(160deg, rgba(30,20,60,0.82) 0%, rgba(10,8,28,0.78) 100%)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        boxShadow: "var(--shadow-sidebar)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderTopColor: "rgba(255,255,255,0.18)",
        borderLeftColor: "rgba(255,255,255,0.14)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top highlight line ── */}
      <div style={{
        position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(191,95,255,0.6), transparent)",
        pointerEvents: "none",
      }} />

      {/* ── Logo — aumentado 2.5x ── */}
      <div
        className="flex items-center justify-center px-4 flex-shrink-0"
        style={{
          height: 180,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(191,95,255,0.04)",
        }}
      >
        <motion.div
          animate={{ width: collapsed ? 90 : 160, height: collapsed ? 90 : 160 }}
          transition={{ duration: 0.3 }}
          className="relative flex-shrink-0"
        >
          <Image src="/vortex logo.png" alt="Vortex" fill sizes={collapsed ? "90px" : "160px"} style={{ objectFit: "contain" }} />
        </motion.div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
        {NAV.map(({ href, label, icon: Icon, color }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} className="block px-3 mb-1">
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="relative flex items-center gap-3 rounded-xl px-3"
                style={{
                  height: 44,
                  background: active
                    ? `linear-gradient(135deg, ${color}1a 0%, ${color}0a 100%)`
                    : "transparent",
                  border: active ? `1px solid ${color}30` : "1px solid transparent",
                  boxShadow: active ? `0 2px 12px ${color}12, 0 1px 0 ${color}15 inset` : "none",
                }}
              >
                {active && (
                  <motion.div
                    layoutId="active-bar"
                    className="absolute left-0 top-2 bottom-2 rounded-full"
                    style={{
                      width: 3,
                      background: `linear-gradient(to bottom, ${color}, ${color}88)`,
                      boxShadow: `0 0 10px ${color}, 0 0 20px ${color}60`,
                    }}
                  />
                )}

                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    width: 30, height: 30,
                    background: active ? `${color}18` : "rgba(255,255,255,0.04)",
                    color: active ? color : "var(--text-muted)",
                    border: active ? `1px solid ${color}30` : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: active ? `0 0 12px ${color}20` : "none",
                  }}
                >
                  <Icon size={16} />
                </div>

                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.18 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      style={{ color: active ? color : "var(--text-secondary)" }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 16px" }} />

      {/* ── User row ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, rgba(191,95,255,0.25), rgba(191,95,255,0.1))",
            border: "1px solid rgba(191,95,255,0.4)",
            borderTopColor: "rgba(191,95,255,0.6)",
            color: "var(--neon-violet)",
            boxShadow: "0 2px 8px rgba(191,95,255,0.2)",
          }}
        >
          <Shield size={14} />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-w-0"
            >
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>Administrador</p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>vrabanales@rcapcorp.cl</p>
            </motion.div>
          )}
        </AnimatePresence>
        {!collapsed && (
          <button className="flex-shrink-0 transition-colors hover:text-white" style={{ color: "var(--text-muted)" }} title="Cerrar sesión">
            <LogOut size={14} />
          </button>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center py-2.5 transition-all"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "var(--text-muted)",
          background: "rgba(255,255,255,0.02)",
        }}
        title={collapsed ? "Expandir" : "Colapsar"}
      >
        <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronRight size={15} />
        </motion.div>
      </button>

      {/* ── Bottom glow ── */}
      <div style={{
        position: "absolute", bottom: 0, left: "15%", right: "15%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)",
        pointerEvents: "none",
      }} />
    </motion.aside>
  );
}
