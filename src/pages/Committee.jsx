
import { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  BadgeCheck,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Crown,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";

function Committee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getMembers() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("is_active", true);

      console.log("DATA FROM SUPABASE:", data);
      console.log("ERROR:", error);

      if (error) {
        setErrorMessage("Unable to load committee members.");
        setLoading(false);
        return;
      }

      setMembers(data || []);
      setLoading(false);
    }

    getMembers();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* =====================================================
          ANIMATION + CUSTOM CSS
      ===================================================== */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: .35;
          }
          50% {
            transform: scale(1.18);
            opacity: .6;
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-130%);
          }
          45%, 100% {
            transform: translateX(130%);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .committee-float {
          animation: float 5s ease-in-out infinite;
        }

        .committee-float-slow {
          animation: floatSlow 7s ease-in-out infinite;
        }

        .committee-pulse {
          animation: pulseGlow 5s ease-in-out infinite;
        }

        .committee-spin {
          animation: spinSlow 22s linear infinite;
        }

        .committee-fade {
          animation: fadeUp .8s ease-out both;
        }

        .committee-shine {
          position: relative;
          overflow: hidden;
        }

        .committee-shine::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 35%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.16),
            transparent
          );
          transform: translateX(-130%);
          animation: shine 6s ease-in-out infinite;
          pointer-events: none;
        }

        .committee-grid {
          background-image:
            linear-gradient(rgba(34,211,238,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,.055) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .committee-card {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative isolate overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 via-white to-slate-50" />

        {/* Grid */}
        <div className="committee-grid absolute inset-0 opacity-70" />

        {/* Glows */}
        <div className="committee-pulse absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-300/25 blur-[100px]" />

        <div className="committee-pulse absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[110px]" />

        <div className="committee-pulse absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/15 blur-[100px]" />

        {/* Floating Particles */}
        <div className="committee-float absolute left-[8%] top-[28%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.8)]" />

        <div className="committee-float-slow absolute right-[12%] top-[24%] h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,.7)]" />

        <div className="committee-float absolute bottom-[18%] left-[18%] h-1.5 w-1.5 rounded-full bg-indigo-500" />

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_.75fr]">

            {/* LEFT */}
            <div className="committee-fade text-center lg:text-left">

              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-cyan-700 shadow-sm backdrop-blur-xl sm:text-sm">
                <Sparkles size={15} />
                MJPCSU • Leadership Team
              </div>

              {/* Heading */}
              <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:mx-0 lg:text-7xl">
                Meet Our{" "}
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Committee
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:mx-0 lg:text-lg">
                Meet the passionate students who contribute their time,
                leadership, and ideas to make our community stronger.
              </p>

              {/* Mini Features */}
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg sm:text-sm">
                  <Users size={15} className="text-cyan-500" />
                  Community
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg sm:text-sm">
                  <Crown size={15} className="text-blue-500" />
                  Leadership
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg sm:text-sm">
                  <ShieldCheck size={15} className="text-indigo-500" />
                  Trusted
                </div>

              </div>

              {/* Member Count */}
              {!loading && !errorMessage && (
                <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur sm:px-5">

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                    <Users size={14} className="text-emerald-600" />
                  </span>

                  <span className="text-xs font-bold text-slate-700 sm:text-sm">
                    {members.length} Active{" "}
                    {members.length === 1 ? "Member" : "Members"}
                  </span>

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                </div>
              )}
            </div>

            {/* RIGHT — 3D VISUAL */}
            <div className="committee-card relative mx-auto flex h-[300px] w-full max-w-[390px] items-center justify-center sm:h-[360px]">

              {/* Orbit */}
              <div className="committee-spin absolute h-64 w-64 rounded-full border border-cyan-400/20 sm:h-72 sm:w-72" />

              <div
                className="committee-spin absolute h-48 w-48 rounded-full border border-blue-400/20 sm:h-56 sm:w-56"
                style={{ animationDirection: "reverse" }}
              />

              {/* Glow */}
              <div className="committee-pulse absolute h-48 w-48 rounded-full bg-cyan-400/20 blur-[80px]" />

              {/* Main Card */}
              <div className="committee-float relative z-10 w-[270px] rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_35px_80px_rgba(15,23,42,.16)] backdrop-blur-2xl sm:w-[300px] sm:p-6">

                {/* Header */}
                <div className="flex items-center justify-between">

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-[.18em] text-slate-400">
                    Leadership Hub
                  </span>

                </div>

                {/* Icon */}
                <div className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-[0_20px_45px_rgba(34,211,238,.25)] sm:h-24 sm:w-24">
                  <Users size={40} />
                </div>

                {/* Text */}
                <div className="mt-5 text-center">

                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-600">
                    MJPCSU
                  </p>

                  <h3 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                    Student Leaders
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Connecting people. Creating impact.
                  </p>

                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-3 gap-2">

                  <div className="rounded-xl bg-cyan-50 p-3 text-center">
                    <Users size={17} className="mx-auto text-cyan-600" />
                    <p className="mt-1.5 text-[9px] font-bold text-slate-500">
                      Unity
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-center">
                    <Crown size={17} className="mx-auto text-blue-600" />
                    <p className="mt-1.5 text-[9px] font-bold text-slate-500">
                      Lead
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-3 text-center">
                    <Sparkles size={17} className="mx-auto text-indigo-600" />
                    <p className="mt-1.5 text-[9px] font-bold text-slate-500">
                      Impact
                    </p>
                  </div>

                </div>

                {/* Status */}
                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                    <span className="text-[10px] font-bold text-slate-500">
                      Committee Status
                    </span>
                  </div>

                  <span className="text-[10px] font-black text-emerald-600">
                    ACTIVE
                  </span>

                </div>
              </div>

              {/* Floating Community Card */}
              <div className="committee-float-slow absolute -left-2 top-10 hidden rounded-2xl border border-cyan-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                    <Users size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-400">
                      Community
                    </p>

                    <p className="text-xs font-black text-slate-800">
                      Together
                    </p>
                  </div>

                </div>
              </div>

              {/* Floating Leadership Card */}
              <div className="committee-float absolute -bottom-1 -right-1 hidden rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                    <Crown size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-400">
                      Leadership
                    </p>

                    <p className="text-xs font-black text-slate-800">
                      Lead & Serve
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <section className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10">

        {/* Section Header */}
        {!loading && !errorMessage && members.length > 0 && (
          <div className="mb-10 text-center">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[.15em] text-cyan-700 sm:text-sm">
              <BadgeCheck size={15} />
              Active Leadership
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Our{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Team
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Dedicated student leaders working together to build a stronger,
              more connected MJPCSU community.
            </p>

          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">

            <div className="committee-float flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-cyan-100 bg-white shadow-xl">

              <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />

            </div>

            <p className="mt-5 text-sm font-bold text-slate-600">
              Loading committee members...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Connecting with MJPCSU database
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && errorMessage && (
          <div className="mx-auto max-w-lg rounded-[2rem] border border-red-200 bg-white p-7 text-center shadow-xl sm:p-9">

            <div className="committee-float mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={30} />
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-900">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {errorMessage}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-cyan-600 hover:shadow-xl"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && !errorMessage && members.length === 0 && (
          <div className="mx-auto max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-10">

            <div className="committee-float mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <UserRound size={30} />
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-900">
              No Active Members
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              There are currently no active committee members to display.
            </p>

          </div>
        )}

        {/* =====================================================
            MEMBER GRID
        ===================================================== */}
        {!loading && !errorMessage && members.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {members.map((member, index) => (
              <div
                key={member.id}
                className="committee-shine group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-cyan-200 hover:shadow-[0_30px_70px_rgba(15,23,42,.12)]"
              >

                {/* ================= TOP HEADER ================= */}
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 sm:h-40">

                  {/* Glow */}
                  <div className="committee-pulse absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl transition duration-700 group-hover:scale-150" />

                  <div className="absolute -bottom-12 left-1/2 h-28 w-40 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

                  {/* Decorative Rings */}
                  <div className="absolute right-5 bottom-4 h-16 w-16 rounded-full border border-cyan-400/10" />

                  <div className="absolute right-9 bottom-8 h-8 w-8 rounded-full border border-blue-400/10" />

                  {/* Number */}
                  <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-cyan-300 backdrop-blur">
                    <span className="text-xs font-black">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Active Badge */}
                  <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur sm:text-[11px]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Active
                  </div>

                  {/* Role hint */}
                  <div className="absolute bottom-5 left-5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[.18em] text-cyan-300/70">
                    <ShieldCheck size={12} />
                    MJPCSU Member
                  </div>

                </div>

                {/* ================= PHOTO ================= */}
                <div className="relative -mt-16 flex justify-center sm:-mt-18">

                  <div className="relative">

                    {/* Glow behind image */}
                    <div className="absolute inset-1 rounded-full bg-cyan-400/30 blur-xl opacity-0 transition duration-500 group-hover:opacity-100" />

                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-[0_15px_40px_rgba(15,23,42,.18)] transition duration-500 group-hover:scale-110 group-hover:rotate-2 sm:h-36 sm:w-36"
                      />
                    ) : (
                      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-4xl font-black text-white shadow-[0_15px_40px_rgba(15,23,42,.18)] transition duration-500 group-hover:scale-110 group-hover:rotate-2 sm:h-36 sm:w-36">
                        {member.full_name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Online Ring */}
                    <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 shadow-lg" />

                  </div>

                </div>

                {/* ================= INFORMATION ================= */}
                <div className="px-5 pb-7 pt-5 text-center sm:px-6 sm:pb-8">

                  <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    {member.full_name}
                  </h2>

                  {/* Role */}
                  <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-3.5 py-1.5 text-xs font-black text-cyan-700 sm:px-4 sm:text-sm">

                    <BadgeCheck size={15} />

                    <span className="truncate">
                      {member.role}
                    </span>

                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                  {/* Member ID */}
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">

                    <div className="flex items-center justify-between">

                      <p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-400">
                        Member ID
                      </p>

                      <ArrowUpRight
                        size={13}
                        className="text-slate-300 transition duration-300 group-hover:text-cyan-500"
                      />

                    </div>

                    <p className="mt-1.5 break-all font-mono text-xs font-bold text-slate-700 sm:text-sm">
                      {member.member_id}
                    </p>

                  </div>

                  {/* Bottom Status */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    Active Committee Member

                  </div>

                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-700 group-hover:w-full" />

              </div>
            ))}

          </div>
        )}

      </section>
    </div>
  );
}

export default Committee;

