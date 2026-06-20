"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

export default function Select({
  value, onChange, options, placeholder = "Seleccionar...", color = "var(--neon-violet)",
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  color?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="admin-input flex items-center justify-between gap-2 cursor-pointer text-left"
        style={{ color: selected ? "var(--text-primary)" : "var(--text-muted)" }}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--text-muted)",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-1.5 w-full max-h-60 overflow-y-auto rounded-xl py-1"
          style={{
            background: "linear-gradient(145deg, rgba(20,15,40,0.97) 0%, rgba(10,8,22,0.97) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderTopColor: "rgba(255,255,255,0.14)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.55), 0 4px 10px rgba(0,0,0,0.35)",
          }}
        >
          {options.map(o => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm text-left transition-colors"
                style={{
                  color: active ? color : "var(--text-secondary)",
                  background: active ? `${color}14` : "transparent",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check size={13} style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
