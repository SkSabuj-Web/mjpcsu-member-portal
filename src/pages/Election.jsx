
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Crown,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Vote,
  X,
  Trophy,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function Election() {
  const { user } = useAuth();

  // =====================================================
  // STATES
  // =====================================================

  const [elections, setElections] = useState([]);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [members, setMembers] = useState([]);
  const [myVotes, setMyVotes] = useState([]);
  const [results, setResults] = useState([]);

  const [selectedElection, setSelectedElection] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Election form
  const [electionName, setElectionName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Position
  const [positionName, setPositionName] = useState("");

  // Candidate
  const [candidateMember, setCandidateMember] = useState("");
  const [manifesto, setManifesto] = useState("");

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (user) {
      loadPageData();
    }
  }, [user]);

  // =====================================================
  // LOAD EVERYTHING
  // =====================================================

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError("");

      // -------------------------------------------------
      // Current member
      // -------------------------------------------------

      const { data: member, error: memberError } =
        await supabase
          .from("members")
          .select(
            "id, member_id, full_name, email, role, is_active"
          )
          .eq("email", user.email)
          .single();

      if (memberError) throw memberError;

      setIsAdmin(
        member.role === "admin" ||
        member.role === "super_admin"
      );

      // -------------------------------------------------
      // Elections
      // -------------------------------------------------

      const { data: electionData, error: electionError } =
        await supabase
          .from("elections")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (electionError) throw electionError;

      const loadedElections = electionData || [];

      setElections(loadedElections);

      // -------------------------------------------------
      // Latest election
      // -------------------------------------------------

      if (loadedElections.length > 0) {
        const latestElection = loadedElections[0];

        setSelectedElection(latestElection.id);

        await loadElectionDetails(
          latestElection.id
        );

        await loadMyVotes(latestElection.id);

        await loadResults(latestElection.id);
      } else {
        setPositions([]);
        setCandidates([]);
        setMyVotes([]);
        setResults([]);
        setSelectedElection("");
        setSelectedPosition("");
      }

      // -------------------------------------------------
      // Active members
      // -------------------------------------------------

      const {
        data: memberData,
        error: membersError,
      } = await supabase
        .from("members")
        .select(
          "id, member_id, full_name, email, photo_url"
        )
        .eq("is_active", true)
        .order("full_name");

      if (membersError) throw membersError;

      setMembers(memberData || []);
    } catch (err) {
      console.error("Page loading error:", err);

      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD POSITIONS + CANDIDATES
  // =====================================================

  const loadElectionDetails = async (electionId) => {
    if (!electionId) return;

    try {
      // -------------------------------------------------
      // Positions
      // -------------------------------------------------

      const {
        data: positionData,
        error: positionError,
      } = await supabase
        .from("election_positions")
        .select("*")
        .eq("election_id", electionId)
        .order("created_at", {
          ascending: true,
        });

      if (positionError) throw positionError;

      const loadedPositions = positionData || [];

      setPositions(loadedPositions);

      // Automatically select first position
      if (loadedPositions.length > 0) {
        setSelectedPosition(
          loadedPositions[0].id
        );
      } else {
        setSelectedPosition("");
      }

      // -------------------------------------------------
      // Candidates
      // -------------------------------------------------

      if (loadedPositions.length === 0) {
        setCandidates([]);
        return;
      }

      const positionIds = loadedPositions.map(
        (position) => position.id
      );

      const {
        data: candidateData,
        error: candidateError,
      } = await supabase
        .from("candidates")
        .select(`
          id,
          position_id,
          member_id,
          manifesto,
          created_at,
          members (
            full_name,
            member_id,
            photo_url
          )
        `)
        .in("position_id", positionIds)
        .order("created_at", {
          ascending: true,
        });

      if (candidateError) throw candidateError;

      setCandidates(candidateData || []);
    } catch (err) {
      console.error(
        "Election details error:",
        err
      );

      setError(
        err.message ||
        "Failed to load election details."
      );
    }
  };

  // =====================================================
  // LOAD CURRENT USER VOTES
  // =====================================================

  const loadMyVotes = async (electionId) => {
    if (!electionId || !user) return;

    try {
      // Find member
      const {
        data: member,
        error: memberError,
      } = await supabase
        .from("members")
        .select("id")
        .eq("email", user.email)
        .single();

      if (memberError) throw memberError;

      // Find votes
      const { data, error } = await supabase
        .from("votes")
        .select(
          "id, position_id, candidate_id"
        )
        .eq("election_id", electionId)
        .eq("member_id", member.id);

      if (error) throw error;

      setMyVotes(data || []);
    } catch (err) {
      console.error(
        "My votes loading error:",
        err
      );
    }
  };

  // =====================================================
  // LOAD RESULTS
  // =====================================================

  const loadResults = async (electionId) => {
    if (!electionId) {
      setResults([]);
      return;
    }

    try {
      // 1. Get all votes for this election
      const { data: votes, error: votesError } = await supabase
        .from("votes")
        .select("*")
        .eq("election_id", electionId);

      if (votesError) {
        console.error("RESULT VOTES ERROR:", votesError);
        setResults([]);
        return;
      }

      // No votes yet
      if (!votes || votes.length === 0) {
        setResults([]);
        return;
      }

      // 2. Get candidate IDs
      const candidateIds = [
        ...new Set(votes.map((vote) => vote.candidate_id)),
      ];

      // 3. Get candidates
      const { data: candidates, error: candidatesError } =
        await supabase
          .from("candidates")
          .select(`
          id,
          position_id,
          member_id,
          members (
            full_name,
            photo_url
          )
        `)
          .in("id", candidateIds);

      if (candidatesError) {
        console.error(
          "RESULT CANDIDATES ERROR:",
          candidatesError
        );
        setResults([]);
        return;
      }

      // 4. Get position IDs
      const positionIds = [
        ...new Set(
          votes.map((vote) => vote.position_id)
        ),
      ];

      // 5. Get positions
      const { data: positions, error: positionsError } =
        await supabase
          .from("election_positions")
          .select("id, position_name")
          .in("id", positionIds);

      if (positionsError) {
        console.error(
          "RESULT POSITIONS ERROR:",
          positionsError
        );
        setResults([]);
        return;
      }

      // 6. Create lookup maps
      const positionMap = {};

      positions?.forEach((position) => {
        positionMap[position.id] =
          position.position_name;
      });

      const candidateMap = {};

      candidates?.forEach((candidate) => {
        candidateMap[candidate.id] = candidate;
      });

      // 7. Count votes
      const voteCounts = {};

      votes.forEach((vote) => {
        if (!voteCounts[vote.candidate_id]) {
          voteCounts[vote.candidate_id] = 0;
        }

        voteCounts[vote.candidate_id]++;
      });

      // 8. Build final result data
      const formattedResults = candidateIds
        .map((candidateId) => {
          const candidate = candidateMap[candidateId];

          if (!candidate) {
            return null;
          }

          return {
            candidate_id: candidate.id,

            position_id: candidate.position_id,

            position_name:
              positionMap[candidate.position_id] ||
              "Unknown Position",

            candidate_name:
              candidate.members?.full_name ||
              "Unknown Candidate",

            member_id: candidate.member_id,

            photo_url:
              candidate.members?.photo_url || null,

            vote_count:
              voteCounts[candidateId] || 0,
          };
        })
        .filter(Boolean);

      setResults(formattedResults);

      console.log(
        "FINAL RESULTS:",
        formattedResults
      );
    } catch (error) {
      console.error(
        "LOAD RESULTS ERROR:",
        error
      );

      setResults([]);
    }
  };

  // =====================================================
  // CHANGE ELECTION
  // =====================================================

  const handleElectionChange = async (
    electionId
  ) => {
    setSelectedElection(electionId);
    setSelectedPosition("");
    setMessage("");
    setError("");

    await loadElectionDetails(
      electionId
    );

    await loadMyVotes(electionId);

    await loadResults(electionId);
  };

  // =====================================================
  // CREATE ELECTION
  // =====================================================

  const handleCreateElection = async (
    e
  ) => {
    e.preventDefault();

    if (!isAdmin) return;

    if (!electionName.trim()) {
      setError(
        "Please enter an election name."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const {
        data: member,
        error: memberError,
      } = await supabase
        .from("members")
        .select("id")
        .eq("email", user.email)
        .single();

      if (memberError) throw memberError;

      const {
        data,
        error: insertError,
      } = await supabase
        .from("elections")
        .insert({
          name: electionName.trim(),
          description:
            description.trim() || null,
          start_time:
            startTime || null,
          end_time:
            endTime || null,
          status: "not_started",
          created_by: member.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setElectionName("");
      setDescription("");
      setStartTime("");
      setEndTime("");

      setMessage(
        "Election created successfully."
      );

      await loadPageData();

      if (data?.id) {
        setSelectedElection(data.id);
      }
    } catch (err) {
      console.error(
        "Create election error:",
        err
      );

      setError(
        err.message ||
        "Failed to create election."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // START ELECTION
  // =====================================================

  const handleStartElection = async (
    electionId
  ) => {
    if (!isAdmin) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to start this election?"
      );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const { error } =
        await supabase
          .from("elections")
          .update({
            status: "active",
          })
          .eq("id", electionId);

      if (error) throw error;

      setMessage(
        "Election is now active."
      );

      await loadPageData();
    } catch (err) {
      console.error(
        "Start election error:",
        err
      );

      setError(
        err.message ||
        "Failed to start election."
      );
    }
  };

  // =====================================================
  // END ELECTION
  // =====================================================

  const handleEndElection = async (
    electionId
  ) => {
    if (!isAdmin) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to end this election?"
      );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const { error } =
        await supabase
          .from("elections")
          .update({
            status: "ended",
          })
          .eq("id", electionId);

      if (error) throw error;

      // Load results immediately
      await loadResults(electionId);

      setMessage(
        "Election ended successfully."
      );

      await loadPageData();
    } catch (err) {
      console.error(
        "End election error:",
        err
      );

      setError(
        err.message ||
        "Failed to end election."
      );
    }
  };

  // =====================================================
  // ADD POSITION
  // =====================================================

  const handleAddPosition = async (
    e
  ) => {
    e.preventDefault();

    if (!isAdmin) return;

    if (!selectedElection) {
      setError(
        "Please select an election first."
      );
      return;
    }

    if (!positionName.trim()) {
      setError(
        "Please enter a position name."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { error } =
        await supabase
          .from("election_positions")
          .insert({
            election_id:
              selectedElection,

            position_name:
              positionName.trim(),
          });

      if (error) throw error;

      setPositionName("");

      setMessage(
        "Position added successfully."
      );

      await loadElectionDetails(
        selectedElection
      );
    } catch (err) {
      console.error(
        "Add position error:",
        err
      );

      setError(
        err.message ||
        "Failed to add position."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE POSITION
  // =====================================================

  const handleDeletePosition = async (
    positionId
  ) => {
    if (!isAdmin) return;

    const confirmed =
      window.confirm(
        "Delete this position?"
      );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const { error } =
        await supabase
          .from("election_positions")
          .delete()
          .eq("id", positionId);

      if (error) throw error;

      setMessage(
        "Position deleted successfully."
      );

      await loadElectionDetails(
        selectedElection
      );
    } catch (err) {
      console.error(
        "Delete position error:",
        err
      );

      setError(
        err.message ||
        "Failed to delete position. Remove its candidates first."
      );
    }
  };

  // =====================================================
  // ADD CANDIDATE
  // =====================================================

  const handleAddCandidate = async (
    e
  ) => {
    e.preventDefault();

    if (!isAdmin) return;

    if (!selectedPosition) {
      setError(
        "Please select a position first."
      );
      return;
    }

    if (!candidateMember) {
      setError(
        "Please select a member."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { error } =
        await supabase
          .from("candidates")
          .insert({
            position_id:
              selectedPosition,

            member_id:
              candidateMember,

            manifesto:
              manifesto.trim() ||
              null,
          });

      if (error) throw error;

      setCandidateMember("");
      setManifesto("");

      setMessage(
        "Candidate added successfully."
      );

      await loadElectionDetails(
        selectedElection
      );
    } catch (err) {
      console.error(
        "Add candidate error:",
        err
      );

      setError(
        err.message ||
        "Failed to add candidate. This member may already be a candidate for this position."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE CANDIDATE
  // =====================================================

  const handleDeleteCandidate = async (
    candidateId
  ) => {
    if (!isAdmin) return;

    const confirmed =
      window.confirm(
        "Remove this candidate?"
      );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const { error } =
        await supabase
          .from("candidates")
          .delete()
          .eq("id", candidateId);

      if (error) throw error;

      setMessage(
        "Candidate removed successfully."
      );

      await loadElectionDetails(
        selectedElection
      );
    } catch (err) {
      console.error(
        "Delete candidate error:",
        err
      );

      setError(
        err.message ||
        "Failed to remove candidate."
      );
    }
  };

  // =====================================================
  // SUBMIT VOTE
  // =====================================================

  const handleVote = async (
    candidateId,
    positionId
  ) => {
    if (!selectedElection || !user) {
      return;
    }

    const selectedElectionData =
      elections.find(
        (election) =>
          election.id ===
          selectedElection
      );

    if (
      selectedElectionData?.status !==
      "active"
    ) {
      setError(
        "This election is not active."
      );
      return;
    }

    // Check if current user already voted
    const alreadyVoted =
      myVotes.some(
        (vote) =>
          vote.position_id ===
          positionId
      );

    if (alreadyVoted) {
      setError(
        "You have already voted for this position."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to vote for this candidate?"
      );

    if (!confirmed) return;

    try {
      setVoteLoading(true);
      setError("");
      setMessage("");

      // -------------------------------------------------
      // Find current member
      // -------------------------------------------------

      const {
        data: member,
        error: memberError,
      } = await supabase
        .from("members")
        .select(
          "id, member_id, full_name, role"
        )
        .eq("email", user.email)
        .eq("is_active", true)
        .single();

      if (memberError) {
        throw memberError;
      }

      if (!member) {
        throw new Error(
          "Member account not found."
        );
      }

      // -------------------------------------------------
      // Insert vote
      // -------------------------------------------------

      const { error: voteError } =
        await supabase
          .from("votes")
          .insert({
            election_id:
              selectedElection,

            position_id:
              positionId,

            candidate_id:
              candidateId,

            member_id:
              member.id,
          });

      if (voteError) {
        // Duplicate vote
        if (
          voteError.code ===
          "23505"
        ) {
          throw new Error(
            "You have already voted for this position."
          );
        }

        throw voteError;
      }

      // -------------------------------------------------
      // Refresh everything
      // -------------------------------------------------

      await loadMyVotes(
        selectedElection
      );

      await loadResults(
        selectedElection
      );

      setMessage(
        `Vote submitted successfully. Thank you, ${member.full_name}.`
      );
    } catch (err) {
      console.error(
        "Vote error:",
        err
      );

      setError(
        err.message ||
        "Failed to submit vote."
      );
    } finally {
      setVoteLoading(false);
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getElectionStatus = (
    status
  ) => {
    if (status === "active") {
      return {
        label: "Active",
        className:
          "border-emerald-200 bg-emerald-100 text-emerald-700",
      };
    }

    if (status === "ended") {
      return {
        label: "Ended",
        className:
          "border-slate-200 bg-slate-100 text-slate-600",
      };
    }

    return {
      label: "Not Started",
      className:
        "border-amber-200 bg-amber-100 text-amber-700",
    };
  };

  // =====================================================
  // SELECTED DATA
  // =====================================================

  const selectedElectionData =
    elections.find(
      (election) =>
        election.id ===
        selectedElection
    );

  const selectedPositionData =
    positions.find(
      (position) =>
        position.id ===
        selectedPosition
    );

  const positionCandidates =
    candidates.filter(
      (candidate) =>
        candidate.position_id ===
        selectedPosition
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="font-semibold text-slate-600">
            Loading Election Center...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2 text-indigo-100">
                <Vote size={20} />

                <span className="text-sm font-bold uppercase tracking-widest">
                  MJPCSU Election
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Election Center
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                Manage elections, positions,
                candidates and voting from one
                secure platform.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">

              <div className="rounded-xl bg-white/15 p-2">
                {isAdmin ? (
                  <Crown size={22} />
                ) : (
                  <Users size={22} />
                )}
              </div>

              <div>
                <p className="text-xs text-indigo-100">
                  Access Level
                </p>

                <p className="font-bold">
                  {isAdmin
                    ? "Administrator"
                    : "Member"}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            ALERTS
        ================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <X
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold">
              {error}
            </p>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold">
              {message}
            </p>
          </div>
        )}

        {/* =================================================
            CREATE ELECTION
        ================================================== */}

        {isAdmin && (
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <Plus size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create New Election
                </h2>

                <p className="text-sm text-slate-500">
                  Set up a new election.
                </p>
              </div>
            </div>

            <form
              onSubmit={
                handleCreateElection
              }
              className="grid gap-5 md:grid-cols-2"
            >

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Election Name
                </label>

                <input
                  type="text"
                  value={electionName}
                  onChange={(e) =>
                    setElectionName(
                      e.target.value
                    )
                  }
                  placeholder="MJPCSU Executive Election 2026"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Election description..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start Time
                </label>

                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) =>
                    setStartTime(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  End Time
                </label>

                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  <Plus size={19} />

                  {saving
                    ? "Creating..."
                    : "Create Election"}
                </button>
              </div>

            </form>
          </section>
        )}

        {/* =================================================
            ELECTION LIST
        ================================================== */}

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Elections
              </h2>

              <p className="text-sm text-slate-500">
                Select an election.
              </p>
            </div>
          </div>

          {elections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <Vote
                size={38}
                className="mx-auto mb-3 text-slate-400"
              />

              <p className="font-semibold text-slate-700">
                No elections available
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {elections.map(
                (election) => {
                  const status =
                    getElectionStatus(
                      election.status
                    );

                  const isSelected =
                    selectedElection ===
                    election.id;

                  return (
                    <div
                      key={election.id}
                      className={`rounded-2xl border p-5 transition ${isSelected
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
                        }`}
                    >

                      <button
                        onClick={() =>
                          handleElectionChange(
                            election.id
                          )
                        }
                        className="w-full text-left"
                      >

                        <div className="mb-4 flex items-start justify-between gap-3">

                          <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
                            <Vote size={20} />
                          </div>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                          >
                            {status.label}
                          </span>

                        </div>

                        <h3 className="font-bold text-slate-900">
                          {election.name}
                        </h3>

                        {election.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                            {
                              election.description
                            }
                          </p>
                        )}

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                          <Clock3 size={14} />

                          {election.start_time
                            ? new Date(
                              election.start_time
                            ).toLocaleString()
                            : "Start time not set"}
                        </div>

                      </button>

                      {/* ADMIN CONTROLS */}

                      {isAdmin && (
                        <div className="mt-4">

                          {election.status ===
                            "not_started" && (
                              <button
                                onClick={() =>
                                  handleStartElection(
                                    election.id
                                  )
                                }
                                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                              >
                                Start Election
                              </button>
                            )}

                          {election.status ===
                            "active" && (
                              <button
                                onClick={() =>
                                  handleEndElection(
                                    election.id
                                  )
                                }
                                className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                              >
                                End Election
                              </button>
                            )}

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* =================================================
            ELECTION DETAILS
        ================================================== */}

        {selectedElectionData && (
          <section className="grid gap-8 lg:grid-cols-3">

            {/* =================================================
                POSITIONS
            ================================================== */}

            <div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Positions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      selectedElectionData.name
                    }
                  </p>
                </div>

                {isAdmin && (
                  <form
                    onSubmit={
                      handleAddPosition
                    }
                    className="mb-6 flex gap-2"
                  >

                    <input
                      type="text"
                      value={positionName}
                      onChange={(e) =>
                        setPositionName(
                          e.target.value
                        )
                      }
                      placeholder="e.g. President"
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-indigo-600 px-3 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Plus size={19} />
                    </button>

                  </form>
                )}

                {positions.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No positions added yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">

                    {positions.map(
                      (position) => {
                        const isSelected =
                          selectedPosition ===
                          position.id;

                        return (
                          <div
                            key={position.id}
                            className={`flex items-center gap-2 rounded-2xl border p-3 ${isSelected
                              ? "border-indigo-300 bg-indigo-50"
                              : "border-slate-200"
                              }`}
                          >

                            <button
                              onClick={() =>
                                setSelectedPosition(
                                  position.id
                                )
                              }
                              className="flex min-w-0 flex-1 items-center gap-3 text-left"
                            >

                              <div
                                className={`rounded-xl p-2 ${isSelected
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                                  }`}
                              >
                                <Vote size={17} />
                              </div>

                              <span className="truncate text-sm font-semibold text-slate-800">
                                {
                                  position.position_name
                                }
                              </span>

                            </button>

                            {isAdmin && (
                              <button
                                onClick={() =>
                                  handleDeletePosition(
                                    position.id
                                  )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>
            </div>

            {/* =================================================
                CANDIDATES
            ================================================== */}

            <div className="lg:col-span-2">

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Candidates
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedPositionData
                        ? selectedPositionData.position_name
                        : "Select a position"}
                    </p>
                  </div>

                  {selectedPositionData && (
                    <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-bold text-indigo-700">
                      <Users size={16} />

                      {
                        positionCandidates.length
                      }{" "}
                      Candidate
                      {positionCandidates.length !==
                        1
                        ? "s"
                        : ""}
                    </div>
                  )}

                </div>

                {/* ADD CANDIDATE */}

                {isAdmin &&
                  selectedPositionData && (
                    <form
                      onSubmit={
                        handleAddCandidate
                      }
                      className="mb-7 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 sm:p-5"
                    >

                      <div className="mb-4 flex items-center gap-2">
                        <UserPlus
                          size={19}
                          className="text-indigo-600"
                        />

                        <h3 className="font-bold text-slate-800">
                          Add Candidate
                        </h3>
                      </div>

                      <div className="grid gap-4">

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Select Member
                          </label>

                          <div className="relative">

                            <select
                              value={
                                candidateMember
                              }
                              onChange={(e) =>
                                setCandidateMember(
                                  e.target.value
                                )
                              }
                              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            >

                              <option value="">
                                Choose a member
                              </option>

                              {members.map(
                                (member) => (
                                  <option
                                    key={
                                      member.id
                                    }
                                    value={
                                      member.id
                                    }
                                  >
                                    {
                                      member.full_name
                                    }{" "}
                                    —{" "}
                                    {
                                      member.member_id
                                    }
                                  </option>
                                )
                              )}

                            </select>

                            <ChevronDown
                              size={18}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Manifesto
                          </label>

                          <textarea
                            value={manifesto}
                            onChange={(e) =>
                              setManifesto(
                                e.target.value
                              )
                            }
                            rows={3}
                            placeholder="Candidate manifesto..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                          <UserPlus
                            size={17}
                          />

                          {saving
                            ? "Adding..."
                            : "Add Candidate"}
                        </button>

                      </div>

                    </form>
                  )}

                {/* CANDIDATE LIST */}

                {!selectedPositionData ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                    <Vote
                      size={38}
                      className="mx-auto mb-3 text-slate-400"
                    />

                    <p className="font-semibold text-slate-700">
                      Select a position
                    </p>
                  </div>
                ) : positionCandidates.length ===
                  0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                    <Users
                      size={38}
                      className="mx-auto mb-3 text-slate-400"
                    />

                    <p className="font-semibold text-slate-700">
                      No candidates yet
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">

                    {positionCandidates.map(
                      (candidate) => {

                        const hasVoted =
                          myVotes.some(
                            (vote) =>
                              vote.position_id ===
                              candidate.position_id
                          );

                        return (
                          <div
                            key={
                              candidate.id
                            }
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-indigo-200 hover:shadow-lg"
                          >

                            {/* CANDIDATE */}

                            <div className="flex items-start gap-4 p-5">

                              {candidate.members
                                ?.photo_url ? (
                                <img
                                  src={
                                    candidate
                                      .members
                                      .photo_url
                                  }
                                  alt={
                                    candidate
                                      .members
                                      .full_name
                                  }
                                  className="h-14 w-14 rounded-2xl object-cover ring-4 ring-indigo-50"
                                />
                              ) : (
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-black text-white">
                                  {candidate.members?.full_name
                                    ?.charAt(
                                      0
                                    )
                                    ?.toUpperCase() ||
                                    "?"}
                                </div>
                              )}

                              <div className="min-w-0 flex-1">

                                <h3 className="truncate font-bold text-slate-900">
                                  {candidate
                                    .members
                                    ?.full_name ||
                                    "Unknown Member"}
                                </h3>

                                <p className="mt-1 text-xs font-medium text-indigo-600">
                                  ID:{" "}
                                  {candidate
                                    .members
                                    ?.member_id ||
                                    "N/A"}
                                </p>

                              </div>

                              {isAdmin && (
                                <button
                                  onClick={() =>
                                    handleDeleteCandidate(
                                      candidate.id
                                    )
                                  }
                                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2
                                    size={17}
                                  />
                                </button>
                              )}

                            </div>

                            {/* MANIFESTO */}

                            {candidate.manifesto && (
                              <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">

                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Manifesto
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {
                                    candidate.manifesto
                                  }
                                </p>

                              </div>
                            )}

                            {/* VOTE */}

                            {selectedElectionData.status === "active" && (
                              <div className="border-t border-slate-100 p-4">

                                {hasVoted ? (
                                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                    <CheckCircle2 size={17} />
                                    You already voted
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleVote(
                                        candidate.id,
                                        candidate.position_id
                                      )
                                    }
                                    disabled={voteLoading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                  >
                                    <Vote size={17} />

                                    {voteLoading
                                      ? "Submitting..."
                                      : "Vote for this Candidate"}
                                  </button>
                                )}

                              </div>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>
            </div>

          </section>
        )}

        {/* =================================================
            RESULTS
        ================================================== */}

        {selectedElectionData?.status ===
          "ended" && (
            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7 flex items-center gap-3">

                <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                  <Trophy size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Election Results
                  </h2>

                  <p className="text-sm text-slate-500">
                    Final voting results
                  </p>
                </div>

              </div>

              {results.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-10 text-center">
                  <Trophy
                    size={40}
                    className="mx-auto mb-3 text-slate-400"
                  />

                  <p className="font-semibold text-slate-700">
                    No votes were recorded.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  {[...results]
                    .sort(
                      (a, b) =>
                        b.vote_count -
                        a.vote_count
                    )
                    .map(
                      (
                        result,
                        index
                      ) => (
                        <div
                          key={
                            result.candidate_id
                          }
                          className={`rounded-2xl border p-5 ${index === 0
                            ? "border-amber-300 bg-amber-50"
                            : "border-slate-200 bg-white"
                            }`}
                        >

                          <div className="flex items-center gap-4">

                            {result.photo_url ? (
                              <img
                                src={
                                  result.photo_url
                                }
                                alt={
                                  result.candidate_name
                                }
                                className="h-14 w-14 rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white">
                                {result.candidate_name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">

                              {index ===
                                0 && (
                                  <span className="mb-1 flex items-center gap-1 text-xs font-black text-amber-600">
                                    <Trophy
                                      size={
                                        13
                                      }
                                    />

                                    TOP RESULT
                                  </span>
                                )}

                              <h3 className="truncate font-bold text-slate-900">
                                {
                                  result.candidate_name
                                }
                              </h3>

                              <p className="text-xs text-slate-500">
                                {
                                  result.position_name
                                }
                              </p>

                            </div>

                          </div>

                          <div className="mt-5 rounded-xl bg-white p-4 text-center">

                            <p className="text-3xl font-black text-indigo-600">
                              {
                                result.vote_count
                              }
                            </p>

                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Votes
                            </p>

                          </div>

                        </div>
                      )
                    )}

                </div>
              )}

            </section>
          )}

        {/* =================================================
            MEMBER NOTICE
        ================================================== */}

        {!isAdmin && (
          <div className="mt-8 flex items-start gap-4 rounded-3xl border border-indigo-100 bg-indigo-50 p-5">

            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3 className="font-bold text-indigo-900">
                Secure Member Voting
              </h3>

              <p className="mt-1 text-sm leading-6 text-indigo-700">
                You can vote once for each
                position during an active
                election. Your vote cannot be
                submitted twice for the same
                position.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Election;

