
import { useEffect, useState } from "react";
import {
  Heart,
  PartyPopper,
  Sparkles,
  Camera,
  RefreshCw,
  Images,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";

function Memories() {
  const [photos, setPhotos] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reactionLoading, setReactionLoading] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // --------------------------------
  // Get Current User
  // --------------------------------
  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  };

  // --------------------------------
  // Load Memories + Reactions
  // --------------------------------
  const getMemories = async () => {
    setLoading(true);

    const user = await getCurrentUser();
    setCurrentUser(user);

    const { data: memoriesData, error: memoriesError } = await supabase
      .from("memories")
      .select("id, title, media_url, media_type")
      .order("created_at", { ascending: false });

    if (memoriesError) {
      console.log("Error loading memories:", memoriesError);
      setLoading(false);
      return;
    }

    const { data: reactionsData, error: reactionsError } = await supabase
      .from("memory_reactions")
      .select("id, memory_id, member_id, reaction_type");

    if (reactionsError) {
      console.log("Error loading reactions:", reactionsError);
    }

    setPhotos(memoriesData || []);
    setReactions(reactionsData || []);
    setLoading(false);
  };

  useEffect(() => {
    getMemories();
  }, []);

  // --------------------------------
  // Handle Reaction
  // --------------------------------
  const handleReaction = async (memoryId, reactionType) => {
    if (reactionLoading === memoryId) return;

    setReactionLoading(memoryId);

    const user = currentUser || (await getCurrentUser());

    if (!user) {
      console.log("User not logged in");
      setReactionLoading(null);
      return;
    }

    setCurrentUser(user);

    const existingReaction = reactions.find(
      (reaction) =>
        reaction.memory_id === memoryId &&
        reaction.member_id === user.id
    );

    try {
      // Same reaction → Remove
      if (
        existingReaction &&
        existingReaction.reaction_type === reactionType
      ) {
        const { error } = await supabase
          .from("memory_reactions")
          .delete()
          .eq("id", existingReaction.id);

        if (error) {
          console.log("Delete reaction error:", error);
          return;
        }

        setReactions((prev) =>
          prev.filter(
            (reaction) => reaction.id !== existingReaction.id
          )
        );
      }

      // Different reaction → Update
      else if (existingReaction) {
        const { data, error } = await supabase
          .from("memory_reactions")
          .update({
            reaction_type: reactionType,
          })
          .eq("id", existingReaction.id)
          .select()
          .single();

        if (error) {
          console.log("Update reaction error:", error);
          return;
        }

        setReactions((prev) =>
          prev.map((reaction) =>
            reaction.id === existingReaction.id ? data : reaction
          )
        );
      }

      // No reaction → Insert
      else {
        const { data, error } = await supabase
          .from("memory_reactions")
          .insert({
            memory_id: memoryId,
            member_id: user.id,
            reaction_type: reactionType,
          })
          .select()
          .single();

        if (error) {
          console.log("Insert reaction error:", error);
          return;
        }

        setReactions((prev) => [...prev, data]);
      }
    } finally {
      setReactionLoading(null);
    }
  };

  // --------------------------------
  // Reaction Count
  // --------------------------------
  const getReactionCount = (memoryId, type) => {
    return reactions.filter(
      (reaction) =>
        reaction.memory_id === memoryId &&
        reaction.reaction_type === type
    ).length;
  };

  // --------------------------------
  // Check Current User Reaction
  // --------------------------------
  const hasUserReacted = (memoryId, type) => {
    if (!currentUser) return false;

    return reactions.some(
      (reaction) =>
        reaction.memory_id === memoryId &&
        reaction.member_id === currentUser.id &&
        reaction.reaction_type === type
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* =====================================================
          ANIMATION + CUSTOM CSS
      ===================================================== */}
      <style>{`
        @keyframes memoryFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes memoryFloatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-18px) rotate(5deg);
          }
        }

        @keyframes memoryPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .25;
          }
          50% {
            transform: scale(1.18);
            opacity: .5;
          }
        }

        @keyframes memorySpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes memoryShine {
          0% {
            transform: translateX(-130%);
          }
          45%, 100% {
            transform: translateX(130%);
          }
        }

        @keyframes memoryFade {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .memory-float {
          animation: memoryFloat 5s ease-in-out infinite;
        }

        .memory-float-slow {
          animation: memoryFloatSlow 7s ease-in-out infinite;
        }

        .memory-pulse {
          animation: memoryPulse 5s ease-in-out infinite;
        }

        .memory-spin {
          animation: memorySpin 24s linear infinite;
        }

        .memory-fade {
          animation: memoryFade .8s ease-out both;
        }

        .memory-grid {
          background-image:
            linear-gradient(rgba(34,211,238,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,.045) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .memory-shine {
          position: relative;
          overflow: hidden;
        }

        .memory-shine::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 35%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.13),
            transparent
          );
          transform: translateX(-130%);
          animation: memoryShine 6s ease-in-out infinite;
          pointer-events: none;
        }

        .memory-card {
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
          BACKGROUND
      ===================================================== */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />

        <div className="memory-grid absolute inset-0 opacity-70" />

        <div className="memory-pulse absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="memory-pulse absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-blue-600/10 blur-[110px]" />

        <div className="memory-pulse absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[100px]" />

      </div>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative isolate overflow-hidden">

        {/* Floating Particles */}
        <div className="memory-float absolute left-[8%] top-[25%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.8)]" />

        <div className="memory-float-slow absolute right-[12%] top-[22%] h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,.7)]" />

        <div className="memory-float absolute bottom-[10%] left-[20%] h-1.5 w-1.5 rounded-full bg-indigo-400" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_.7fr]">

            {/* LEFT */}
            <div className="memory-fade text-center lg:text-left">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-cyan-400 shadow-lg shadow-cyan-500/5 backdrop-blur-xl sm:text-sm">
                <Sparkles size={15} />
                MJPCSU Gallery
              </div>

              <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-6xl lg:mx-0 lg:text-7xl">
                Our{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Memories
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:mx-0 lg:text-lg">
                Moments, events and experiences that bring the MJPCSU
                community together.
              </p>

              {/* Feature Pills */}
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-xs font-bold text-slate-300 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:text-cyan-400 sm:text-sm">
                  <Camera size={15} />
                  Events
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-xs font-bold text-slate-300 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:text-blue-400 sm:text-sm">
                  <Users size={15} />
                  Community
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-xs font-bold text-slate-300 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:text-indigo-400 sm:text-sm">
                  <Sparkles size={15} />
                  Moments
                </div>

              </div>

              {/* Count */}
              {!loading && photos.length > 0 && (
                <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2.5 shadow-xl shadow-black/20 backdrop-blur">

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10">
                    <Images size={14} className="text-cyan-400" />
                  </span>

                  <span className="text-xs font-bold text-slate-300 sm:text-sm">
                    {photos.length}{" "}
                    {photos.length === 1 ? "Memory" : "Memories"}
                  </span>

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                </div>
              )}
            </div>

            {/* RIGHT 3D VISUAL */}
            <div className="memory-card relative mx-auto flex h-[300px] w-full max-w-[390px] items-center justify-center sm:h-[350px]">

              {/* Orbit */}
              <div className="memory-spin absolute h-60 w-60 rounded-full border border-cyan-400/15 sm:h-72 sm:w-72" />

              <div
                className="memory-spin absolute h-44 w-44 rounded-full border border-blue-400/15 sm:h-56 sm:w-56"
                style={{ animationDirection: "reverse" }}
              />

              {/* Glow */}
              <div className="memory-pulse absolute h-48 w-48 rounded-full bg-cyan-500/20 blur-[80px]" />

              {/* Main Visual */}
              <div className="memory-float relative z-10 w-[270px] rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_35px_80px_rgba(0,0,0,.4)] backdrop-blur-2xl sm:w-[300px] sm:p-6">

                <div className="flex items-center justify-between">

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-[.18em] text-slate-500">
                    Memory Hub
                  </span>

                </div>

                {/* Image Icon */}
                <div className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-[0_20px_45px_rgba(34,211,238,.2)] sm:h-24 sm:w-24">
                  <Images size={40} />
                </div>

                <div className="mt-5 text-center">

                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-400">
                    MJPCSU
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                    Moments Together
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Every moment becomes a memory.
                  </p>

                </div>

                {/* Mini Stats */}
                {/* <div className="mt-5 grid grid-cols-3 gap-2">

                  <div className="rounded-xl bg-cyan-400/5 p-3 text-center">
                    <Camera size={17} className="mx-auto text-cyan-400" />
                    <p className="mt-1.5 text-[9px] font-bold text-slate-500">
                      Events
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-400/5 p-3 text-center">
                    <Users size={17} className="mx-auto text-blue-400" />
                    <p className="mt-1.5 text-[9px] font-bold text-slate-500">
                      People
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-400/5 p-3 text-center">
                    <Heart size={17} className="mx-auto text-indigo-400" />
                    <p className="mt-1.5 text-[9px] font-bold text-slate-500">
                      Memories
                    </p>
                  </div>

                </div> */}

              </div>

              {/* Floating Badge */}
              <div className="memory-float-slow absolute -left-1 top-10 hidden rounded-2xl border border-cyan-500/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Camera size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-500">
                      Captured
                    </p>

                    <p className="text-xs font-black text-white">
                      Moments
                    </p>
                  </div>

                </div>
              </div>

              {/* Floating Reaction */}
              <div className="memory-float absolute -bottom-1 -right-1 hidden rounded-2xl border border-rose-500/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                    <Heart size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-500">
                      Community
                    </p>

                    <p className="text-xs font-black text-white">
                      Reactions
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-slate-950 to-transparent" />

      </section>

      {/* =====================================================
          GALLERY HEADER
      ===================================================== */}
      {!loading && photos.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">

          <div className="memory-shine relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-[80px]" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-cyan-400">
                  <Images size={16} />
                  Community Gallery
                </div>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Moments Worth Remembering
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Explore the moments shared by the MJPCSU community and
                  celebrate the memories together.
                </p>

              </div>

              <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-cyan-400 shadow-lg sm:flex">
                <Camera size={24} />
              </div>

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10">

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[320px] flex-col items-center justify-center">

            <div className="memory-float flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-slate-800 bg-slate-900 shadow-2xl">

              <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

            </div>

            <p className="mt-5 text-sm font-bold text-slate-400">
              Loading memories...
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Preparing your community gallery
            </p>

          </div>
        )}

        {/* Empty */}
        {!loading && photos.length === 0 && (
          <div className="memory-shine mx-auto flex min-h-[340px] max-w-lg items-center justify-center rounded-[2rem] border border-slate-800 bg-slate-900/70 px-6 py-12 shadow-2xl">

            <div className="text-center">

              <div className="memory-float mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-800 text-cyan-400 shadow-xl">
                <Camera size={32} />
              </div>

              <h2 className="mt-6 text-2xl font-black text-white">
                No Memories Yet
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                Photos will appear here when they are uploaded to the
                MJPCSU gallery.
              </p>

            </div>
          </div>
        )}

        {/* =====================================================
            GALLERY
        ===================================================== */}
        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {photos.map((memory, index) => {

              const { data } = supabase.storage
                .from("mjpcsu-media")
                .getPublicUrl(memory.media_url);

              const likeCount = getReactionCount(memory.id, "like");

              const celebrateCount = getReactionCount(
                memory.id,
                "celebrate"
              );

              const userLiked = hasUserReacted(memory.id, "like");

              const userCelebrated = hasUserReacted(
                memory.id,
                "celebrate"
              );

              const isReacting = reactionLoading === memory.id;

              return (
                <div
                  key={memory.id}
                  className="memory-card memory-shine group relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-xl shadow-black/20 transition-all duration-500 hover:-translate-y-3 hover:border-cyan-500/30 hover:shadow-[0_30px_70px_rgba(34,211,238,.08)]"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >

                  {/* ================= IMAGE ================= */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">

                    <img
                      src={data.publicUrl}
                      alt="MJPCSU Memory"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/5 to-slate-950/10 opacity-80 transition duration-500 group-hover:opacity-100" />

                    {/* Number
                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/55 text-cyan-300 shadow-lg backdrop-blur-md">
                      <span className="text-[10px] font-black">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div> */}

                    {/* Camera */}
                    <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/55 text-white shadow-lg backdrop-blur-md transition duration-300 group-hover:text-cyan-400">
                      <Camera size={15} />
                    </div>

                    {/* Bottom Image Label */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">

                      <div>

                        <p className="text-[9px] font-black uppercase tracking-[.18em] text-cyan-300">
                          
                        </p>

                        <p className="mt-1 text-xs font-bold text-white/90">
                          
                        </p>

                      </div>

                      

                    </div>

                    {/* Hover Ring */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-transparent transition duration-500 group-hover:ring-cyan-400/25" />

                    {/* Reaction Loading */}
                    {isReacting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 shadow-2xl">
                          <RefreshCw
                            size={19}
                            className="animate-spin text-cyan-400"
                          />
                        </div>

                      </div>
                    )}

                  </div>

                  {/* ================= REACTIONS ================= */}
                  <div className="border-t border-slate-800 bg-slate-900/95 p-3 backdrop-blur sm:p-4">

                    <div className="flex items-center gap-2">

                      {/* LIKE */}
                      <button
                        type="button"
                        disabled={isReacting}
                        onClick={() =>
                          handleReaction(memory.id, "like")
                        }
                        className={`group/like flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-xs font-bold transition-all duration-300 sm:gap-2 sm:text-sm ${
                          userLiked
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-lg shadow-rose-500/5"
                            : "border-slate-700 bg-slate-800/70 text-slate-400 hover:-translate-y-0.5 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >

                        <Heart
                          size={17}
                          className={`shrink-0 transition duration-300 ${
                            userLiked
                              ? "fill-current scale-110"
                              : "group-hover/like:scale-110"
                          }`}
                        />

                        <span>Like</span>

                        {likeCount > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                              userLiked
                                ? "bg-rose-500/15"
                                : "bg-slate-700"
                            }`}
                          >
                            {likeCount}
                          </span>
                        )}

                      </button>

                      {/* CELEBRATE */}
                      <button
                        type="button"
                        disabled={isReacting}
                        onClick={() =>
                          handleReaction(memory.id, "celebrate")
                        }
                        className={`group/celebrate flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-xs font-bold transition-all duration-300 sm:gap-2 sm:text-sm ${
                          userCelebrated
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/5"
                            : "border-slate-700 bg-slate-800/70 text-slate-400 hover:-translate-y-0.5 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >

                        <PartyPopper
                          size={17}
                          className="shrink-0 transition duration-300 group-hover/celebrate:rotate-6 group-hover/celebrate:scale-110"
                        />

                        <span>Celebrate</span>

                        {celebrateCount > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                              userCelebrated
                                ? "bg-amber-500/15"
                                : "bg-slate-700"
                            }`}
                          >
                            {celebrateCount}
                          </span>
                        )}

                      </button>

                    </div>

                    {/* Reaction Summary */}
                    {(likeCount > 0 || celebrateCount > 0) && (
                      <div className="mt-3 flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-[.12em] text-slate-600">

                        {likeCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Heart
                              size={10}
                              className="fill-rose-400 text-rose-400"
                            />
                            {likeCount} Likes
                          </span>
                        )}

                        {celebrateCount > 0 && (
                          <span className="flex items-center gap-1">
                            <PartyPopper
                              size={10}
                              className="text-amber-400"
                            />
                            {celebrateCount} Celebrations
                          </span>
                        )}

                      </div>
                    )}

                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700 group-hover:w-full" />

                </div>
              );
            })}
          </div>
        )}

      </section>
    </div>
  );
}

export default Memories;

