"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2, ChevronUp, ChevronDown, Filter } from "lucide-react";

export type ContentType = "ANIME" | "SERIE" | "PELÍCULA";

export interface CatalogItem {
  id: number;
  title: string;
  genre: string;
  year: number;
  status: "on" | "off" | "draft";
  episodes?: number;
  lang: string;
  servers: string[];
}

const STATUS_BADGE: Record<string, string> = {
  on:    "badge badge-green",
  off:   "badge badge-pink",
  draft: "badge badge-yellow",
};
const STATUS_LABEL: Record<string, string> = {
  on: "Publicado", off: "Oculto", draft: "Borrador",
};
const SERVER_BADGE: Record<string, string> = {
  OneDrive: "badge badge-cyan",
  GDrive:   "badge badge-green",
  Mega:     "badge badge-pink",
};
const TYPE_COLOR: Record<ContentType, string> = {
  ANIME:    "#00f5ff",
  SERIE:    "#ff2d78",
  PELÍCULA: "#ffe600",
};

interface Props {
  type: ContentType;
  items: CatalogItem[];
}

export default function CatalogPage({ type, items }: Props) {
  const [search, setSearch]     = useState("");
  const [statusF, setStatusF]   = useState("all");
  const [sortKey, setSortKey]   = useState<keyof CatalogItem>("id");
  const [sortDir, setSortDir]   = useState<"asc"|"desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const color = TYPE_COLOR[type];

  function toggleSort(key: keyof CatalogItem) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const filtered = items
    .filter(i => {
      const q = search.toLowerCase();
      if (q && !i.title.toLowerCase().includes(q) && !i.genre.toLowerCase().includes(q)) return false;
      if (statusF !== "all" && i.status !== statusF) return false;
      return true;
    })
    .sort((a, b) => {
      const va = a[sortKey] as string | number;
      const vb = b[sortKey] as string | number;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  function SortIcon({ k }: { k: keyof CatalogItem }) {
    if (sortKey !== k) return <ChevronUp size={12} style={{ opacity: 0.2 }} />;
    return sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Toolbar ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[180px] max-w-xs"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)" }}>
          <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Buscar ${type.toLowerCase()}...`}
            className="bg-transparent outline-none text-sm flex-1 min-w-0"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        {/* Filter toggle */}
        <button className="btn-ghost" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={14} /> Filtros
        </button>

        <div className="ml-auto flex gap-2">
          <Link
            href={type === "ANIME" ? "/anime/nuevo" : type === "SERIE" ? "/series/nuevo" : "/peliculas/nuevo"}
            className="btn-primary"
          >
            <Plus size={15} /> Agregar {type === "PELÍCULA" ? "Película" : type === "ANIME" ? "Anime" : "Serie"}
          </Link>
        </div>
      </div>

      {/* ── Filters panel ────────────────────────────────── */}
      {showFilters && (
        <div className="glass-card p-4 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Estado</label>
            <select
              value={statusF} onChange={e => setStatusF(e.target.value)}
              className="admin-input" style={{ width: "auto", minWidth: 140 }}
            >
              <option value="all">Todos</option>
              <option value="on">Publicado</option>
              <option value="draft">Borrador</option>
              <option value="off">Oculto</option>
            </select>
          </div>
        </div>
      )}

      {/* ── Stats row ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
        <span className="font-semibold" style={{ color }}>{filtered.length}</span> resultados
        {search && <> · buscando &ldquo;<span style={{ color: "var(--text-secondary)" }}>{search}</span>&rdquo;</>}
      </div>

      {/* ── Table ─────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="cursor-pointer select-none" onClick={() => toggleSort("title")}>
                  <span className="flex items-center gap-1">Título <SortIcon k="title" /></span>
                </th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort("genre")}>
                  <span className="flex items-center gap-1">Género <SortIcon k="genre" /></span>
                </th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort("year")}>
                  <span className="flex items-center gap-1">Año <SortIcon k="year" /></span>
                </th>
                <th>Idioma</th>
                {type !== "PELÍCULA" && <th>Episodios</th>}
                <th>Servidores</th>
                <th className="cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  <span className="flex items-center gap-1">Estado <SortIcon k="status" /></span>
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10" style={{ color: "var(--text-muted)" }}>
                    Sin resultados
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 500, maxWidth: 220 }}>
                    <span className="truncate block">{item.title}</span>
                  </td>
                  <td><span className="badge badge-violet">{item.genre}</span></td>
                  <td style={{ color: "var(--text-secondary)" }}>{item.year}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{item.lang}</td>
                  {type !== "PELÍCULA" && (
                    <td style={{ color: "var(--text-muted)" }}>
                      {item.episodes != null ? `${item.episodes} ep.` : "—"}
                    </td>
                  )}
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {item.servers.map(s => (
                        <span key={s} className={SERVER_BADGE[s] ?? "badge"}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td><span className={STATUS_BADGE[item.status]}>{STATUS_LABEL[item.status]}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn-ghost" style={{ padding: "5px 10px" }} title="Editar">
                        <Pencil size={13} />
                      </button>
                      <button className="btn-danger" title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
