
import {
  Users,
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";

function Mission() {
  const values = [
    {
      icon: Users,
      title: "Unity",
      description:
        "Building strong connections and creating a community where everyone belongs.",
    },
    {
      icon: Target,
      title: "Leadership",
      description:
        "Inspiring students to take responsibility, lead with purpose, and make an impact.",
    },
    {
      icon: ShieldCheck,
      title: "Respect",
      description:
        "Valuing every member, perspective, contribution, and voice.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description:
        "Creating opportunities to learn, develop skills, and become better leaders.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">

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
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: .35;
          }
          50% {
            transform: scale(1.15);
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
          50%, 100% {
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

        .mission-float {
          animation: float 5s ease-in-out infinite;
        }

        .mission-float-large {
          animation: floatLarge 7s ease-in-out infinite;
        }

        .mission-pulse {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .mission-spin {
          animation: spinSlow 20s linear infinite;
        }

        .mission-fade {
          animation: fadeUp .8s ease-out both;
        }

        .mission-grid {
          background-image:
            linear-gradient(rgba(34,211,238,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,.055) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .mission-shine {
          position: relative;
          overflow: hidden;
        }

        .mission-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.15),
            transparent
          );
          transform: translateX(-130%);
          animation: shine 6s ease-in-out infinite;
          pointer-events: none;
        }

        .mission-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative isolate overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 via-white to-slate-50" />
        <div className="mission-grid absolute inset-0 opacity-60" />

        {/* Main glows */}
        <div className="mission-pulse absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-300/25 blur-[100px]" />

        <div className="mission-pulse absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[110px]" />

        {/* Floating particles */}
        <div className="mission-float absolute left-[8%] top-[32%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.7)]" />

        <div className="mission-float-large absolute right-[12%] top-[28%] h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,.6)]" />

        <div className="mission-float absolute bottom-[15%] left-[20%] h-1.5 w-1.5 rounded-full bg-indigo-400" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24">

          <div className="grid items-center gap-14 lg:grid-cols-[1fr_.8fr]">

            {/* =================================================
                LEFT
            ================================================= */}
            <div className="mission-fade text-center lg:text-left">

              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-cyan-700 shadow-sm backdrop-blur-xl sm:text-sm">
                <Sparkles size={15} />
                MJPCSU • Our Purpose
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">

                Building a{" "}

                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Stronger
                </span>

                <br />

                Student Community.
              </h1>

              {/* Description */}
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:mx-0 lg:text-lg">
                Connecting students, developing leaders, and creating
                meaningful opportunities that inspire everyone to{" "}
                <span className="font-bold text-slate-800">
                  connect, lead, and grow.
                </span>
              </p>

              {/* Pills */}
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">

                {[
                  ["🤝", "Community"],
                  ["🚀", "Leadership"],
                  ["🌱", "Growth"],
                ].map(([emoji, text]) => (
                  <span
                    key={text}
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg sm:text-sm"
                  >
                    {emoji} {text}
                  </span>
                ))}

              </div>

              {/* Trust */}
              <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 lg:justify-start">
                <ShieldCheck size={15} className="text-emerald-500" />
                Built around students, participation & community
              </div>

            </div>

            {/* =================================================
                3D VISUAL
            ================================================= */}
            <div className="mission-3d relative mx-auto flex h-[390px] w-full max-w-[420px] items-center justify-center">

              {/* Outer ring */}
              <div className="mission-spin absolute h-[300px] w-[300px] rounded-full border border-cyan-400/20 sm:h-[350px] sm:w-[350px]" />

              {/* Second ring */}
              <div
                className="mission-spin absolute h-[240px] w-[240px] rounded-full border border-blue-400/15 sm:h-[285px] sm:w-[285px]"
                style={{ animationDirection: "reverse" }}
              />

              {/* Glow */}
              <div className="mission-pulse absolute h-56 w-56 rounded-full bg-cyan-400/20 blur-[80px]" />

              {/* Orbit dots */}
              <div className="absolute left-1/2 top-1/2 h-full w-full">
                <div className="mission-float absolute left-[8%] top-[18%] h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,.8)]" />

                <div className="mission-float-large absolute right-[7%] bottom-[18%] h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,.7)]" />
              </div>

              {/* Main card */}
              <div className="mission-float relative z-10 w-[285px] rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_35px_80px_rgba(15,23,42,.16)] backdrop-blur-2xl sm:w-[320px]">

                {/* Header */}
                <div className="mb-5 flex items-center justify-between">

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Student Hub
                  </span>

                </div>

                {/* Main icon */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_20px_45px_rgba(34,211,238,.25)]">
                  <GraduationCap size={44} />
                </div>

                <div className="mt-5 text-center">

                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-600">
                    MJPCSU
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-slate-900">
                    Connect & Grow
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    Together we create impact.
                  </p>

                </div>

                {/* Mini cards */}
                <div className="mt-6 grid grid-cols-3 gap-2">

                  <div className="rounded-xl bg-cyan-50 p-3 text-center">
                    <Users
                      size={17}
                      className="mx-auto text-cyan-600"
                    />
                    <p className="mt-2 text-[9px] font-bold text-slate-500">
                      Unity
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-center">
                    <Target
                      size={17}
                      className="mx-auto text-blue-600"
                    />
                    <p className="mt-2 text-[9px] font-bold text-slate-500">
                      Purpose
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-3 text-center">
                    <TrendingUp
                      size={17}
                      className="mx-auto text-indigo-600"
                    />
                    <p className="mt-2 text-[9px] font-bold text-slate-500">
                      Growth
                    </p>
                  </div>

                </div>

                {/* Progress */}
                <div className="mt-5">

                  <div className="mb-2 flex justify-between text-[9px] font-bold">
                    <span className="text-slate-400">
                      Community Spirit
                    </span>

                    <span className="text-cyan-600">
                      Strong
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-600" />
                  </div>

                </div>

              </div>

              {/* Floating badge */}
              <div className="mission-float-large absolute -left-2 top-14 hidden rounded-2xl border border-cyan-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                    <HeartHandshake size={17} />
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

              {/* Floating idea badge */}
              <div className="mission-float absolute -bottom-2 -right-1 hidden rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500">
                    <Lightbulb size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-400">
                      Every Idea
                    </p>

                    <p className="text-xs font-black text-slate-800">
                      Matters
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-slate-50 to-transparent" />

      </section>


      {/* =====================================================
          WHO WE ARE
      ===================================================== */}
      <section className="relative px-5 py-20 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="mission-shine relative overflow-hidden rounded-[2rem] bg-slate-900 p-7 text-white shadow-2xl sm:p-10 lg:p-14">

            {/* Glow */}
            <div className="mission-pulse absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[90px]" />

            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">

              <div>

                <div className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-cyan-400 sm:text-sm">
                  <HeartHandshake size={17} />
                  Who We Are
                </div>

                <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">

                  More Than a Union.

                  <span className="text-cyan-400">
                    {" "}We Are a Community.
                  </span>

                </h2>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 md:text-lg">
                  Modern Jurassic Park Central Student's Union (MJPCSU) is a
                  student-focused community built to connect people,
                  encourage teamwork, develop leadership, and create
                  meaningful opportunities for students to participate,
                  contribute, and grow together.
                </p>

              </div>

              {/* 3D Icon */}
              <div className="mission-float hidden h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,.25)] md:flex">

                <Users
                  size={48}
                  className="text-cyan-400"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          VISION + MISSION
      ===================================================== */}
      <section className="px-5 py-4 sm:px-8 lg:px-10">

        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">

          {/* Vision */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-7 text-white shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-9 lg:p-11">

            <div className="mission-pulse absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Eye size={27} />
                </div>

                <span className="text-5xl font-black text-white/10">
                  01
                </span>

              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-[.2em] text-cyan-100">
                Our Vision
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                A Stronger Student Community
              </h2>

              <p className="mt-5 text-sm leading-7 text-cyan-50 sm:text-base sm:leading-8">
                To build an inclusive and supportive student community where
                every member can contribute, grow, lead, and create a positive
                impact.
              </p>

              <div className="mt-7 h-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-2/3 rounded-full bg-white/70" />
              </div>

            </div>

          </div>


          {/* Mission */}
          <div className="mission-shine group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-2xl sm:p-9 lg:p-11">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-100 blur-3xl opacity-60" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Target size={27} />
                </div>

                <span className="text-5xl font-black text-slate-100">
                  02
                </span>

              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-[.2em] text-cyan-600">
                Our Mission
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                Connect. Lead. Grow.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                To promote collaboration, leadership, student participation,
                mutual support, and meaningful activities that contribute to
                the overall development of our members.
              </p>

              <div className="mt-7 h-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}
      <section className="px-5 py-24 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-cyan-700 sm:text-sm">
              <Sparkles size={15} />
              Our Core Values
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              What We Stand For
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              The principles that shape our community and guide everything
              we do.
            </p>

          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {values.map((value, index) => {

              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="mission-shine group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-3 hover:border-cyan-200 hover:shadow-[0_25px_60px_rgba(15,23,42,.1)]"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition duration-500 group-hover:rotate-6 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                      <Icon size={22} />
                    </div>

                    <span className="text-xs font-black text-slate-200">
                      0{index + 1}
                    </span>

                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {value.description}
                  </p>

                  <div className="mt-6 h-1 w-8 rounded-full bg-cyan-400 transition-all duration-500 group-hover:w-16" />

                </div>
              );

            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="px-5 pb-20 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="mission-shine relative overflow-hidden rounded-[2rem] bg-slate-900 px-7 py-12 text-center text-white shadow-2xl sm:px-10 sm:py-14 lg:px-16">

            {/* Glows */}
            <div className="mission-pulse absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[90px]" />

            <div className="mission-float absolute -left-5 bottom-8 hidden h-16 w-16 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 md:block" />

            <div className="mission-float-large absolute -right-5 top-8 hidden h-20 w-20 rounded-full border border-blue-400/10 bg-blue-400/5 md:block" />

            <div className="relative">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                <HeartHandshake size={27} />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-cyan-400 sm:text-sm">
                Together We Can
              </p>

              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
                Be Part of Something Bigger.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Every member has a voice, every idea has value, and every
                contribution can make a difference.
              </p>

              <Link
                to="/proposal"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_15px_40px_rgba(34,211,238,.2)] transition duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-[0_20px_50px_rgba(34,211,238,.3)] sm:text-base"
              >
                Share Your Idea

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Mission;

