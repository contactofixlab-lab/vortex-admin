"use client";

import { useState, useEffect } from "react";
import {
  Save, RefreshCw, Cloud, HardDrive, Database, Palette,
  Shield, Search, Tag, X, Plus, CheckCircle, Wifi, WifiOff,
  Globe, Bell, Clock, Eye, EyeOff,
} from "lucide-react";

type ServerStatus = "idle" | "testing" | "ok" | "error";

const STORAGE_KEY = "vortex_admin_config";

const DEFAULT_GENRES = [
  "Acción", "Aventura", "Comedia", "Drama", "Fantasía",
  "Horror", "Misterio", "Romance", "Sci-Fi", "Thriller",
  "Historia", "Crimen", "Animación", "Deportes", "Slice of Life",
];

const ACCENT_COLORS = [
  { name: "Cyan",   value: "#00f5ff" },
  { name: "Violet", value: "#bf5fff" },
  { name: "Pink",   value: "#ff2d78" },
  { name: "Green",  value: "#39ff14" },
  { name: "Yellow", value: "#ffe600" },
  { name: "Orange", value: "#ff7700" },
];

function Section({ title, icon: Icon, color = "var(--neon-violet)", children }: {
  title: string; icon: React.ElementType; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Icon size={15} style={{ color }} />
        <p className="text-sm font-bold" style={{ color }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{label}</label>
      {children}
      {hint && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>}
    </div>
  );
}

export default function ConfigClient() {
  const [siteName, setSiteName] = useState("Vortex");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.siteName) setSiteName(d.siteName);
      }
    } catch { }
  }, []);

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ siteName }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <Section title="General" icon={Globe}>
        <Field label="Nombre del sitio">
          <input className="admin-input" value={siteName} onChange={e => setSiteName(e.target.value)} />
        </Field>
      </Section>

      <div
        className="sticky bottom-0 flex items-center gap-3 p-4 rounded-2xl z-10"
        style={{
          background: "linear-gradient(135deg, rgba(10,7,28,0.97), rgba(6,4,18,0.95))",
          border: "1px solid rgba(191,95,255,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        <button className="btn-primary" onClick={handleSave}>
          <Save size={15} />
          Guardar cambios
        </button>
        {saved && (
          <span className="flex items-center gap-2 text-xs ml-auto" style={{ color: "var(--neon-green)" }}>
            <CheckCircle size={14} /> Configuración guardada
          </span>
        )}
      </div>
    </div>
  );
}
