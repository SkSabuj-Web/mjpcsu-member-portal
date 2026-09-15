
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Crown,
  Image,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
  Vote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Home() {
  const [photos, setPhotos] = useState([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  /* =====================================================
     LOAD LATEST MEMORIES
  ===================================================== */
  useEffect(() => {
    const loadPhotos = async () => {
      const { data, error } = await supabase.storage
        .from("mjpcsu-media")
        .list("memories/photos", {
          sortBy: {
            column: "created_at",
            order: "desc",
          },
        });

      if (error) {
        console.log("Error loading home memories:", error);
        return;
      }

      setPhotos((data || []).slice(0, 3));
    };

    loadPhotos();
  }, []);

  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    setMouse({
      x: x * 7,
      y: y * 7,
    });
  };

  return (
    <div
      className="min-h-screen overflow-hidden bg-slate-950 text-white"
      onMouseMove={handleMouseMove}
    >
      {/* =====================================================
          ANIMATIONS
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

        @keyframes floatLarge {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-22px) rotate(4deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: .35;
          }
          50% {
            transform: scale(1.15);
            opacity: .65;
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(145px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(145px) rotate(-360deg);
          }
        }

        @keyframes orbitReverse {
          from {
            transform: rotate(360deg) translateX(110px) rotate(-360deg);
          }
          to {
            transform: rotate(0deg) translateX(110px) rotate(0deg);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-130%);
          }
          50%, 100% {
            transform: translateX(130%);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: .35;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .float {
          animation: float 4.5s ease-in-out infinite;
        }

        .float-large {
          animation: floatLarge 6s ease-in-out infinite;
        }

        .pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        .orbit {
          animation: orbit 12s linear infinite;
        }

        .orbit-reverse {
          animation: orbitReverse 15s linear infinite;
        }

        .blink {
          animation: blink 2s ease-in-out infinite;
        }

        .slide-up {
          animation: slideUp .8s ease-out both;
        }

        .glass {
          background: rgba(15, 23, 42, .62);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(34,211,238,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,.055) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .shine {
          position: relative;
          overflow: hidden;
        }

        .shine::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.12),
            transparent
          );
          transform: translateX(-130%);
          animation: shine 6s ease-in-out infinite;
        }

        .perspective {
          perspective: 1200px;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
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
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 grid-bg" />

        {/* Large background glow */}
        <div className="pulse absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[130px]" />

        <div className="pulse absolute -right-40 top-32 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[130px]" />

        {/* Decorative dots */}
        <div className="float absolute left-[7%] top-[30%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,.9)]" />

        <div className="float-large absolute right-[9%] top-[25%] h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_25px_rgba(59,130,246,.9)]" />

        <div className="float absolute bottom-[15%] left-[25%] h-1.5 w-1.5 rounded-full bg-cyan-400" />

        <div className="relative mx-auto grid min-h-[750px] max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          {/* =================================================
              HERO CONTENT
          ================================================= */}
          <div className="slide-up relative z-10 text-center lg:text-left">
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-cyan-300 shadow-[0_0_35px_rgba(34,211,238,.1)]">
              <span className="blink h-1.5 w-1.5 rounded-full bg-cyan-300" />
              MJPCSU Member Portal
              <Sparkles size={13} />
            </div>

            {/* Heading */}
            <h1 className="text-[2.8rem] font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.4rem]">
              Your Campus.
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Your Voice.
              </span>

              <br />

              <span className="text-white">
                Your Community.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg lg:mx-0">
              Connect with fellow students, participate in elections,
              discover community memories, and turn your ideas into action.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/election"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3.5 font-black text-slate-950 shadow-[0_15px_50px_rgba(34,211,238,.22)] transition duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-[0_20px_60px_rgba(34,211,238,.3)]"
              >
                <Vote size={18} />

                Explore Election

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/committee"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white/5 px-6 py-3.5 font-bold backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/10"
              >
                <Users size={18} className="text-cyan-400" />
                Meet Committee
                <ChevronRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Trust line */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 lg:justify-start">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Secure member-only community platform
            </div>

            {/* Stats */}
            <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 border-t border-slate-800/80 pt-7 lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white sm:text-3xl">
                  12
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:text-xs">
                  Members
                </p>
              </div>

              <div className="border-x border-slate-800/80">
                <p className="text-2xl font-black text-cyan-400 sm:text-3xl">
                  100%
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:text-xs">
                  Democratic
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-white sm:text-3xl">
                  ∞
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:text-xs">
                  Memories
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              3D STUDENT HUB
          ================================================= */}
          <div className="perspective relative mx-auto flex h-[470px] w-full max-w-[520px] items-center justify-center">
            {/* Orbit rings */}
            <div
              className="absolute h-[350px] w-[350px] rounded-full border border-cyan-400/10 sm:h-[400px] sm:w-[400px]"
              style={{
                transform: `rotateX(${mouse.y}deg) rotateY(${mouse.x}deg)`,
              }}
            />

            <div
              className="absolute h-[270px] w-[270px] rounded-full border border-blue-400/10 sm:h-[320px] sm:w-[320px]"
              style={{
                transform: `rotateX(${-mouse.y}deg) rotateY(${-mouse.x}deg)`,
              }}
            />

            {/* Orbiting elements */}
            <div className="orbit absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/30 bg-slate-900 text-cyan-300 shadow-lg">
                <Users size={15} />
              </div>
            </div>

            <div className="orbit-reverse absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-400/30 bg-slate-900 text-blue-300">
                <Vote size={14} />
              </div>
            </div>

            {/* Center glow */}
            <div className="absolute h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

            {/* Main card */}
            <div
              className="preserve-3d relative w-[290px] rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_40px_100px_rgba(0,0,0,.65)] backdrop-blur-2xl transition-transform duration-200 sm:w-[340px]"
              style={{
                transform: `
                  rotateX(${-mouse.y}deg)
                  rotateY(${mouse.x}deg)
                  translateZ(25px)
                `,
              }}
            >
              {/* Browser header */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                </div>

                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600">
                  <span className="blink h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live
                </div>
              </div>

              {/* Profile area */}
              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-cyan-400/10 to-blue-500/5 p-4">
                <div className="flex items-center gap-4">
                  <div className="float flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 shadow-[0_10px_35px_rgba(34,211,238,.2)]">
                    <Users size={27} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      Welcome Student
                    </p>

                    <h3 className="mt-1 text-lg font-black">
                      MJPCSU Hub
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Connect • Participate • Lead
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification */}
              <div className="float-large mt-4 flex items-center gap-3 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                  <Bell size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-yellow-300">
                    Stay Connected
                  </p>

                  <p className="truncate text-[9px] text-slate-500">
                    New community updates are waiting
                  </p>
                </div>

                <span className="ml-auto h-2 w-2 rounded-full bg-yellow-400" />
              </div>

              {/* Dashboard cards */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="group rounded-xl border border-white/5 bg-white/[.035] p-3 text-center transition hover:-translate-y-1 hover:bg-white/[.06]">
                  <Users
                    size={17}
                    className="mx-auto text-cyan-400"
                  />
                  <p className="mt-2 text-[9px] font-bold text-slate-500">
                    Community
                  </p>
                </div>

                <div className="group rounded-xl border border-white/5 bg-white/[.035] p-3 text-center transition hover:-translate-y-1 hover:bg-white/[.06]">
                  <Vote
                    size={17}
                    className="mx-auto text-blue-400"
                  />
                  <p className="mt-2 text-[9px] font-bold text-slate-500">
                    Election
                  </p>
                </div>

                <div className="group rounded-xl border border-white/5 bg-white/[.035] p-3 text-center transition hover:-translate-y-1 hover:bg-white/[.06]">
                  <Lightbulb
                    size={17}
                    className="mx-auto text-yellow-400"
                  />
                  <p className="mt-2 text-[9px] font-bold text-slate-500">
                    Ideas
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-[9px] font-bold">
                  <span className="text-slate-500">
                    Community Participation
                  </span>

                  <span className="text-cyan-400">
                    Active
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
              </div>
            </div>

            {/* Floating left badge */}
            <div className="float-large absolute -left-2 top-16 hidden rounded-2xl border border-cyan-400/20 bg-slate-900/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>

                <div>
                  <p className="text-[9px] text-slate-600">
                    Community
                  </p>

                  <p className="text-xs font-black">
                    Active
                  </p>
                </div>
              </div>
            </div>

            {/* Floating right badge */}
            <div className="float absolute -bottom-1 -right-1 hidden rounded-2xl border border-blue-400/20 bg-slate-900/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                  <Image size={16} />
                </div>

                <div>
                  <p className="text-[9px] text-slate-600">
                    Gallery
                  </p>

                  <p className="text-xs font-black">
                    Memories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero bottom fade */}
        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}
      <section className="relative bg-slate-950 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[.22em] text-cyan-400">
              Why This Portal
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              Everything your student community{" "}
              <span className="text-cyan-400">
                needs.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
              A simple, secure and engaging platform designed to make
              student participation easier.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Secure",
                text: "Member-only access with secure authentication.",
              },
              {
                icon: Users,
                title: "Community",
                text: "Stay connected with fellow student members.",
              },
              {
                icon: Vote,
                title: "Democracy",
                text: "Participate in transparent student elections.",
              },
              {
                icon: Image,
                title: "Memories",
                text: "Explore and preserve memorable moments.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="shine group rounded-3xl border border-slate-800 bg-slate-900/40 p-6 transition duration-500 hover:-translate-y-3 hover:border-cyan-400/30 hover:bg-slate-900/80 hover:shadow-[0_25px_70px_rgba(34,211,238,.08)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon size={23} />
                    </div>

                    <span className="text-xs font-black text-slate-700">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 text-lg font-black">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          COMMITTEE
      ===================================================== */}
      <section className="relative overflow-hidden bg-slate-900/40 px-5 py-24 sm:px-8 lg:px-10">
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-cyan-400">
                Leadership
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Current Committee
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Student leaders working together to serve the community.
              </p>
            </div>

            <Link
              to="/committee"
              className="inline-flex items-center gap-2 font-bold text-cyan-400 transition hover:text-cyan-300"
            >
              View Committee
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                role: "President",
                icon: Crown,
              },
              {
                role: "General Secretary",
                icon: Users,
              },
              {
                role: "Treasurer",
                icon: ShieldCheck,
              },
            ].map((member) => {
              const Icon = member.icon;

              return (
                <div
                  key={member.role}
                  className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-7 transition duration-500 hover:-translate-y-3 hover:border-cyan-400/30 hover:shadow-[0_25px_60px_rgba(34,211,238,.08)]"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/5 blur-2xl transition group-hover:bg-cyan-400/10" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon size={25} />
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Active
                    </span>
                  </div>

                  <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                    Leadership Position
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    {member.role}
                  </h3>

                  <div className="mt-6 h-px bg-slate-800" />

                  <Link
                    to="/committee"
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-slate-500 transition group-hover:text-cyan-400"
                  >
                    Explore
                    <ChevronRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          ELECTION
      ===================================================== */}
      <section className="relative px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-600/10 p-7 shadow-2xl sm:p-10 lg:p-14">
            <div className="pulse absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-4 py-2 text-xs font-bold text-slate-400">
                  <Vote size={15} className="text-cyan-400" />
                  Student Election
                </div>

                <h2 className="text-3xl font-black sm:text-5xl">
                  Your voice can{" "}
                  <span className="text-cyan-400">
                    shape the future.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Participate in student elections and help choose the
                  leaders who represent your community.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold text-slate-400">
                    ✓ Transparent
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold text-slate-400">
                    ✓ Member Based
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold text-slate-400">
                    ✓ Secure
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6 text-center shadow-2xl backdrop-blur-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                  <Vote size={25} />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Current Status
                </p>

                <p className="mt-2 text-lg font-black">
                  No Active Election
                </p>

                <Link
                  to="/election"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300"
                >
                  Open Election
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MEMORIES
      ===================================================== */}
      <section className="bg-slate-900/40 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-cyan-400">
                Community Moments
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Latest Memories
              </h2>
            </div>

            <Link
              to="/memories"
              className="inline-flex items-center gap-2 font-bold text-cyan-400 transition hover:text-cyan-300"
            >
              View Gallery
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {photos.length > 0 ? (
              photos.map((photo, index) => {
                const { data } = supabase.storage
                  .from("mjpcsu-media")
                  .getPublicUrl(`memories/photos/${photo.name}`);

                return (
                  <div
                    key={photo.name}
                    className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 ${
                      index === 1 ? "md:-translate-y-5" : ""
                    }`}
                  >
                    <img
                      src={data.publicUrl}
                      alt="MJPCSU memory"
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                        <Image size={14} />
                        MJPCSU Memory
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-800 py-20 text-center">
                <Image
                  className="mx-auto mb-4 text-slate-700"
                  size={35}
                />

                <p className="text-sm text-slate-500">
                  No memories available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK ACCESS
      ===================================================== */}
      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[.22em] text-cyan-400">
              Explore Portal
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Everything is just a click away.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Mission",
                text: "Learn about our vision.",
                link: "/mission",
                icon: ShieldCheck,
              },
              {
                title: "Committee",
                text: "Meet student leaders.",
                link: "/committee",
                icon: Users,
              },
              {
                title: "Election",
                text: "Participate and vote.",
                link: "/election",
                icon: Vote,
              },
              {
                title: "Proposal",
                text: "Share your ideas.",
                link: "/proposal",
                icon: Lightbulb,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.link}
                  className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-slate-900 hover:shadow-[0_25px_60px_rgba(34,211,238,.08)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 transition duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon size={22} />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-slate-700 transition duration-300 group-hover:translate-x-1 group-hover:text-cyan-400"
                    />
                  </div>

                  <h3 className="mt-6 text-lg font-black">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.text}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-slate-800 bg-slate-950 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="font-black">
              MJPCSU Member Portal
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Connecting students. Building community.
            </p>
          </div>

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MJPCSU. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;

