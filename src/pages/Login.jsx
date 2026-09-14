
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { GraduationCap, LockKeyhole, ArrowRight, ShieldCheck } from "lucide-react";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">

      {/* Background Glow */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-1 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">

          <div className="rounded-[22px] bg-slate-950/90 p-7 sm:p-9">

            {/* Logo / Header */}
            <div className="mb-8 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-lg shadow-cyan-500/20">
                <GraduationCap className="h-9 w-9 text-slate-950" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                MJPCSU
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Member Portal
              </p>

              <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />

            </div>

            {/* Welcome */}
            <div className="mb-7">
              <h2 className="text-xl font-semibold text-white">
                Welcome back 👋
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Sign in with your student credentials.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Student ID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Student ID
                </label>

                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="250002030"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-cyan-400/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-cyan-400/10"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3.5 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login to Portal
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

            </form>

            {/* Security Note */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Secure member access</span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          MJPCSU Member Portal • Student Community
        </p>

      </div>
    </div>
  );
}

export default Login;

