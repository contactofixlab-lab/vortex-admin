"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save, Send, ArrowLeft, Plus, X, Upload, Link2,
  Tv2, Film, Clapperboard, RefreshCw, CheckCircle,
  Trash2, ChevronDown, ChevronUp, GripVertical,
  Cloud, HardDrive, Database, Globe, Clock, Star,
  Tag, Info, List, Radio,
} from "lucide-react";
import { crearContenido } from "@/app/actions";
import Select from "./Select";

/* ═══════════════════════════ TIPOS ═════════════════════════ */
export type ContentType = "ANIME" | "SERIE" | "PELÍCULA";

interface EpisodeRow {
  id: number;
  num: number;
  title: string;
  urls: { onedrive: string; gdrive: string; mega: string };
}

const GENRES = [
  "Acción","Aventura","Comedia","Drama","Fantasía","Horror",
  "Misterio","Romance","Sci-Fi","Thriller","Historia","Crimen",
  "Animación","Deportes","Slice of Life","Sobrenatural","Psicológico",
  "Mecha","Musical","Ecchi","Isekai","Shonen","Seinen","Shojo",
];
const RATINGS = ["G","PG","PG-13","R","NC-17","18+"];
const LANGS   = ["Sub", "Dub", "Sub/Dub", "Latino", "Castellano"];

const TYPE_META: Record<ContentType, {
  icon: React.ElementType;
  color: string;
  back: string;
  studioLabel: string;
  hasEpisodes: boolean;
}> = {
  ANIME:    { icon: Tv2,         color: "#00f5ff", back: "/anime",     studioLabel: "Estudio de animación", hasEpisodes: true  },
  SERIE:    { icon: Film,        color: "#ff2d78", back: "/series",    studioLabel: "Canal / Red",           hasEpisodes: true  },
  PELÍCULA: { icon: Clapperboard,color: "#ffe600", back: "/peliculas", studioLabel: "Director",              hasEpisodes: false },
};

/* ═══════════════════════════ HELPERS UI ════════════════════ */
function Section({ title, icon: Icon, color = "var(--neon-violet)", children, defaultOpen = true }: {
  title: string; icon: React.ElementType; color?: string;
  children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 transition-colors"
        style={{ borderBottom: open ? "1px solid rgba(255,255,255,0.07)" : "none" }}
      >
        <div className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 28, height: 28, background: `${color}18`, color, border: `1px solid ${color}30` }}>
          <Icon size={14} />
        </div>
        <span className="text-sm font-bold flex-1 text-left"
          style={{ color, fontFamily: "var(--font-orbitron)", letterSpacing: "0.04em" }}>
          {title}
        </span>
        {open ? <ChevronUp size={15} style={{ color: "var(--text-muted)" }} />
               : <ChevronDown size={15} style={{ color: "var(--text-muted)" }} />}
      </button>
      {open && <div className="px-5 py-4 flex flex-col gap-4">{children}</div>}
    </div>
  );
}

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
        {label}{required && <span style={{ color: "var(--neon-pink)" }}> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>}
    </div>
  );
}

function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-${cols}`}>
      {children}
    </div>
  );
}

/* ═══════════════════════════ SERVER BLOCK ══════════════════ */
function ServerBlock({ name, icon: Icon, color, enabled, onToggle, url, onUrl, placeholder }: {
  name: string; icon: React.ElementType; color: string;
  enabled: boolean; onToggle: () => void;
  url: string; onUrl: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl"
      style={{ background: `${color}08`, border: `1px solid ${color}${enabled ? "30" : "12"}` }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: 32, height: 32, background: `${color}18`, color, border: `1px solid ${color}28` }}>
            <Icon size={15} />
          </div>
          <span className="text-sm font-semibold" style={{ color: enabled ? "var(--text-primary)" : "var(--text-muted)" }}>
            {name}
          </span>
        </div>
        <button type="button" onClick={onToggle}
          className="relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0"
          style={{
            background: enabled ? `${color}55` : "rgba(255,255,255,0.08)",
            border: `1px solid ${enabled ? color : "rgba(255,255,255,0.09)"}40`,
          }}>
          <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
            style={{ left: enabled ? "calc(100% - 18px)" : "2px", background: enabled ? color : "var(--text-muted)" }} />
        </button>
      </div>
      {enabled && (
        <div className="flex items-center gap-2">
          <Link2 size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            className="admin-input text-xs"
            style={{ height: 32, padding: "5px 10px" }}
            placeholder={placeholder}
            value={url}
            onChange={e => onUrl(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ EPISODE ROW ════════════════════ */
function EpisodeItem({ ep, serverFlags, onChange, onRemove }: {
  ep: EpisodeRow;
  serverFlags: { onedrive: boolean; gdrive: boolean; mega: boolean };
  onChange: (ep: EpisodeRow) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <GripVertical size={14} style={{ color: "var(--text-muted)", flexShrink: 0, cursor: "grab" }} />
        <span className="text-xs font-bold tabular-nums"
          style={{ color: "var(--neon-violet)", minWidth: 28 }}>
          {String(ep.num).padStart(2, "0")}
        </span>
        <input
          className="bg-transparent outline-none text-sm flex-1 min-w-0"
          style={{ color: "var(--text-primary)" }}
          placeholder={`Título del episodio ${ep.num}`}
          value={ep.title}
          onChange={e => onChange({ ...ep, title: e.target.value })}
        />
        <button type="button" onClick={() => setOpen(o => !o)}
          className="text-xs px-2 py-1 rounded-lg transition-all"
          style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.04)" }}>
          URLs {open ? <ChevronUp size={11} className="inline" /> : <ChevronDown size={11} className="inline" />}
        </button>
        <button type="button" onClick={onRemove} className="flex-shrink-0 transition-colors hover:text-red-400"
          style={{ color: "var(--text-muted)" }}>
          <X size={14} />
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2 px-3 pb-3 pt-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {serverFlags.onedrive && (
            <div className="flex items-center gap-2">
              <Cloud size={12} style={{ color: "#00a4ef", flexShrink: 0 }} />
              <input className="admin-input text-xs" style={{ height: 30, padding: "4px 10px" }}
                placeholder="OneDrive URL del episodio..."
                value={ep.urls.onedrive}
                onChange={e => onChange({ ...ep, urls: { ...ep.urls, onedrive: e.target.value } })} />
            </div>
          )}
          {serverFlags.gdrive && (
            <div className="flex items-center gap-2">
              <HardDrive size={12} style={{ color: "#39ff14", flexShrink: 0 }} />
              <input className="admin-input text-xs" style={{ height: 30, padding: "4px 10px" }}
                placeholder="Google Drive URL del episodio..."
                value={ep.urls.gdrive}
                onChange={e => onChange({ ...ep, urls: { ...ep.urls, gdrive: e.target.value } })} />
            </div>
          )}
          {serverFlags.mega && (
            <div className="flex items-center gap-2">
              <Database size={12} style={{ color: "#ff2d78", flexShrink: 0 }} />
              <input className="admin-input text-xs" style={{ height: 30, padding: "4px 10px" }}
                placeholder="Mega URL del episodio..."
                value={ep.urls.mega}
                onChange={e => onChange({ ...ep, urls: { ...ep.urls, mega: e.target.value } })} />
            </div>
          )}
          {!serverFlags.onedrive && !serverFlags.gdrive && !serverFlags.mega && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Activa al menos un servidor en la sección Servidores de descarga.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ COMPONENTE PRINCIPAL ══════════ */
export default function ContentFormClient({ type }: { type: ContentType }) {
  const router = useRouter();
  const meta = TYPE_META[type];

  /* Información principal */
  const [title,    setTitle]    = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [status,   setStatus]   = useState<"draft"|"on"|"off">("draft");
  const [estadoEmision, setEstadoEmision] = useState<"en emisión"|"completo"|"próximamente">("en emisión");
  const [cover,    setCover]    = useState("");

  /* Detalles */
  const [year,       setYear]       = useState(new Date().getFullYear());
  const [season,     setSeason]     = useState(1);
  const [totalEps,   setTotalEps]   = useState<number | "">(12);
  const [duration,   setDuration]   = useState<number | "">("");
  const [studio,     setStudio]     = useState("");
  const [country,    setCountry]    = useState("");
  const [trailer,    setTrailer]    = useState("");

  /* Clasificación */
  const [genre,    setGenre]    = useState("");
  const [lang,     setLang]     = useState("Sub/Dub");
  const [rating,   setRating]   = useState("PG-13");
  const [tags,     setTags]     = useState<string[]>([]);
  const [newTag,   setNewTag]   = useState("");

  /* Fuentes externas */
  const [externalId, setExternalId] = useState("");
  const [tmdbId,     setTmdbId]     = useState("");

  /* Servidores */
  const [svOnedrive, setSvOnedrive] = useState({ enabled: true,  url: "" });
  const [svGdrive,   setSvGdrive]   = useState({ enabled: true,  url: "" });
  const [svMega,     setSvMega]     = useState({ enabled: false, url: "" });

  /* Episodios */
  const [episodes,  setEpisodes]  = useState<EpisodeRow[]>([]);
  const [bulkCount, setBulkCount] = useState(12);
  const nextId = useRef(1);

  /* UI */
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [errors,  setErrors]  = useState<string[]>([]);

  /* ── helpers ── */
  function addTag() {
    const t = newTag.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setNewTag(""); }
  }

  function addEpisode() {
    const num = episodes.length + 1;
    setEpisodes(eps => [...eps, { id: nextId.current++, num, title: "", urls: { onedrive:"", gdrive:"", mega:"" } }]);
  }

  function bulkAddEpisodes() {
    const start = episodes.length + 1;
    const batch: EpisodeRow[] = Array.from({ length: bulkCount }, (_, i) => ({
      id: nextId.current++,
      num: start + i,
      title: "",
      urls: { onedrive: "", gdrive: "", mega: "" },
    }));
    setEpisodes(eps => [...eps, ...batch]);
  }

  function updateEpisode(id: number, ep: EpisodeRow) {
    setEpisodes(eps => eps.map(e => e.id === id ? ep : e));
  }

  function removeEpisode(id: number) {
    setEpisodes(eps => {
      const filtered = eps.filter(e => e.id !== id);
      return filtered.map((e, i) => ({ ...e, num: i + 1 }));
    });
  }

  function validate() {
    const errs: string[] = [];
    if (!title.trim())  errs.push("El título es obligatorio.");
    if (!genre)         errs.push("Selecciona un género.");
    if (!svOnedrive.enabled && !svGdrive.enabled && !svMega.enabled)
      errs.push("Activa al menos un servidor de descarga.");
    return errs;
  }

  const TIPO_DB: Record<ContentType, "anime" | "serie" | "pelicula"> = {
    ANIME: "anime", SERIE: "serie", PELÍCULA: "pelicula",
  };

  async function handleSubmit(publish: boolean) {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    const finalStatus = publish ? "on" : status;
    setSaving(true);
    try {
      await crearContenido({
        tipo: TIPO_DB[type],
        titulo: title,
        sinopsis: synopsis,
        estadoPublicacion: finalStatus,
        estadoEmision: meta.hasEpisodes ? estadoEmision : null,
        portada: cover,
        anio: year,
        episodiosTotal: meta.hasEpisodes ? (totalEps === "" ? null : totalEps) : null,
        duracion: duration === "" ? null : duration,
        studio,
        pais: country,
        trailerUrl: trailer,
        genero: genre ? [genre] : [],
        idioma: lang,
        rating,
        tags,
        malId: type === "ANIME" ? externalId : "",
        tmdbId,
        servidores: { onedrive: svOnedrive, gdrive: svGdrive, mega: svMega },
        episodios: meta.hasEpisodes
          ? episodes.map(ep => ({ numero: ep.num, titulo: ep.title, temporada: season, urls: ep.urls }))
          : [],
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => router.push(meta.back), 1200);
    } catch {
      setSaving(false);
      setErrors(["No se pudo guardar el contenido. Intenta nuevamente."]);
    }
  }

  const serverFlags = { onedrive: svOnedrive.enabled, gdrive: svGdrive.enabled, mega: svMega.enabled };

  /* ── render ── */
  return (
    <div className="flex flex-col gap-5 max-w-3xl">

      {/* ─── Cabecera de página ─── */}
      <div className="flex items-center gap-4 mb-1">
        <button type="button" onClick={() => router.push(meta.back)}
          className="btn-ghost flex-shrink-0" style={{ padding: "7px 12px" }}>
          <ArrowLeft size={15} />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 40, height: 40,
              background: `${meta.color}18`,
              border: `1px solid ${meta.color}35`,
              color: meta.color,
            }}>
            <meta.icon size={20} />
          </div>
          <div>
            <h1 className="page-title">
              {type === "ANIME" ? "Nuevo Anime" : type === "SERIE" ? "Nueva Serie" : "Nueva Película"}
            </h1>
            <p className="page-subtitle">Completa los campos y publica en el catálogo</p>
          </div>
        </div>
      </div>

      {/* Errores de validación */}
      {errors.length > 0 && (
        <div className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: "rgba(255,45,120,0.08)", border: "1px solid rgba(255,45,120,0.3)" }}>
          {errors.map((e, i) => (
            <p key={i} className="text-xs flex items-center gap-2" style={{ color: "var(--neon-pink)" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--neon-pink)" }} />
              {e}
            </p>
          ))}
        </div>
      )}

      {/* ─── 1. INFORMACIÓN PRINCIPAL ─── */}
      <Section title="Información principal" icon={Info} color={meta.color}>
        {/* Portada */}
        <Field label="Portada" hint="URL de imagen JPG/PNG (proporción 2:3 recomendada, mínimo 300×450px)">
          <div className="flex gap-3">
            <div className="flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 80, height: 112,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="portada" className="w-full h-full object-cover" onError={() => setCover("")} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload size={20} style={{ color: "var(--text-muted)" }} />
                </div>
              )}
            </div>
            <input
              className="admin-input flex-1"
              placeholder="https://imagen.com/portada.jpg"
              value={cover}
              onChange={e => setCover(e.target.value)}
            />
          </div>
        </Field>

        {/* Título */}
        <Field label="Título" required>
          <input
            className="admin-input"
            placeholder={type === "ANIME" ? "Ej: Dragon Ball Super" : type === "SERIE" ? "Ej: Breaking Bad" : "Ej: Avengers: Endgame"}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </Field>

        {/* Sinopsis */}
        <Field label="Sinopsis" hint="Descripción que verán los usuarios en la ficha del título.">
          <textarea
            className="admin-input resize-none"
            rows={4}
            style={{ lineHeight: 1.6 }}
            placeholder="Escribe una sinopsis atractiva..."
            value={synopsis}
            onChange={e => setSynopsis(e.target.value)}
          />
          <div className="flex justify-end">
            <span className="text-xs" style={{ color: synopsis.length > 500 ? "var(--neon-pink)" : "var(--text-muted)" }}>
              {synopsis.length}/500
            </span>
          </div>
        </Field>

        {/* Estado */}
        <Field label="Estado inicial">
          <div className="flex flex-wrap gap-2">
            {([["draft","Borrador","#ffe600"], ["on","Publicado","#39ff14"], ["off","Oculto","#ff2d78"]] as const).map(([val, label, color]) => (
              <button
                key={val}
                type="button"
                onClick={() => setStatus(val)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: status === val ? `${color}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${status === val ? color : "rgba(255,255,255,0.09)"}`,
                  color: status === val ? color : "var(--text-muted)",
                  boxShadow: status === val ? `0 0 14px ${color}18` : "none",
                }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: status === val ? color : "var(--text-muted)" }} />
                {label}
              </button>
            ))}
          </div>
        </Field>

        {/* Estado de emisión (solo anime/series) */}
        {meta.hasEpisodes && (
          <Field label="Estado de emisión" hint="Se muestra en la ficha pública del título.">
            <div className="flex flex-wrap gap-2">
              {([["en emisión","En emisión","#39ff14"], ["completo","Completo","#00f5ff"], ["próximamente","Próximamente","#ffe600"]] as const).map(([val, label, color]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setEstadoEmision(val)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: estadoEmision === val ? `${color}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${estadoEmision === val ? color : "rgba(255,255,255,0.09)"}`,
                    color: estadoEmision === val ? color : "var(--text-muted)",
                    boxShadow: estadoEmision === val ? `0 0 14px ${color}18` : "none",
                  }}
                >
                  <Radio size={12} />
                  {label}
                </button>
              ))}
            </div>
          </Field>
        )}

        {/* Trailer */}
        <Field label="Trailer (URL de YouTube)" hint="Opcional — se muestra en la ficha del título.">
          <input
            className="admin-input"
            placeholder="https://www.youtube.com/watch?v=..."
            value={trailer}
            onChange={e => setTrailer(e.target.value)}
          />
        </Field>
      </Section>

      {/* ─── 2. DETALLES ─── */}
      <Section title="Detalles del contenido" icon={Clock} color="var(--neon-cyan)">
        <Grid cols={2}>
          <Field label="Año de estreno" required>
            <input type="number" className="admin-input" min={1900} max={2099}
              value={year} onChange={e => setYear(Number(e.target.value))} />
          </Field>
          {meta.hasEpisodes && (
            <Field label="Temporada">
              <input type="number" className="admin-input" min={1} max={50}
                value={season} onChange={e => setSeason(Number(e.target.value))} />
            </Field>
          )}
          {meta.hasEpisodes && (
            <Field label="Total de episodios" hint="Se puede actualizar cuando la temporada termine.">
              <input type="number" className="admin-input" min={1}
                value={totalEps}
                onChange={e => setTotalEps(e.target.value === "" ? "" : Number(e.target.value))} />
            </Field>
          )}
          <Field label={meta.hasEpisodes ? "Duración por episodio" : "Duración total"}>
            <div className="flex items-center gap-2">
              <input type="number" className="admin-input" min={1}
                placeholder="24"
                value={duration}
                onChange={e => setDuration(e.target.value === "" ? "" : Number(e.target.value))} />
              <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>min</span>
            </div>
          </Field>
        </Grid>

        <Grid cols={2}>
          <Field label={meta.studioLabel}>
            <input className="admin-input"
              placeholder={type === "ANIME" ? "Ej: Toei Animation" : type === "SERIE" ? "Ej: HBO" : "Ej: Christopher Nolan"}
              value={studio}
              onChange={e => setStudio(e.target.value)} />
          </Field>
          <Field label="País de origen">
            <input className="admin-input"
              placeholder="Ej: Japón"
              value={country}
              onChange={e => setCountry(e.target.value)} />
          </Field>
        </Grid>
      </Section>

      {/* ─── 3. CLASIFICACIÓN ─── */}
      <Section title="Clasificación" icon={Tag} color="var(--neon-violet)">
        <Grid cols={2}>
          <Field label="Género principal" required>
            <Select
              value={genre}
              onChange={setGenre}
              placeholder="Seleccionar género..."
              color={meta.color}
              options={GENRES.map(g => ({ value: g, label: g }))}
            />
          </Field>
          <Field label="Idioma / Audio">
            <Select
              value={lang}
              onChange={setLang}
              color={meta.color}
              options={LANGS.map(l => ({ value: l, label: l }))}
            />
          </Field>
          <Field label="Clasificación de edad">
            <div className="flex flex-wrap gap-2">
              {RATINGS.map(r => (
                <button key={r} type="button"
                  onClick={() => setRating(r)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: rating === r ? "rgba(191,95,255,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${rating === r ? "rgba(191,95,255,0.5)" : "rgba(255,255,255,0.09)"}`,
                    color: rating === r ? "var(--neon-violet)" : "var(--text-muted)",
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Puntuación inicial" hint="0 = sin puntuación todavía.">
            <div className="flex items-center gap-2">
              <Star size={14} style={{ color: "#ffe600", flexShrink: 0 }} />
              <input type="number" className="admin-input" min={0} max={10} step={0.1} placeholder="0.0" />
            </div>
          </Field>
        </Grid>

        {/* Tags */}
        <Field label="Etiquetas adicionales" hint="Ayudan a la búsqueda interna. Presiona Enter para agregar.">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(t => (
              <span key={t} className="badge badge-violet flex items-center gap-1.5">
                {t}
                <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}
                  className="hover:text-white transition-colors" style={{ color: "rgba(191,95,255,0.5)" }}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="admin-input flex-1" placeholder="Nueva etiqueta..."
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} />
            <button type="button" className="btn-ghost flex-shrink-0" onClick={addTag}>
              <Plus size={14} />
            </button>
          </div>
        </Field>
      </Section>

      {/* ─── 4. FUENTES EXTERNAS ─── */}
      <Section title="Referencias externas" icon={Globe} color="var(--neon-yellow)" defaultOpen={false}>
        <Grid cols={2}>
          <Field label={type === "ANIME" ? "ID de MyAnimeList" : "ID de TMDB"} hint="Para importar metadata automáticamente.">
            <input className="admin-input"
              placeholder={type === "ANIME" ? "Ej: 21" : "Ej: 399566"}
              value={externalId}
              onChange={e => setExternalId(e.target.value)} />
          </Field>
          <Field label="ID de TMDB" hint="The Movie Database.">
            <input className="admin-input"
              placeholder="Ej: 399566"
              value={tmdbId}
              onChange={e => setTmdbId(e.target.value)} />
          </Field>
        </Grid>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Los IDs externos permiten enriquecer automáticamente la ficha con pósters, sinopsis y más datos cuando se integre una API.
        </p>
      </Section>

      {/* ─── 5. SERVIDORES DE DESCARGA ─── */}
      <Section title="Servidores de descarga" icon={Cloud} color="var(--neon-cyan)">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {meta.hasEpisodes
            ? "Activa los servidores disponibles. Las URLs por episodio se configuran en la sección Episodios."
            : "Agrega las URLs de descarga de la película en cada servidor habilitado."}
        </p>
        <ServerBlock
          name="OneDrive" icon={Cloud} color="#00a4ef"
          enabled={svOnedrive.enabled} onToggle={() => setSvOnedrive(s => ({ ...s, enabled: !s.enabled }))}
          url={svOnedrive.url} onUrl={v => setSvOnedrive(s => ({ ...s, url: v }))}
          placeholder={meta.hasEpisodes ? "ID de carpeta compartida en OneDrive..." : "URL de descarga en OneDrive..."}
        />
        <ServerBlock
          name="Google Drive" icon={HardDrive} color="#39ff14"
          enabled={svGdrive.enabled} onToggle={() => setSvGdrive(s => ({ ...s, enabled: !s.enabled }))}
          url={svGdrive.url} onUrl={v => setSvGdrive(s => ({ ...s, url: v }))}
          placeholder={meta.hasEpisodes ? "ID de carpeta compartida en Drive..." : "URL de descarga en Drive..."}
        />
        <ServerBlock
          name="Mega.nz" icon={Database} color="#ff2d78"
          enabled={svMega.enabled} onToggle={() => setSvMega(s => ({ ...s, enabled: !s.enabled }))}
          url={svMega.url} onUrl={v => setSvMega(s => ({ ...s, url: v }))}
          placeholder={meta.hasEpisodes ? "Carpeta pública de Mega..." : "URL de descarga en Mega..."}
        />
      </Section>

      {/* ─── 6. EPISODIOS (solo anime/series) ─── */}
      {meta.hasEpisodes && (
        <Section title={`Episodios · ${episodes.length} cargados`} icon={List} color="var(--neon-pink)">
          {/* Toolbar episodios */}
          <div className="flex flex-wrap items-center gap-3 pb-1"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <button type="button" className="btn-primary" onClick={addEpisode} style={{ padding: "7px 14px" }}>
              <Plus size={14} /> Episodio
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="number" min={1} max={200}
                className="admin-input text-xs text-center"
                style={{ width: 60, height: 32, padding: "4px 8px" }}
                value={bulkCount}
                onChange={e => setBulkCount(Math.max(1, Number(e.target.value)))}
              />
              <button type="button" className="btn-ghost" onClick={bulkAddEpisodes}
                style={{ padding: "6px 12px", fontSize: "0.78rem" }}>
                <Plus size={13} /> Agregar {bulkCount} de una vez
              </button>
            </div>
          </div>

          {episodes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8"
              style={{ color: "var(--text-muted)" }}>
              <List size={28} style={{ opacity: 0.3 }} />
              <p className="text-sm">Sin episodios. Agrega uno por uno o en bloque.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {episodes.map(ep => (
                <EpisodeItem
                  key={ep.id}
                  ep={ep}
                  serverFlags={serverFlags}
                  onChange={updated => updateEpisode(ep.id, updated)}
                  onRemove={() => removeEpisode(ep.id)}
                />
              ))}
              <button type="button" onClick={() => setEpisodes([])}
                className="btn-danger self-start mt-1" style={{ fontSize: "0.75rem", padding: "5px 12px" }}>
                <Trash2 size={12} /> Eliminar todos
              </button>
            </div>
          )}
        </Section>
      )}

      {/* ─── Barra de acciones ─── */}
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
        <button type="button" className="btn-primary" onClick={() => handleSubmit(false)} disabled={saving}>
          {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Guardando…" : "Guardar borrador"}
        </button>
        <button type="button"
          className="btn-ghost"
          onClick={() => handleSubmit(true)}
          disabled={saving}
          style={{ color: "var(--neon-green)", borderColor: "rgba(57,255,20,0.3)" }}>
          <Send size={14} /> Publicar
        </button>
        <button type="button" className="btn-ghost ml-auto" onClick={() => router.push(meta.back)}>
          Cancelar
        </button>
        {saved && (
          <span className="flex items-center gap-2 text-xs" style={{ color: "var(--neon-green)" }}>
            <CheckCircle size={14} /> Guardado — redirigiendo…
          </span>
        )}
      </div>
    </div>
  );
}
