"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { crearUsuarioAdmin } from "@/app/admin-actions";
import { Lock, Mail, User, AlertCircle, CheckCircle, Loader } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"check" | "form" | "success">("check");
  const [formData, setFormData] = useState({ email: "", nombre: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    // Verificar si ya existe un admin
    checkAdmins();
  }, []);

  async function checkAdmins() {
    try {
      const res = await fetch("/api/check-admin");
      const data = await res.json();

      if (data.exists) {
        // Ya existe admin, redirigir a login
        router.push("/login");
      } else {
        setStep("form");
      }
    } catch (err) {
      setError("Error al verificar estado");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const res = await crearUsuarioAdmin(formData.email, formData.nombre, formData.password, "admin");
      if (res.ok) {
        setStep("success");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Error al crear usuario");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, rgba(10,7,28,0.95) 0%, rgba(20,10,45,0.9) 100%)",
          backgroundAttachment: "fixed",
        }}>
        <div className="glass-card p-8 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(30,20,60,0.8) 0%, rgba(15,10,40,0.8) 100%)",
            border: "1px solid rgba(191,95,255,0.3)",
          }}>
          <Loader className="animate-spin mx-auto mb-4" size={32} style={{ color: "var(--neon-cyan)" }} />
          <p style={{ color: "var(--text-muted)" }}>Verificando estado...</p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, rgba(10,7,28,0.95) 0%, rgba(20,10,45,0.9) 100%)",
          backgroundAttachment: "fixed",
        }}>
        <div className="glass-card p-8 rounded-2xl text-center max-w-md"
          style={{
            background: "linear-gradient(135deg, rgba(30,20,60,0.8) 0%, rgba(15,10,40,0.8) 100%)",
            border: "1px solid rgba(191,95,255,0.3)",
          }}>
          <CheckCircle className="mx-auto mb-4" size={48} style={{ color: "var(--neon-green)" }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--neon-green)" }}>
            ¡Admin creado!
          </h1>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Usuario admin creado exitosamente
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Redirigiendo a login en 3 segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, rgba(10,7,28,0.95) 0%, rgba(20,10,45,0.9) 100%)",
        backgroundAttachment: "fixed",
      }}>
      <div className="glass-card p-8 rounded-2xl max-w-md w-full"
        style={{
          background: "linear-gradient(135deg, rgba(30,20,60,0.8) 0%, rgba(15,10,40,0.8) 100%)",
          border: "1px solid rgba(191,95,255,0.3)",
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
              Setup Inicial
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Crea tu usuario administrador
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
          {/* Nombre */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text-secondary)" }}>
              Nombre completo
            </label>
            <div className="relative">
              <User size={16} style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--neon-cyan)",
                opacity: 0.6,
              }} />
              <input
                type="text"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Tu nombre"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  color: "var(--text-primary)",
                }}
                disabled={submitLoading}
                required
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  color: "var(--text-primary)",
                }}
                disabled={submitLoading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text-secondary)" }}>
              Contraseña (mínimo 8 caracteres)
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
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  color: "var(--text-primary)",
                }}
                disabled={submitLoading}
                required
                minLength={8}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitLoading || !formData.email || !formData.nombre || !formData.password}
            className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-6"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(191,95,255,0.15))",
              border: "1px solid rgba(0,245,255,0.4)",
              color: "var(--neon-cyan)",
              opacity: (submitLoading || !formData.email || !formData.nombre || !formData.password) ? 0.5 : 1,
              cursor: (submitLoading || !formData.email || !formData.nombre || !formData.password) ? "not-allowed" : "pointer",
            }}>
            {submitLoading ? (
              <>
                <Loader size={14} className="animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Lock size={14} />
                Crear admin
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            🔐 Esta página solo funciona si no existen administradores
          </p>
        </div>
      </div>
    </div>
  );
}
