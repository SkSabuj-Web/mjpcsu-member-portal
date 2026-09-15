import {
  Users,
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
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
          HERO
      ===================================================== */}
      <section className="relative isolate overflow-hidden">

        {/* Background Glow */}
        <div className="absolute -left-32 -top-32 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl sm:h-80 sm:w-80" />

        <div className="absolute -right-32 top-20 -z-10 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl sm:h-96 sm:w-96" />

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -z-10 h-40 w-72 -translate-x-1/2 rounded-full bg-cyan-200/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-20 md:px-10 md:pt-24">

          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur sm:px-4 sm:text-sm">
            <Sparkles size={15} />
            MJPCSU • Our Purpose
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Building a{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Stronger
            </span>{" "}
            Student Community.
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 md:mt-7 md:text-lg">
            Connecting students, developing leaders, and creating meaningful
            opportunities that inspire everyone to{" "}
            <span className="font-semibold text-slate-800">
              connect, lead, and grow.
            </span>
          </p>

          {/* Mini Stats */}
          <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2.5 sm:mt-10 sm:gap-3">

            <span className="rounded-full bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:ring-cyan-200 sm:px-5 sm:text-sm">
              🤝 Community
            </span>

            <span className="rounded-full bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:ring-cyan-200 sm:px-5 sm:text-sm">
              🚀 Leadership
            </span>

            <span className="rounded-full bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:ring-cyan-200 sm:px-5 sm:text-sm">
              🌱 Growth
            </span>

          </div>
        </div>
      </section>


      {/* =====================================================
          WHO WE ARE
      ===================================================== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10">

        <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-900 p-6 text-white shadow-xl sm:p-8 md:rounded-[2rem] md:p-12">

          {/* Glow */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl sm:h-64 sm:w-64" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-10">

            <div>

              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                <HeartHandshake size={17} />
                Who We Are
              </div>

              <h2 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                More Than a Union.
                <span className="text-cyan-400">
                  {" "}
                  We Are a Community.
                </span>
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
                Modern Jurassic Park Central Student's Union (MJPCSU) is a
                student-focused community built to connect people, encourage
                teamwork, develop leadership, and create meaningful
                opportunities for students to participate, contribute, and
                grow together.
              </p>

            </div>

            {/* Icon */}
            <div className="hidden h-24 w-24 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/10 md:flex lg:h-28 lg:w-28">
              <Users
                size={46}
                className="text-cyan-400 transition duration-300 hover:scale-110"
              />
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          VISION & MISSION
      ===================================================== */}
      <section className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 sm:mt-8 sm:gap-6 sm:px-6 md:grid-cols-2 md:px-10">

        {/* Vision */}
        <div className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 md:rounded-[2rem] md:p-10">

          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl sm:h-48 sm:w-48" />

          <div className="relative">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition duration-300 group-hover:scale-105 sm:mb-6 sm:h-14 sm:w-14">
              <Eye size={26} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100 sm:text-sm">
              Our Vision
            </p>

            <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
              A Stronger Student Community
            </h2>

            <p className="mt-4 text-sm leading-7 text-cyan-50 sm:mt-5 sm:text-base sm:leading-8">
              To build an inclusive and supportive student community where
              every member can contribute, grow, lead, and create a positive
              impact.
            </p>

          </div>
        </div>


        {/* Mission */}
        <div className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-2xl sm:p-8 md:rounded-[2rem] md:p-10">

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 transition duration-300 group-hover:scale-105 sm:mb-6 sm:h-14 sm:w-14">
            <Target size={26} />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 sm:text-sm">
            Our Mission
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            Connect. Lead. Grow.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">
            To promote collaboration, leadership, student participation,
            mutual support, and meaningful activities that contribute to the
            overall development of our members.
          </p>

        </div>
      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}
      <section className="mx-auto mt-16 max-w-6xl px-4 pb-16 sm:mt-20 sm:px-6 sm:pb-20 md:px-10">

        {/* Header */}
        <div className="text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3.5 py-2 text-xs font-bold text-cyan-700 sm:px-4 sm:text-sm">
            <Sparkles size={15} />
            Our Core Values
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            What We Stand For
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-4 sm:text-base sm:leading-7">
            The principles that shape our community and guide everything we
            do.
          </p>
        </div>

        {/* Value Cards */}
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">

          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-xl sm:p-6"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-cyan-500/20 sm:h-12 sm:w-12">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 sm:mt-6 sm:text-xl">
                  {value.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-500 sm:mt-3 sm:text-sm sm:leading-7">
                  {value.description}
                </p>

              </div>
            );
          })}

        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 md:px-10">

        <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-900 px-6 py-10 text-center text-white sm:px-8 sm:py-12 md:rounded-[2rem] md:px-16">

          {/* Glow */}
          <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl sm:h-64 sm:w-64" />

          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Together We Can
            </p>

            <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
              Be Part of Something Bigger.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              Every member has a voice, every idea has value, and every
              contribution can make a difference.
            </p>

            <Link
              to="/proposal"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-1 hover:bg-cyan-400 hover:shadow-cyan-500/30 sm:mt-8 sm:px-6 sm:py-3 sm:text-base"
            >
              Connect With Us

              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Mission;