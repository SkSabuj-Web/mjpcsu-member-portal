
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
    <div className="min-h-screen overflow-hidden bg-slate-50">

      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -left-32 -top-32 -z-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-32 top-20 -z-10 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center md:px-10 md:pt-24">

          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm backdrop-blur">
            <Sparkles size={16} />
            MJPCSU • Our Purpose
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
            Building a{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Stronger
            </span>{" "}
            Student Community.
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Connecting students, developing leaders, and creating meaningful
            opportunities that inspire everyone to{" "}
            <span className="font-semibold text-slate-800">
              connect, lead, and grow.
            </span>
          </p>

          {/* Mini Stats */}
          <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-3">
            <span className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
              🤝 Community
            </span>

            <span className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
              🚀 Leadership
            </span>

            <span className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
              🌱 Growth
            </span>
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl md:p-12">

          {/* Glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">

            <div>
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
                <HeartHandshake size={18} />
                Who We Are
              </div>

              <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
                More Than a Union.
                <span className="text-cyan-400">
                  {" "}
                  We Are a Community.
                </span>
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Modern Jurassic Park Central Student's Union (MJPCSU) is a
                student-focused community built to connect people, encourage
                teamwork, develop leadership, and create meaningful
                opportunities for students to participate, contribute, and
                grow together.
              </p>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/10 md:flex">
              <Users size={52} className="text-cyan-400" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="mx-auto mt-8 grid max-w-6xl gap-6 px-6 md:grid-cols-2 md:px-10">

        {/* Vision */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 p-8 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-10">

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Eye size={28} />
            </div>

            <p className="text-sm font-bold uppercase tracking-widest text-cyan-100">
              Our Vision
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              A Stronger Student Community
            </h2>

            <p className="mt-5 leading-8 text-cyan-50">
              To build an inclusive and supportive student community where
              every member can contribute, grow, lead, and create a positive
              impact.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-2xl md:p-10">

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <Target size={28} />
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-cyan-600">
            Our Mission
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Connect. Lead. Grow.
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            To promote collaboration, leadership, student participation,
            mutual support, and meaningful activities that contribute to the
            overall development of our members.
          </p>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="mx-auto mt-20 max-w-6xl px-6 pb-20 md:px-10">

        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">
            <Sparkles size={16} />
            Our Core Values
          </div>

          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            What We Stand For
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
            The principles that shape our community and guide everything we
            do.
          </p>
        </div>

        {/* Value Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-8 py-12 text-center text-white md:px-16">

          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">
              Together We Can
            </p>

            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black md:text-4xl">
              Be Part of Something Bigger.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Every member has a voice, every idea has value, and every
              contribution can make a difference.
            </p>

            <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 hover:shadow-cyan-500/30">
              Connect With Us
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Mission;

