"use client";

import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Tv2, Film, Clapperboard, Users, TrendingUp,
  Eye, Download, Star, ArrowUp, ArrowDown,
} from "lucide-react";

/* formateador consistente server/client — sin toLocaleString */
function fmt(n: number): string {
  if (n >= 1000) return `${Math.round(n / 100) / 10}K`;
  return String(n);
}

/* ── Datos mock ─────────────────────────────────────────── */
const TRAFFIC_7D = [
  { day: "Lun", visitas: 1240, descargas: 380, usuarios: 95 },
  { day: "Mar", visitas: 1890, descargas: 520, usuarios: 142 },
  { day: "Mié", visitas: 1560, descargas: 410, usuarios: 118 },
  { day: "Jue", visitas: 2100, descargas: 690, usuarios: 185 },
  { day: "Vie", visitas: 2780, descargas: 870, usuarios: 240 },
  { day: "Sáb", visitas: 3200, descargas: 1100, usuarios: 310 },
  { day: "Dom", visitas: 2950, descargas: 980, usuarios: 278 },
];

const FUNNEL_DATA = [
  { value: 12400, name: "Visitantes únicos",   fill: "#bf5fff" },
  { value: 8930,  name: "Ven el catálogo",     fill: "#9b44e8" },
  { value: 5240,  name: "Abren una ficha",     fill: "#7a2fd0" },
  { value: 3180,  name: "Clic en descarga",    fill: "#5c1fb8" },
  { value: 2450,  name: "Descarga completada", fill: "#3d12a0" },
];

const GENRES_BAR = [
  { genre: "Acción",    anime: 28, series: 12, peliculas: 18 },
  { genre: "Drama",     anime: 14, series: 22, peliculas: 24 },
  { genre: "Sci-Fi",    anime: 8,  series: 14, peliculas: 20 },
  { genre: "Aventura",  anime: 22, series: 6,  peliculas: 10 },
  { genre: "Terror",    anime: 4,  series: 8,  peliculas: 16 },
  { genre: "Comedia",   anime: 12, series: 10, peliculas: 14 },
];

const SERVERS_DONUT = [
  { name: "OneDrive", value: 42, color: "#00a4ef" },
  { name: "GDrive",   value: 35, color: "#39ff14" },
  { name: "Mega",     value: 23, color: "#ff2d78" },
];

const GROWTH_LINE = [
  { mes: "Ene", usuarios: 320 },
  { mes: "Feb", usuarios: 480 },
  { mes: "Mar", usuarios: 610 },
  { mes: "Abr", usuarios: 890 },
  { mes: "May", usuarios: 1240 },
  { mes: "Jun", usuarios: 1820 },
];

const RADAR_DATA = [
  { metric: "Descargas",    anime: 92, series: 74, peliculas: 68 },
  { metric: "Valoración",   anime: 88, series: 80, peliculas: 72 },
  { metric: "Retención",    anime: 76, series: 82, peliculas: 55 },
  { metric: "Compartidos",  anime: 65, series: 58, peliculas: 70 },
  { metric: "Completados",  anime: 70, series: 85, peliculas: 60 },
  { metric: "Popularidad",  anime: 95, series: 78, peliculas: 65 },
];

const TOP5 = [
  { title: "One Piece",        downloads: 4820, rating: 4.9, trend: "up"   },
  { title: "Demon Slayer S4",  downloads: 3940, rating: 4.8, trend: "up"   },
  { title: "Avengers: Endgame",downloads: 3210, rating: 4.7, trend: "down" },
  { title: "Breaking Bad",     downloads: 2980, rating: 4.9, trend: "up"   },
  { title: "Solo Leveling",    downloads: 2760, rating: 4.6, trend: "down" },
];

const RECENT = [
  { title: "Dragon Ball Daima",  type: "ANIME",    date: "Hace 2h",  status: "on"    },
  { title: "Dune: Parte 3",      type: "PELÍCULA", date: "Hace 5h",  status: "on"    },
  { title: "The Last of Us S3",  type: "SERIE",    date: "Hace 1d",  status: "draft" },
  { title: "Solo Leveling S2",   type: "ANIME",    date: "Hace 2d",  status: "on"    },
  { title: "Oppenheimer",        type: "PELÍCULA", date: "Hace 3d",  status: "on"    },
];

const STATS = [
  { label: "Anime",         value: "142",  change: "+8",   up: true,  icon: Tv2,          color: "#00f5ff" },
  { label: "Series",        value: "87",   change: "+3",   up: true,  icon: Film,         color: "#ff2d78" },
  { label: "Películas",     value: "215",  change: "+12",  up: true,  icon: Clapperboard, color: "#ffe600" },
  { label: "Usuarios",      value: "1.8K", change: "+124", up: true,  icon: Users,        color: "#bf5fff" },
  { label: "Visitas hoy",   value: "3.2K", change: "+18%", up: true,  icon: Eye,          color: "#39ff14" },
  { label: "Descargas hoy", value: "980",  change: "-4%",  up: false, icon: Download,     color: "#ff9500" },
];

const TYPE_BADGE: Record<string, string> = {
  ANIME: "badge badge-cyan", SERIE: "badge badge-pink", PELÍCULA: "badge badge-yellow",
};
const STATUS_CLS: Record<string, string> = {
  on: "badge badge-green", off: "badge badge-pink", draft: "badge badge-yellow",
};
const STATUS_LBL: Record<string, string> = {
  on: "Publicado", off: "Oculto", draft: "Borrador",
};

/* ── Tooltip personalizado ───────────────────────────────── */
const TT_STYLE = {
  background: "rgba(10,8,25,0.96)",
  border: "1px solid rgba(191,95,255,0.3)",
  borderRadius: 8,
  fontSize: 12,
  color: "#e8e8f0",
};

/* ── Componente principal ────────────────────────────────── */
export default function DashboardClient() {
  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. Stats cards ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
              <div className="flex items-center justify-center rounded-lg w-8 h-8"
                style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                <Icon size={15} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
            <p className="text-xs flex items-center gap-1" style={{ color: up ? "var(--neon-green)" : "var(--neon-pink)" }}>
              {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {change} este mes
            </p>
          </div>
        ))}
      </div>

      {/* ── 2. Tráfico + Servidores ───────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Area chart — tráfico 7 días */}
        <div className="glass-card p-5 xl:col-span-2">
          <ChartHeader
            title="Tráfico semanal"
            sub="Visitas, descargas y nuevos usuarios (últimos 7 días)"
          />
          <div className="flex items-center gap-4 mb-2" style={{ paddingBottom: 8 }}>
            {[
              { value: "Visitas",   color: "#bf5fff" },
              { value: "Descargas", color: "#00f5ff" },
              { value: "Usuarios",  color: "#39ff14" },
            ].map(({ value, color }) => (
              <span key={value} className="flex items-center gap-1.5" style={{ fontSize: 11, color: "var(--text-muted)" }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                {value}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={TRAFFIC_7D} margin={{ top: 0, right: 4, left: -22, bottom: 0 }}>
              <defs>
                {[["gV","#bf5fff"],["gD","#00f5ff"],["gU","#39ff14"]].map(([id,c])=>(
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill:"#4a4a6a" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill:"#4a4a6a" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TT_STYLE} cursor={{ stroke:"rgba(191,95,255,0.15)", strokeWidth:1 }}/>
              <Area type="monotone" dataKey="visitas"   stroke="#bf5fff" strokeWidth={2} fill="url(#gV)" dot={false}/>
              <Area type="monotone" dataKey="descargas" stroke="#00f5ff" strokeWidth={2} fill="url(#gD)" dot={false}/>
              <Area type="monotone" dataKey="usuarios"  stroke="#39ff14" strokeWidth={2} fill="url(#gU)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut — distribución de servidores */}
        <div className="glass-card p-5 flex flex-col">
          <ChartHeader title="Uso de servidores" sub="% de descargas por servidor" />
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={SERVERS_DONUT} cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                  paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {SERVERS_DONUT.map(({ color }, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip contentStyle={TT_STYLE} formatter={(v) => [`${v}%`, ""]}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 w-full mt-1">
              {SERVERS_DONUT.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span style={{ color:"var(--text-secondary)" }}>{name}</span>
                  </span>
                  <span className="font-bold" style={{ color }}>{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Funnel + Géneros + Crecimiento ────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* FUNNEL — conversión de usuarios */}
        <div className="glass-card p-5">
          <ChartHeader title="Embudo de conversión" sub="Journey del visitante hasta la descarga" />
          <ResponsiveContainer width="100%" height={230}>
            <FunnelChart>
              <Tooltip
                contentStyle={TT_STYLE}
                formatter={(v, _, props) => [
                  fmt(Number(v)),
                  props.payload?.name ?? "",
                ]}
              />
              <Funnel dataKey="value" data={FUNNEL_DATA} isAnimationActive lastShapeType="rectangle">
                <LabelList
                  position="insideTop"
                  fill="#fff"
                  fontSize={10}
                  dataKey="name"
                  formatter={(v) => v}
                />
                <LabelList
                  position="right"
                  fill="var(--text-muted)"
                  fontSize={10}
                  dataKey="value"
                  formatter={(v) => fmt(Number(v))}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          {/* tasa de conversión global */}
          <div className="mt-1 pt-3 flex items-center justify-between text-xs"
            style={{ borderTop:"1px solid var(--border-glass)" }}>
            <span style={{ color:"var(--text-muted)" }}>Conversión total</span>
            <span className="font-bold" style={{ color:"var(--neon-violet)" }}>
              {((2450/12400)*100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* BAR — contenido por género */}
        <div className="glass-card p-5">
          <ChartHeader title="Catálogo por género" sub="Títulos según tipo de contenido" />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={GENRES_BAR} margin={{ top: 0, right: 4, left: -22, bottom: 0 }} barSize={7}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="genre" tick={{ fontSize: 9, fill:"#4a4a6a" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 10, fill:"#4a4a6a" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TT_STYLE}/>
              <Bar dataKey="anime"    name="Anime"    fill="#00f5ff" radius={[3,3,0,0]}/>
              <Bar dataKey="series"   name="Series"   fill="#ff2d78" radius={[3,3,0,0]}/>
              <Bar dataKey="peliculas" name="Películas" fill="#ffe600" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4" style={{ marginTop: 4 }}>
            {[
              { value: "Anime",     color: "#00f5ff" },
              { value: "Series",    color: "#ff2d78" },
              { value: "Películas", color: "#ffe600" },
            ].map(({ value, color }) => (
              <span key={value} className="flex items-center gap-1.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
                <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
                {value}
              </span>
            ))}
          </div>
        </div>

        {/* LINE — crecimiento de usuarios */}
        <div className="glass-card p-5">
          <ChartHeader title="Crecimiento de usuarios" sub="Nuevos registros por mes (2026)" />
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={GROWTH_LINE} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mes" tick={{ fontSize:11, fill:"#4a4a6a" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:"#4a4a6a" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TT_STYLE}/>
              <Line type="monotone" dataKey="usuarios" name="Usuarios" stroke="#bf5fff"
                strokeWidth={2.5} dot={{ fill:"#bf5fff", r:4, strokeWidth:0 }}
                activeDot={{ r:6, fill:"#bf5fff", stroke:"rgba(191,95,255,0.4)", strokeWidth:4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 4. Radar + Top 5 ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* RADAR — rendimiento por tipo de contenido */}
        <div className="glass-card p-5">
          <ChartHeader title="Rendimiento por tipo" sub="Métricas clave comparadas (0–100)" />
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize:10, fill:"#8888aa" }}/>
              <PolarRadiusAxis tick={{ fontSize:9, fill:"#4a4a6a" }} domain={[0,100]} tickCount={4}/>
              <Radar name="Anime"     dataKey="anime"     stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.15} strokeWidth={2}/>
              <Radar name="Series"    dataKey="series"    stroke="#ff2d78" fill="#ff2d78" fillOpacity={0.12} strokeWidth={2}/>
              <Radar name="Películas" dataKey="peliculas" stroke="#ffe600" fill="#ffe600" fillOpacity={0.10} strokeWidth={2}/>
              <Tooltip contentStyle={TT_STYLE}/>
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4" style={{ fontSize: 10 }}>
            {[
              { value: "Anime",     color: "#00f5ff" },
              { value: "Series",    color: "#ff2d78" },
              { value: "Películas", color: "#ffe600" },
            ].map(({ value, color }) => (
              <span key={value} className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                {value}
              </span>
            ))}
          </div>
        </div>

        {/* TOP 5 — más descargados */}
        <div className="glass-card p-5 xl:col-span-2">
          <ChartHeader title="Top 5 — más descargados" sub="Ranking semanal con tendencia" />
          <div className="flex flex-col gap-3 mt-2">
            {TOP5.map(({ title, downloads, rating, trend }, i) => {
              const pct = Math.round((downloads / TOP5[0].downloads) * 100);
              return (
                <div key={title} className="flex items-center gap-4">
                  <span className="text-xs font-bold w-5 text-center flex-shrink-0"
                    style={{ color: i === 0 ? "#ffe600" : "var(--text-muted)" }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate" style={{ color:"var(--text-primary)" }}>{title}</span>
                      <span className="flex items-center gap-1 text-xs ml-2 flex-shrink-0"
                        style={{ color: trend === "up" ? "var(--neon-green)" : "var(--neon-pink)" }}>
                        {trend === "up" ? <ArrowUp size={10}/> : <ArrowDown size={10}/>}
                        {fmt(downloads)}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: i === 0
                            ? "linear-gradient(90deg,#bf5fff,#00f5ff)"
                            : "rgba(191,95,255,0.45)"
                        }}/>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs flex-shrink-0"
                    style={{ color:"#ffe600" }}>
                    <Star size={10} fill="#ffe600"/>{rating}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 5. Actividad reciente ─────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom:"1px solid var(--border-glass)" }}>
          <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>Actividad reciente</p>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th><th>Tipo</th><th>Fecha</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {RECENT.map(({ title, type, date, status }) => (
              <tr key={title}>
                <td style={{ color:"var(--text-primary)", fontWeight:500 }}>{title}</td>
                <td><span className={TYPE_BADGE[type] ?? "badge"}>{type}</span></td>
                <td style={{ color:"var(--text-muted)" }}>{date}</td>
                <td><span className={STATUS_CLS[status]}>{STATUS_LBL[status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function ChartHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-3">
      <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>{title}</p>
      <p className="text-xs" style={{ color:"var(--text-muted)" }}>{sub}</p>
    </div>
  );
}
