import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Crown,
  Image,
  ShieldCheck,
  Sparkles,
  Users,
  Vote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Home() {
  const [photos, setPhotos] = useState([]);

  // Load latest 3 memory photos
  useEffect(() => {
    const getPhotos = async () => {
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

    getPhotos();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">

        {/* Background Glow */}
        <div className="absolute -left-40 -top-40 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl sm:h-[30rem] sm:w-[30rem]" />

        {/* Small Decorative Glow */}
        <div className="absolute bottom-0 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.035]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 md:px-10 md:pb-28 md:pt-28">

          {/* Badge */}
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/5 backdrop-blur sm:px-4 sm:text-sm">
            <Sparkles size={15} />
            MJPCSU Member Portal
          </div>

          {/* Heading */}
          <div className="mx-auto max-w-5xl text-center">

            <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Connect.
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {" "}
                Participate.
              </span>
              <br />
              Make an Impact.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base md:mt-7 md:text-lg md:leading-8">
              A private digital space for MJPCSU members to stay connected,
              participate in elections, discover activities, and preserve
              the memories that bring our community together.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row">

              <Link
                to="/election"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-1 hover:bg-cyan-400 hover:shadow-cyan-500/30 sm:px-7 sm:text-base"
              >
                <Vote size={18} />
                Explore Election

                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/committee"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/10 sm:px-7 sm:text-base"
              >
                <Users size={18} />
                Meet Committee
              </Link>

            </div>
          </div>

          {/* Hero Stats */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:mt-16 sm:grid-cols-3">

            <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.08] sm:p-5">
              <Users
                className="mx-auto text-cyan-400 transition-transform duration-300 group-hover:scale-110"
                size={22}
              />

              <p className="mt-3 text-sm font-semibold text-slate-300">
                Connected
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Student Community
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.08] sm:p-5">
              <Vote
                className="mx-auto text-cyan-400 transition-transform duration-300 group-hover:scale-110"
                size={22}
              />

              <p className="mt-3 text-sm font-semibold text-slate-300">
                Democratic
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Member Elections
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.08] sm:p-5">
              <Image
                className="mx-auto text-cyan-400 transition-transform duration-300 group-hover:scale-110"
                size={22}
              />

              <p className="mt-3 text-sm font-semibold text-slate-300">
                Memories
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Moments Together
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-10">

        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">

          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3.5 py-2 text-xs font-bold text-cyan-700 sm:px-4 sm:text-sm">
              <ShieldCheck size={16} />
              About MJPCSU
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              A community built around{" "}
              <span className="text-cyan-600">
                people.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              MJPCSU is a student union created to build a strong,
              connected, and active student community. Our goal is to
              encourage participation, leadership, collaboration, and
              meaningful experiences for every member.
            </p>

            <Link
              to="/mission"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 transition hover:text-cyan-700 sm:mt-7 sm:text-base"
            >
              Discover our mission

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* About Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">

            <div className="group rounded-3xl bg-slate-900 p-5 text-white shadow-xl transition duration-300 hover:-translate-y-1 sm:p-7">
              <Users
                size={27}
                className="text-cyan-400 transition-transform duration-300 group-hover:scale-110"
              />

              <h3 className="mt-6 text-lg font-bold sm:mt-8 sm:text-xl">
                Community
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                Stay connected with fellow members.
              </p>
            </div>

            <div className="group mt-6 rounded-3xl bg-cyan-500 p-5 text-slate-950 shadow-xl transition duration-300 hover:-translate-y-1 sm:mt-8 sm:p-7">
              <Crown
                size={27}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              <h3 className="mt-6 text-lg font-bold sm:mt-8 sm:text-xl">
                Leadership
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-800/70 sm:text-sm sm:leading-6">
                Develop leadership through participation.
              </p>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
              <Vote
                size={27}
                className="text-cyan-600 transition-transform duration-300 group-hover:scale-110"
              />

              <h3 className="mt-6 text-lg font-bold sm:mt-8 sm:text-xl">
                Elections
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                Take part in the democratic process.
              </p>
            </div>

            <div className="group mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:mt-8 sm:p-7">
              <Image
                size={27}
                className="text-cyan-600 transition-transform duration-300 group-hover:scale-110"
              />

              <h3 className="mt-6 text-lg font-bold sm:mt-8 sm:text-xl">
                Memories
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                Preserve moments worth remembering.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          CURRENT COMMITTEE
      ===================================================== */}
      <section className="bg-slate-900 px-4 py-16 text-white sm:px-6 sm:py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
                <Crown size={16} />
                Leadership
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                Current Committee
              </h2>

              <p className="mt-3 text-sm text-slate-400 sm:text-base">
                Meet the people helping shape our community.
              </p>
            </div>

            <Link
              to="/committee"
              className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-cyan-400 transition hover:text-cyan-300 sm:text-base"
            >
              View Full Committee

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* Committee Cards */}
          <div className="mt-9 grid gap-4 sm:gap-5 md:grid-cols-3">

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
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.08] sm:p-7"
                >

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-400/20 transition duration-300 group-hover:scale-105 group-hover:ring-cyan-400/40 sm:h-24 sm:w-24">
                    <Icon
                      size={29}
                      className="text-cyan-400 sm:h-8 sm:w-8"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-bold sm:mt-6 sm:text-xl">
                    {member.role}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                    Committee Member
                  </p>

                </div>
              );
            })}

          </div>
        </div>
      </section>


      {/* =====================================================
          ELECTION
      ===================================================== */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white shadow-2xl sm:p-8 md:rounded-[2rem] md:p-12">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl sm:h-64 sm:w-64" />

            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-900/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-xs font-bold backdrop-blur sm:px-4 sm:text-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-300" />
                  Election Status
                </div>

                <h2 className="mt-4 text-2xl font-black sm:text-3xl md:mt-5 md:text-4xl">
                  No Active Election
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-cyan-50 sm:leading-7">
                  There is currently no active election. When an election
                  starts, voting information and participation details will
                  appear here.
                </p>

              </div>

              <Link
                to="/election"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-cyan-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-slate-50 sm:px-6 sm:py-3.5 sm:text-base"
              >
                Go to Election
                <ArrowRight size={17} />
              </Link>

            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          MEMORIES
      ===================================================== */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-10">

        <div className="mx-auto max-w-7xl">

          {/* Section Header */}
          <div className="text-center">

            <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 sm:px-4 sm:text-sm">
              <Image size={16} />
              Community Memories
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Moments Worth Remembering
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
              A glimpse of the experiences and moments that bring our
              community together.
            </p>

          </div>

          {/* Real Memory Photos */}
          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 md:grid-cols-3">

            {photos.length > 0 ? (
              photos.map((photo) => {

                const { data } = supabase.storage
                  .from("mjpcsu-media")
                  .getPublicUrl(`memories/photos/${photo.name}`);

                return (
                  <Link
                    key={photo.id || photo.name}
                    to="/memories"
                    className="group relative block h-56 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-64"
                  >

                    <img
                      src={data.publicUrl}
                      alt="MJPCSU Memory"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">

                      <div>
                        <p className="text-sm font-bold text-white">
                          MJPCSU Memory
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          View all memories
                        </p>
                      </div>

                    </div>

                  </Link>
                );
              })
            ) : (
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex h-56 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 sm:h-64"
                >
                  <div className="text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                      <Image size={25} />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-400">
                      Memory Image
                    </p>

                  </div>
                </div>
              ))
            )}

          </div>

          {/* View All */}
          <div className="mt-7 text-center sm:mt-8">

            <Link
              to="/memories"
              className="group inline-flex items-center gap-2 text-sm font-bold text-cyan-600 transition hover:text-cyan-700 sm:text-base"
            >
              Explore All Memories

              <ChevronRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>
      </section>


      {/* =====================================================
          QUICK ACCESS
      ===================================================== */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 md:px-10">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 sm:text-sm">
            Everything in one place
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl md:text-4xl">
            Your MJPCSU Portal
          </h2>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5 sm:gap-3">

            <Link
              to="/mission"
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:text-cyan-600 sm:px-5 sm:py-3 sm:text-sm"
            >
              Our Mission
            </Link>

            <Link
              to="/committee"
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:text-cyan-600 sm:px-5 sm:py-3 sm:text-sm"
            >
              Committee
            </Link>

            <Link
              to="/election"
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:text-cyan-600 sm:px-5 sm:py-3 sm:text-sm"
            >
              Election
            </Link>

            <Link
              to="/proposal"
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:text-cyan-600 sm:px-5 sm:py-3 sm:text-sm"
            >
              Proposal
            </Link>

          </div>

        </div>
      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-slate-200 bg-white px-4 py-7 sm:px-6 sm:py-8 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">

          <div>
            <p className="font-bold text-slate-900">
              MJPCSU
            </p>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Member Portal
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
            <CheckCircle2 size={15} />
            © 2026 MJPCSU. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;