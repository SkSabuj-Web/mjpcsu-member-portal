
import { useEffect, useState } from "react";
import {
  Heart,
  PartyPopper,
  Sparkles,
  Camera,
  RefreshCw,
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
          BACKGROUND EFFECTS
      ===================================================== */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative">

        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 text-center sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pt-20">

          {/* Badge */}
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-400 shadow-lg shadow-cyan-500/5 sm:text-sm">
            <Sparkles size={15} />
            MJPCSU Gallery
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Memories
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Moments, events and experiences that bring the MJPCSU community
            together.
          </p>

          {/* Gallery Count */}
          {!loading && photos.length > 0 && (
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2.5 shadow-xl shadow-black/20 backdrop-blur">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10">
                <Camera size={14} className="text-cyan-400" />
              </span>

              <span className="text-xs font-semibold text-slate-300 sm:text-sm">
                {photos.length}{" "}
                {photos.length === 1 ? "Memory" : "Memories"}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[320px] flex-col items-center justify-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-400">
              Loading memories...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && photos.length === 0 && (
          <div className="mx-auto flex min-h-[320px] max-w-lg items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-12 shadow-2xl">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-cyan-400">
                <Camera size={30} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                No Memories Yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Photos will appear here when they are uploaded.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            GALLERY
        ===================================================== */}
        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">

            {photos.map((memory) => {
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
                  className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/5"
                >

                  {/* ================= IMAGE ================= */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">

                    <img
                      src={data.publicUrl}
                      alt="MJPCSU Memory"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10 opacity-70 transition duration-300 group-hover:opacity-90" />

                    {/* Top Badge */}
                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50 text-cyan-400 shadow-lg backdrop-blur-md">
                      <Camera size={16} />
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 ring-1 ring-inset ring-cyan-400/0 transition duration-300 group-hover:opacity-100 group-hover:ring-cyan-400/20" />

                    {/* Reaction Loading */}
                    {isReacting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 shadow-xl">
                          <RefreshCw
                            size={18}
                            className="animate-spin text-cyan-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ================= REACTIONS ================= */}
                  <div className="border-t border-slate-800 bg-slate-900/95 p-3 backdrop-blur sm:p-4">

                    <div className="flex items-center gap-2">

                      {/* Like */}
                      <button
                        type="button"
                        disabled={isReacting}
                        onClick={() =>
                          handleReaction(memory.id, "like")
                        }
                        className={`group/like flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-xs font-bold transition-all duration-200 sm:gap-2 sm:text-sm ${
                          userLiked
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-lg shadow-rose-500/5"
                            : "border-slate-700 bg-slate-800/80 text-slate-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <Heart
                          size={17}
                          className={`shrink-0 transition duration-200 ${
                            userLiked
                              ? "fill-current"
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

                      {/* Celebrate */}
                      <button
                        type="button"
                        disabled={isReacting}
                        onClick={() =>
                          handleReaction(memory.id, "celebrate")
                        }
                        className={`group/celebrate flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2.5 text-xs font-bold transition-all duration-200 sm:gap-2 sm:text-sm ${
                          userCelebrated
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg shadow-amber-500/5"
                            : "border-slate-700 bg-slate-800/80 text-slate-400 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <PartyPopper
                          size={17}
                          className="shrink-0 transition duration-200 group-hover/celebrate:rotate-6 group-hover/celebrate:scale-110"
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
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500 group-hover:w-full" />
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

