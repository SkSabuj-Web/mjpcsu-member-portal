import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Heart, PartyPopper } from "lucide-react";

function Memories() {
  const [photos, setPhotos] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reactionLoading, setReactionLoading] = useState(null);

  // --------------------------------
  // Load Memories + Reactions
  // --------------------------------
  const getMemories = async () => {
    setLoading(true);

    // Get memories
    const { data: memoriesData, error: memoriesError } = await supabase
      .from("memories")
      .select("id, title, media_url, media_type")
      .order("created_at", { ascending: false });

    if (memoriesError) {
      console.log("Error loading memories:", memoriesError);
      setLoading(false);
      return;
    }

    // Get reactions
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
  // Get Current User
  // --------------------------------
  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  };

  // --------------------------------
  // Handle Reaction
  // --------------------------------
  const handleReaction = async (memoryId, reactionType) => {
    if (reactionLoading === memoryId) return;

    setReactionLoading(memoryId);

    const user = await getCurrentUser();

    if (!user) {
      console.log("User not logged in");
      setReactionLoading(null);
      return;
    }

    // Check user's existing reaction
    const existingReaction = reactions.find(
      (reaction) =>
        reaction.memory_id === memoryId &&
        reaction.member_id === user.id
    );

    try {
      // --------------------------------
      // Same reaction → Remove
      // --------------------------------
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
          prev.filter((reaction) => reaction.id !== existingReaction.id)
        );
      }

      // --------------------------------
      // Different reaction → Update
      // --------------------------------
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

      // --------------------------------
      // No reaction → Insert
      // --------------------------------
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
  // Check User Reaction
  // --------------------------------
  const hasUserReacted = (memoryId, type) => {
    return reactions.some(
      (reaction) =>
        reaction.memory_id === memoryId &&
        reaction.reaction_type === type
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            MJPCSU Gallery
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Our Memories
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            A collection of memorable moments, events and activities of
            MJPCSU members.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>

              <p className="text-sm text-slate-400">
                Loading memories...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && photos.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="text-center">
              <div className="mb-4 text-5xl">
                📸
              </div>

              <h2 className="text-xl font-semibold">
                No Memories Yet
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Photos will appear here when they are uploaded.
              </p>
            </div>
          </div>
        )}

        {/* Gallery */}
        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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

              return (
                <div
                  key={memory.id}
                  className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-cyan-500/10"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={data.publicUrl}
                      alt={memory.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Reaction Area */}
                  <div className="border-t border-slate-800 p-3">

                    <div className="flex items-center justify-between gap-2">

                      {/* Like */}
                      <button
                        type="button"
                        disabled={reactionLoading === memory.id}
                        onClick={() =>
                          handleReaction(memory.id, "like")
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                          userLiked
                            ? "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
                            : "bg-slate-800 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400"
                        }`}
                      >
                        <Heart
                          size={18}
                          className={
                            userLiked ? "fill-current" : ""
                          }
                        />

                        <span>Like</span>

                        {likeCount > 0 && (
                          <span className="text-xs">
                            {likeCount}
                          </span>
                        )}
                      </button>

                      {/* Celebrate */}
                      <button
                        type="button"
                        disabled={reactionLoading === memory.id}
                        onClick={() =>
                          handleReaction(memory.id, "celebrate")
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                          userCelebrated
                            ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
                            : "bg-slate-800 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400"
                        }`}
                      >
                        <PartyPopper size={18} />

                        <span>Celebrate</span>

                        {celebrateCount > 0 && (
                          <span className="text-xs">
                            {celebrateCount}
                          </span>
                        )}
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Memories;