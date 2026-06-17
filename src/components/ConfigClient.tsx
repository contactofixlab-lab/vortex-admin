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

/* ── helpers internos ─────────────────────────────── */
function Section({ title, icon: Icon, color = "var(--neon-violet)", children }: {
  title: string; icon: React.ElementType; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Icon size={15} style={{ color }} />
        <p className="text-sm font-bold" style={{ color, fontFamily: "var(--font-orbitron)", letterSpacing: "0.05em" }}>
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

function Toggle({ value, onChange, label, hint }: { value: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
        {hint && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="flex-shrink-0 relative w-11 h-6 rounded-full transition-all duration-300 mt-0.5"
        style={{
          background: value ? "rgba(191,95,255,0.4)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${value ? "rgba(191,95,255,0.6)" : "rgba(255,255,255,0.09)"}`,
          boxShadow: value ? "0 0 14px rgba(191,95,255,0.3)" : "none",
        }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
          style={{ left: value ? "calc(100% - 22px)" : "2px", background: value ? "var(--neon-violet)" : "var(--text-muted)" }}
        />
      </button>
    </div>
  );
}

function NumberInput({ value, onChange, min, max, suffix }: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="admin-input" style={{ width: 90 }}
      />
      {suffix && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{suffix}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════ */
export default function ConfigClient() {
  /* ── General ── */
  const [siteName,   setSiteName]   = useState("Vortex");
  const [siteUrl,    setSiteUrl]    = useState("https://vortex.cl");
  const [siteDesc,   setSiteDesc]   = useState("Tu portal de descargas de series, películas y anime en español.");
  const [adminEmail, setAdminEmail] = useState("vrabanales@rcapcorp.cl");

  /* ── Apariencia ── */
  const [accentColor,  setAccentColor]  = useState("#bf5fff");
  const [showLogo,     setShowLogo]     = useState(true);
  const [compactMode,  setCompactMode]  = useState(false);
  const [animBg,       setAnimBg]       = useState(true);

  /* ── Acceso ── */
  const [regOpen,    setRegOpen]    = useState(true);
  const [maintenance, setMaint]     = useState(false);
  const [maintMsg,   setMaintMsg]   = useState("El sitio está en mantenimiento. Volvemos pronto.");
  const [guestDL,    setGuestDL]    = useState(true);
  const [sessionH,   setSessionH]   = useState(24);
  const [maxLogin,   setMaxLogin]   = useState(5);
  const [showPwd,    setShowPwd]    = useState(false);
  const [adminPwd,   setAdminPwd]   = useState("••••••••••");

  /* ── SEO ── */
  const [seoTitle, setSeoTitle] = useState("Vortex — Descargas de anime, series y películas");
  const [seoDesc,  setSeoDesc]  = useState("Descarga tus series favoritas, las mejores películas y anime en español con servidores rápidos.");
  const [seoKw,    setSeoKw]    = useState("anime, series, películas, descargas, español");

  /* ── Géneros ── */
  const [genres,   setGenres]   = useState<string[]>(DEFAULT_GENRES);
  const [newGenre, setNewGenre] = useState("");

  /* ── Notificaciones ── */
  const [emailNotif,      setEmailNotif]      = useState(true);
  const [newContentNotif, setNewContentNotif] = useState(false);
  const [userRegNotif,    setUserRegNotif]     = useState(true);
  const [webhookUrl,      setWebhookUrl]       = useState("");

  /* ── Servidores ── */
  const [servers, setServers] = useState({
    onedrive: { url: "", enabled: true,  status: "idle" as ServerStatus },
    gdrive:   { url: "", enabled: true,  status: "idle" as ServerStatus },
    mega:     { url: "", enabled: false, status: "idle" as ServerStatus },
  });

  /* ── Caché ── */
  const [ttlCatalog, setTtlCatalog]   = useState(60);
  const [ttlDetail,  setTtlDetail]    = useState(120);
  const [ttlSearch,  setTtlSearch]    = useState(10);
  const [pageSize,   setPageSize]     = useState(24);

  /* ── UI ── */
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  /* ── Load from localStorage on mount ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.siteName)    setSiteName(d.siteName);
      if (d.siteUrl)     setSiteUrl(d.siteUrl);
      if (d.siteDesc)    setSiteDesc(d.siteDesc);
      if (d.adminEmail)  setAdminEmail(d.adminEmail);
      if (d.accentColor) setAccentColor(d.accentColor);
      if (d.showLogo     !== undefined) setShowLogo(d.showLogo);
      if (d.compactMode  !== undefined) setCompactMode(d.compactMode);
      if (d.animBg       !== undefined) setAnimBg(d.animBg);
      if (d.regOpen      !== undefined) setRegOpen(d.regOpen);
      if (d.maintenance  !== undefined) setMaint(d.maintenance);
      if (d.maintMsg)    setMaintMsg(d.maintMsg);
      if (d.guestDL      !== undefined) setGuestDL(d.guestDL);
      if (d.sessionH)    setSessionH(d.sessionH);
      if (d.maxLogin)    setMaxLogin(d.maxLogin);
      if (d.seoTitle)    setSeoTitle(d.seoTitle);
      if (d.seoDesc)     setSeoDesc(d.seoDesc);
      if (d.seoKw)       setSeoKw(d.seoKw);
      if (d.genres?.length) setGenres(d.genres);
      if (d.emailNotif      !== undefined) setEmailNotif(d.emailNotif);
      if (d.newContentNotif !== undefined) setNewContentNotif(d.newContentNotif);
      if (d.userRegNotif    !== undefined) setUserRegNotif(d.userRegNotif);
      if (d.webhookUrl)  setWebhookUrl(d.webhookUrl);
      if (d.serverOnedrive) setServers(s => ({ ...s, onedrive: { ...s.onedrive, url: d.serverOnedrive.url ?? "", enabled: d.serverOnedrive.enabled ?? true, status: "idle" } }));
      if (d.serverGdrive)   setServers(s => ({ ...s, gdrive:   { ...s.gdrive,   url: d.serverGdrive.url   ?? "", enabled: d.serverGdrive.enabled   ?? true, status: "idle" } }));
      if (d.serverMega)     setServers(s => ({ ...s, mega:     { ...s.mega,     url: d.serverMega.url     ?? "", enabled: d.serverMega.enabled     ?? false, status: "idle" } }));
      if (d.ttlCatalog)  setTtlCatalog(d.ttlCatalog);
      if (d.ttlDetail)   setTtlDetail(d.ttlDetail);
      if (d.ttlSearch)   setTtlSearch(d.ttlSearch);
      if (d.pageSize)    setPageSize(d.pageSize);
    } catch { /* ignore */ }
  }, []);

  function handleSave() {
    setSaving(true);
    const data = {
      siteName, siteUrl, siteDesc, adminEmail,
      accentColor, showLogo, compactMode, animBg,
      regOpen, maintenance, maintMsg, guestDL, sessionH, maxLogin,
      seoTitle, seoDesc, seoKw,
      genres,
      emailNotif, newContentNotif, userRegNotif, webhookUrl,
      serverOnedrive: { url: servers.onedrive.url, enabled: servers.onedrive.enabled },
      serverGdrive:   { url: servers.gdrive.url,   enabled: servers.gdrive.enabled },
      serverMega:     { url: servers.mega.url,      enabled: servers.mega.enabled },
      ttlCatalog, ttlDetail, ttlSearch, pageSize,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 800);
  }

  function handleDiscard() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  function testServer(key: keyof typeof servers) {
    setServers(s => ({ ...s, [key]: { ...s[key], status: "testing" } }));
    setTimeout(() => {
      setServers(s => ({ ...s, [key]: { ...s[key], status: s[key].url ? "ok" : "error" } }));
    }, 1500);
  }

  function addGenre() {
    const g = newGenre.trim();
    if (g && !genres.includes(g)) { setGenres([...genres, g]); setNewGenre(""); }
  }

  const serverConfig = [
    { key: "onedrive" as const, name: "OneDrive",     color: "#00a4ef", icon: Cloud      },
    { key: "gdrive"   as const, name: "Google Drive",  color: "#39ff14", icon: HardDrive },
    { key: "mega"     as const, name: "Mega.nz",        color: "#ff2d78", icon: Database  },
  ];

  return (
    <div className="flex flex-col gap-5 max-w-3xl">

      {/* 1. GENERAL */}
      <Section title="General" icon={Globe}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre del sitio">
            <input className="admin-input" value={siteName} onChange={e => setSiteName(e.target.value)} />
          </Field>
          <Field label="URL del sitio">
            <input className="admin-input" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} />
          </Field>
        </div>
        <Field label="Descripción corta" hint="Aparece en el footer y en redes sociales.">
          <textarea className="admin-input resize-none" rows={2} value={siteDesc}
            onChange={e => setSiteDesc(e.target.value)} style={{ lineHeight: 1.5 }} />
        </Field>
        <Field label="Email del administrador" hint="Recibe alertas y reportes del sistema.">
          <input className="admin-input" type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
        </Field>
      </Section>

      {/* 2. APARIENCIA */}
      <Section title="Apariencia" icon={Palette} color="var(--neon-cyan)">
        <Field label="Color de acento principal">
          <div className="flex flex-wrap gap-2 mt-1">
            {ACCENT_COLORS.map(({ name, value }) => (
              <button
                key={value}
                onClick={() => setAccentColor(value)}
                title={name}
                className="w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center"
                style={{
                  background: value,
                  border: accentColor === value ? "2px solid white" : "2px solid transparent",
                  boxShadow: accentColor === value ? `0 0 14px ${value}` : "none",
                  transform: accentColor === value ? "scale(1.18)" : "scale(1)",
                }}
              >
                {accentColor === value && <span className="w-2 h-2 rounded-full bg-white/70 block" />}
              </button>
            ))}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Seleccionado: <span style={{ color: accentColor }}>{ACCENT_COLORS.find(c => c.value === accentColor)?.name ?? "Custom"}</span>
          </p>
        </Field>
        <div className="flex flex-col gap-3">
          <Toggle value={showLogo}    onChange={setShowLogo}    label="Mostrar logo en el navbar" />
          <Toggle value={animBg}      onChange={setAnimBg}      label="Fondo animado (efectos ki, Rasengan)"
            hint="Canvas con efectos anime en el fondo del sitio." />
          <Toggle value={compactMode} onChange={setCompactMode} label="Modo compacto en catálogo"
            hint="Más tarjetas, menos detalle visual por tarjeta." />
        </div>
      </Section>

      {/* 3. ACCESO Y SEGURIDAD */}
      <Section title="Acceso y seguridad" icon={Shield} color="var(--neon-pink)">
        <div className="flex flex-col gap-3">
          <Toggle value={regOpen}      onChange={setRegOpen}      label="Registro de usuarios abierto"
            hint="Desactivado = solo por invitación." />
          <Toggle value={guestDL}      onChange={setGuestDL}      label="Descargas sin login"
            hint="Usuarios sin cuenta pueden descargar contenido público." />
          <Toggle value={maintenance}  onChange={setMaint}        label="Modo mantenimiento"
            hint="Todos los visitantes ven la pantalla de mantenimiento." />
        </div>
        {maintenance && (
          <Field label="Mensaje de mantenimiento">
            <textarea className="admin-input resize-none" rows={2} value={maintMsg}
              onChange={e => setMaintMsg(e.target.value)} style={{ lineHeight: 1.5 }} />
          </Field>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Field label="Duración de sesión" hint="Tiempo antes de cerrar sesión automáticamente.">
            <NumberInput value={sessionH} onChange={setSessionH} min={1} max={720} suffix="horas" />
          </Field>
          <Field label="Intentos de login" hint="Bloquea tras este número de fallos consecutivos.">
            <NumberInput value={maxLogin} onChange={setMaxLogin} min={1} max={20} suffix="intentos" />
          </Field>
        </div>
        <Field label="Contraseña de administrador">
          <div className="relative">
            <input
              className="admin-input pr-10"
              type={showPwd ? "text" : "password"}
              value={adminPwd}
              onChange={e => setAdminPwd(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
      </Section>

      {/* 4. SEO */}
      <Section title="SEO y metadatos" icon={Search} color="var(--neon-yellow)">
        <Field label="Título SEO" hint="Aparece en la pestaña del navegador y en Google.">
          <input className="admin-input" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
          <div className="flex justify-end">
            <span className="text-xs" style={{ color: seoTitle.length > 60 ? "var(--neon-pink)" : "var(--text-muted)" }}>
              {seoTitle.length}/60
            </span>
          </div>
        </Field>
        <Field label="Descripción SEO" hint="Snippet en los resultados de búsqueda.">
          <textarea className="admin-input resize-none" rows={2} value={seoDesc}
            onChange={e => setSeoDesc(e.target.value)} style={{ lineHeight: 1.5 }} />
          <div className="flex justify-end">
            <span className="text-xs" style={{ color: seoDesc.length > 160 ? "var(--neon-pink)" : "var(--text-muted)" }}>
              {seoDesc.length}/160
            </span>
          </div>
        </Field>
        <Field label="Palabras clave" hint="Separadas por coma.">
          <input className="admin-input" value={seoKw} onChange={e => setSeoKw(e.target.value)} />
        </Field>
      </Section>

      {/* 5. GÉNEROS */}
      <Section title="Géneros y categorías" icon={Tag} color="var(--neon-green)">
        <div className="flex flex-wrap gap-2">
          {genres.map(g => (
            <span key={g} className="badge badge-violet flex items-center gap-1.5">
              {g}
              <button onClick={() => setGenres(genres.filter(x => x !== g))}
                className="hover:text-white transition-colors" style={{ color: "rgba(191,95,255,0.5)" }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="admin-input flex-1"
            placeholder="Nuevo género..."
            value={newGenre}
            onChange={e => setNewGenre(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addGenre()}
          />
          <button className="btn-primary flex-shrink-0" onClick={addGenre}>
            <Plus size={14} /> Agregar
          </button>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {genres.length} géneros · Enter o botón para agregar
        </p>
      </Section>

      {/* 6. NOTIFICACIONES */}
      <Section title="Notificaciones" icon={Bell} color="#ff9500">
        <div className="flex flex-col gap-3">
          <Toggle value={emailNotif}      onChange={setEmailNotif}      label="Notificaciones por email" />
          <Toggle value={newContentNotif} onChange={setNewContentNotif} label="Alerta al publicar nuevo contenido"
            hint="Notifica al admin cuando se sube un título nuevo." />
          <Toggle value={userRegNotif}    onChange={setUserRegNotif}    label="Alerta de nuevos usuarios"
            hint="Email cuando un usuario se registra." />
        </div>
        <Field label="Webhook (Slack / Discord / Telegram)" hint="URL del endpoint para recibir eventos.">
          <input className="admin-input" placeholder="https://hooks.slack.com/..."
            value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} />
        </Field>
      </Section>

      {/* 7. SERVIDORES DE DESCARGA */}
      <Section title="Servidores de descarga" icon={Cloud} color="var(--neon-cyan)">
        {serverConfig.map(({ key, name, color, icon: Icon }) => {
          const s = servers[key];
          return (
            <div key={key} className="flex flex-col gap-3 p-4 rounded-xl"
              style={{ background: `${color}0a`, border: `1px solid ${color}22` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 34, height: 34, background: `${color}18`, color, border: `1px solid ${color}30` }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {s.status === "ok" ? "Conexión exitosa" : s.status === "error" ? "Sin conexión" : "Sin configurar"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    background: s.status === "ok" ? "var(--neon-green)" : s.status === "error" ? "var(--neon-pink)" : "var(--text-muted)",
                    boxShadow: s.status === "ok" ? "0 0 6px var(--neon-green)" : s.status === "error" ? "0 0 6px var(--neon-pink)" : "none",
                  }} />
                  <button
                    onClick={() => setServers(sv => ({ ...sv, [key]: { ...sv[key], enabled: !sv[key].enabled } }))}
                    className="relative w-9 h-5 rounded-full transition-all duration-300 flex-shrink-0"
                    style={{
                      background: s.enabled ? `${color}50` : "rgba(255,255,255,0.08)",
                      border: `1px solid ${s.enabled ? color : "rgba(255,255,255,0.09)"}40`,
                    }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                      style={{ left: s.enabled ? "calc(100% - 18px)" : "2px", background: s.enabled ? color : "var(--text-muted)" }} />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  className="admin-input flex-1 text-xs"
                  placeholder={`Folder ID o URL de ${name}...`}
                  value={s.url}
                  onChange={e => setServers(sv => ({ ...sv, [key]: { ...sv[key], url: e.target.value, status: "idle" } }))}
                  disabled={!s.enabled}
                  style={{ opacity: s.enabled ? 1 : 0.45, height: 34, padding: "6px 12px" }}
                />
                <button
                  className="btn-ghost flex-shrink-0 text-xs"
                  disabled={!s.enabled || s.status === "testing"}
                  onClick={() => testServer(key)}
                  style={{ height: 34, padding: "6px 12px", opacity: s.enabled ? 1 : 0.45 }}
                >
                  {s.status === "testing" ? <RefreshCw size={13} className="animate-spin" /> :
                   s.status === "ok"      ? <CheckCircle size={13} style={{ color: "var(--neon-green)" }} /> :
                   s.status === "error"   ? <WifiOff size={13} style={{ color: "var(--neon-pink)" }} /> :
                   <Wifi size={13} />}
                  {s.status === "testing" ? "Probando…" :
                   s.status === "ok"      ? "Conectado" :
                   s.status === "error"   ? "Sin conexión" : "Probar"}
                </button>
              </div>
            </div>
          );
        })}
      </Section>

      {/* 8. CACHÉ Y RENDIMIENTO */}
      <Section title="Caché y rendimiento" icon={Clock} color="var(--neon-violet)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="TTL del catálogo" hint="Tiempo que se cachea la lista de títulos.">
            <NumberInput value={ttlCatalog} onChange={setTtlCatalog} min={0} max={3600} suffix="minutos" />
          </Field>
          <Field label="TTL de páginas de detalle" hint="Caché de fichas individuales.">
            <NumberInput value={ttlDetail} onChange={setTtlDetail} min={0} max={3600} suffix="minutos" />
          </Field>
          <Field label="TTL de búsqueda" hint="Caché de resultados de búsqueda.">
            <NumberInput value={ttlSearch} onChange={setTtlSearch} min={0} max={60} suffix="minutos" />
          </Field>
          <Field label="Ítems por página" hint="Afecta paginación y velocidad de carga.">
            <NumberInput value={pageSize} onChange={setPageSize} min={6} max={96} suffix="tarjetas" />
          </Field>
        </div>
      </Section>

      {/* ── Barra de guardado (sticky) ── */}
      <div
        className="sticky bottom-0 flex items-center gap-3 p-4 rounded-2xl z-10"
        style={{
          background: "linear-gradient(135deg, rgba(10,7,28,0.97), rgba(6,4,18,0.95))",
          border: "1px solid rgba(191,95,255,0.3)",
          borderTopColor: "rgba(191,95,255,0.5)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.5), 0 0 40px rgba(191,95,255,0.06)",
        }}
      >
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        <button className="btn-ghost" onClick={handleDiscard}>Descartar</button>
        {saved && (
          <span className="flex items-center gap-2 text-xs ml-auto" style={{ color: "var(--neon-green)" }}>
            <CheckCircle size={14} /> Configuración guardada
          </span>
        )}
      </div>
    </div>
  );
}
