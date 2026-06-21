"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAdmin } from "../admin-actions";
import { Lock, Mail, AlertCircle, Loader } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, rgba(10,7,28,0.95) 0%, rgba(20,10,45,0.9) 100%)",
        backgroundAttachment: "fixed",
      }}>

      {/* Background effects */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(0,245,255,0.08), transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(191,95,255,0.08), transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }} />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(30,20,60,0.8) 0%, rgba(15,10,40,0.8) 100%)",
            border: "1px solid rgba(191,95,255,0.3)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 50px rgba(191,95,255,0.1)",
          }}>

          {/* Header */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative w-16 h-16">
              <Image
                src="/vortex logo.png"
                alt="Vortex"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--neon-cyan)" }}>
                Vortex Admin
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Panel de control y administración
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg flex gap-2 text-sm"
              style={{
                background: "rgba(255,45,120,0.1)",
                border: "1px solid rgba(255,45,120,0.3)",
                color: "var(--neon-pink)",
              }}>
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text-secondary)" }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--neon-cyan)",
                  opacity: 0.6,
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "var(--text-primary)",
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text-secondary)" }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--neon-cyan)",
                  opacity: 0.6,
                }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "var(--text-primary)",
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-6"
              style={{
                background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(191,95,255,0.15))",
                border: "1px solid rgba(0,245,255,0.4)",
                color: "var(--neon-cyan)",
                opacity: (loading || !email || !password) ? 0.5 : 1,
                cursor: (loading || !email || !password) ? "not-allowed" : "pointer",
              }}>
              {loading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              🔐 Acceso restringido para administradores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
