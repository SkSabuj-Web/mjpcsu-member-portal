
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  GraduationCap,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const email = `${studentId}@mjpcsu.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid Student ID or Password.");
      setLoading(false);
      return;
    }

    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 blur-3xl" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.035]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        {/* Decorative circles */}
        <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-cyan-400/60 shadow-lg shadow-cyan-400/50" />
        <div className="absolute right-[15%] top-[28%] h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
        <div className="absolute bottom-[20%] left-[18%] h-1.5 w-1.5 rounded-full bg-blue-400/60" />
      </div>

      {/* ================= LOGIN WRAPPER ================= */}

      <div className="relative z-10 w-full max-w-md">

        {/* Top Badge */}
        <div className="mb-5 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-400 backdrop-blur-md">
            <Sparkles size={13} />
            Student Member Portal
          </div>
        </div>

        {/* ================= LOGIN CARD ================= */}

        <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-[1px] shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">

          <div className="rounded-[27px] border border-white/5 bg-slate-950/90 p-6 sm:p-9">

            {/* ================= HEADER ================= */}

            <div className="mb-8 text-center">

              {/* Logo */}
              <div className="relative mx-auto mb-5 h-20 w-20">

                <div className="absolute inset-0 animate-pulse rounded-3xl bg-cyan-400/10 blur-xl" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-400 to-emerald-400 shadow-xl shadow-cyan-500/20">
                  <GraduationCap className="h-10 w-10 text-slate-950" />
                </div>

              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                MJPCSU
              </h1>

              <p className="mt-2 text-sm font-medium text-slate-400">
                Member Portal
              </p>

              <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400" />

            </div>

            {/* ================= WELCOME ================= */}

            <div className="mb-7">

              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">
                  Welcome back
                </h2>

                <span className="text-lg">👋</span>
              </div>

              <p className="mt-1.5 text-sm leading-6 text-slate-400">
                Sign in to access your MJPCSU member account.
              </p>

            </div>

            {/* ================= FORM ================= */}

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Student ID */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Student ID
                </label>

                <div className="group relative">

                  <GraduationCap className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-400" />

                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="250002030"
                    required
                    autoComplete="username"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.045] py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-600 outline-none transition duration-200 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-400/10"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Password
                </label>

                <div className="group relative">

                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.045] py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-600 outline-none transition duration-200 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-400/10"
                  />

                </div>

              </div>

              {/* ================= ERROR ================= */}

              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3.5 text-sm text-red-300">
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />

                  <span>{error}</span>
                </div>
              )}

              {/* ================= LOGIN BUTTON ================= */}

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 px-4 py-3.5 font-black text-slate-950 shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >

                {/* Shine */}
                {!loading && (
                  <span className="absolute inset-y-0 -left-20 w-16 rotate-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[110%]" />
                )}

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Portal
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}

              </button>

            </form>

            {/* ================= SECURITY ================= */}

            <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-300">
                    Secure Member Access
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                    Your account is protected with secure authentication.
                  </p>
                </div>

                <CheckCircle2
                  className="ml-auto shrink-0 text-emerald-400"
                  size={17}
                />

              </div>

            </div>

          </div>
        </div>

        {/* ================= BOTTOM INFO ================= */}

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
          <Users size={14} />
          <span>MJPCSU Student Community</span>
        </div>

        <p className="mt-2 text-center text-[11px] text-slate-700">
          Authorized members only
        </p>

      </div>
    </div>
  );
}

export default Login;

