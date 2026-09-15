import { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  BadgeCheck,
  Sparkles,
  AlertCircle,
  RefreshCw,
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
          HERO
      ===================================================== */}
      <section className="relative isolate overflow-hidden">

        {/* Background Glow */}
        <div className="absolute -left-32 -top-32 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl sm:h-80 sm:w-80" />

        <div className="absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute bottom-0 left-1/2 -z-10 h-40 w-72 -translate-x-1/2 rounded-full bg-cyan-200/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 text-center sm:px-6 sm:pb-18 sm:pt-16 md:px-10 md:pb-20 md:pt-20">

          {/* Badge */}
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/85 px-3.5 py-2 text-xs font-bold text-cyan-700 shadow-sm backdrop-blur sm:px-4 sm:text-sm">
            <Sparkles size={15} />
            MJPCSU • Leadership Team
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Committee
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 md:mt-6 md:text-lg">
            Meet the passionate students who contribute their time,
            leadership, and ideas to make our community stronger.
          </p>

          {/* Member Count */}
          {!loading && !errorMessage && (
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:px-5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                <Users size={14} className="text-emerald-600" />
              </span>

              <span className="text-xs font-bold text-slate-700 sm:text-sm">
                {members.length} Active Members
              </span>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 md:px-10">

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Loading committee members...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment
            </p>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && errorMessage && (
          <div className="mx-auto max-w-lg rounded-[1.75rem] border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {errorMessage}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-600 hover:shadow-lg"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && !errorMessage && members.length === 0 && (
          <div className="mx-auto max-w-lg rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <UserRound size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
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
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">

            {members.map((member, index) => (
              <div
                key={member.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-2xl sm:rounded-[2rem]"
              >

                {/* ================= TOP HEADER ================= */}
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 sm:h-36">

                  {/* Decorative Glow */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl transition duration-500 group-hover:scale-150" />

                  <div className="absolute -bottom-10 left-1/2 h-24 w-32 -translate-x-1/2 rounded-full bg-blue-500/10 blur-2xl" />

                  {/* Number */}
                  <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-cyan-300 backdrop-blur">
                    <span className="text-xs font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Active Badge */}
                  <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Active
                  </div>
                </div>

                {/* ================= PHOTO ================= */}
                <div className="relative -mt-16 flex justify-center sm:-mt-18">

                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.full_name}
                      className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl transition duration-300 group-hover:scale-105 sm:h-36 sm:w-36"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-500 to-blue-600 text-4xl font-black text-white shadow-xl transition duration-300 group-hover:scale-105 sm:h-36 sm:w-36">
                      {member.full_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* ================= INFORMATION ================= */}
                <div className="px-5 pb-7 pt-5 text-center sm:px-6 sm:pb-8">

                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {member.full_name}
                  </h2>

                  {/* Role */}
                  <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-cyan-50 px-3.5 py-1.5 text-xs font-bold text-cyan-700 sm:px-4 sm:text-sm">
                    <BadgeCheck size={15} />
                    <span className="truncate">
                      {member.role}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-slate-100" />

                  {/* Member ID */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Member ID
                    </p>

                    <p className="mt-1.5 break-all font-mono text-xs font-semibold text-slate-700 sm:text-sm">
                      {member.member_id}
                    </p>
                  </div>
                </div>

                {/* Bottom Hover Line */}
                <div className="h-1 w-0 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Committee;