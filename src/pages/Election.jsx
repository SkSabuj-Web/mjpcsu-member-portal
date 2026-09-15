
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
  Sparkles,
  CircleDot,
  Award,
  Megaphone,
  Zap,
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

        await loadElectionDetails(latestElection.id);
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
      const {
        data: member,
        error: memberError,
      } = await supabase
        .from("members")
        .select("id")
        .eq("email", user.email)
        .single();

      if (memberError) throw memberError;

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
      const { data: votes, error: votesError } =
        await supabase
          .from("votes")
          .select("*")
          .eq("election_id", electionId);

      if (votesError) {
        console.error(
          "RESULT VOTES ERROR:",
          votesError
        );
        setResults([]);
        return;
      }

      if (!votes || votes.length === 0) {
        setResults([]);
        return;
      }

      const candidateIds = [
        ...new Set(
          votes.map(
            (vote) => vote.candidate_id
          )
        ),
      ];

      const {
        data: candidates,
        error: candidatesError,
      } = await supabase
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

      const positionIds = [
        ...new Set(
          votes.map(
            (vote) => vote.position_id
          )
        ),
      ];

      const {
        data: positions,
        error: positionsError,
      } = await supabase
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

      const positionMap = {};

      positions?.forEach((position) => {
        positionMap[position.id] =
          position.position_name;
      });

      const candidateMap = {};

      candidates?.forEach((candidate) => {
        candidateMap[candidate.id] = candidate;
      });

      const voteCounts = {};

      votes.forEach((vote) => {
        if (!voteCounts[vote.candidate_id]) {
          voteCounts[vote.candidate_id] = 0;
        }

        voteCounts[vote.candidate_id]++;
      });

      const formattedResults = candidateIds
        .map((candidateId) => {
          const candidate =
            candidateMap[candidateId];

          if (!candidate) {
            return null;
          }

          return {
            candidate_id: candidate.id,
            position_id: candidate.position_id,
            position_name:
              positionMap[
                candidate.position_id
              ] || "Unknown Position",
            candidate_name:
              candidate.members?.full_name ||
              "Unknown Candidate",
            member_id: candidate.member_id,
            photo_url:
              candidate.members?.photo_url ||
              null,
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

    await loadElectionDetails(electionId);
    await loadMyVotes(electionId);
    await loadResults(electionId);
  };

  // =====================================================
  // CREATE ELECTION
  // =====================================================

  const handleCreateElection = async (e) => {
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

    const confirmed = window.confirm(
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

    const confirmed = window.confirm(
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

  const handleAddPosition = async (e) => {
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

    const confirmed = window.confirm(
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

  const handleAddCandidate = async (e) => {
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
              manifesto.trim() || null,
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

    const confirmed = window.confirm(
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

    const confirmed = window.confirm(
      "Are you sure you want to vote for this candidate?"
    );

    if (!confirmed) return;

    try {
      setVoteLoading(true);
      setError("");
      setMessage("");

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

  const getElectionStatus = (status) => {
    if (status === "active") {
      return {
        label: "Active",
        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    if (status === "ended") {
      return {
        label: "Ended",
        className:
          "border-slate-500/20 bg-slate-500/10 text-slate-400",
        dot: "bg-slate-400",
      };
    }

    return {
      label: "Not Started",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-400",
      dot: "bg-amber-400",
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

  const totalVotes = results.reduce(
    (sum, result) =>
      sum + result.vote_count,
    0
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-slate-950 px-4">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          </div>

          <p className="text-sm font-bold text-slate-300">
            Loading Election Center...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Preparing your secure voting space
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* =================================================
          GLOBAL BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-48 top-20 h-[38rem] w-[38rem] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-6 shadow-2xl shadow-blue-950/40 sm:p-8 lg:p-10">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 left-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="absolute right-8 top-8 hidden h-20 w-20 rotate-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl sm:block" />
          <div className="absolute bottom-8 right-24 hidden h-10 w-10 rounded-full border border-white/10 bg-white/5 sm:block" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-50 backdrop-blur-xl">
                <Sparkles size={15} />
                MJPCSU • Democratic Participation
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Election
                <span className="text-cyan-200">
                  {" "}Center
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base sm:leading-8">
                A secure and transparent space to manage
                elections, choose leaders, and make your
                student voice count.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur">
                  <ShieldCheck size={15} />
                  Secure Voting
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur">
                  <Users size={15} />
                  Student Voice
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur">
                  <Vote size={15} />
                  One Vote / Position
                </div>
              </div>
            </div>

            <div className="relative shrink-0">

              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:min-w-[220px]">

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    {isAdmin ? (
                      <Crown size={24} />
                    ) : (
                      <Users size={24} />
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                      Access Level
                    </p>

                    <p className="mt-1 font-black">
                      {isAdmin
                        ? "Administrator"
                        : "Member"}
                    </p>
                  </div>
                </div>

                {selectedElectionData && (
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                      Current Election
                    </p>

                    <p className="mt-1 truncate text-sm font-bold">
                      {selectedElectionData.name}
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-300 shadow-lg">
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
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-300 shadow-lg">
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
        ================================================= */}

        {isAdmin && (
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">

            <div className="border-b border-white/5 bg-gradient-to-r from-indigo-500/10 to-cyan-500/5 p-5 sm:p-7">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-400/10">
                  <Plus size={22} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">
                      Create New Election
                    </h2>

                    <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-indigo-400">
                      Admin
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Set up a new student election.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleCreateElection}
              className="grid gap-5 p-5 sm:p-7 md:grid-cols-2"
            >

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
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
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
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
                  className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/5"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
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
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
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
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus
                    size={19}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />

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
        ================================================= */}

        <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">

          <div className="border-b border-white/5 p-5 sm:p-7">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-400/10">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">
                    Elections
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select an election to continue.
                  </p>
                </div>
              </div>

              {elections.length > 0 && (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-bold text-slate-400">
                  <CircleDot
                    size={14}
                    className="text-cyan-400"
                  />
                  {elections.length} Election
                  {elections.length !== 1
                    ? "s"
                    : ""}
                </div>
              )}

            </div>
          </div>

          <div className="p-5 sm:p-7">

            {elections.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/70 text-slate-500">
                  <Vote size={30} />
                </div>

                <p className="mt-5 font-bold text-slate-300">
                  No elections available
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Elections created by administrators will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {elections.map((election) => {
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
                      className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 ${
                        isSelected
                          ? "border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-slate-900 shadow-xl shadow-cyan-950/20"
                          : "border-slate-800 bg-slate-950/50 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >

                      {isSelected && (
                        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl" />
                      )}

                      <button
                        onClick={() =>
                          handleElectionChange(
                            election.id
                          )
                        }
                        className="relative w-full text-left"
                      >

                        <div className="mb-5 flex items-start justify-between gap-3">

                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                              isSelected
                                ? "bg-cyan-400/10 text-cyan-400"
                                : "bg-slate-800 text-slate-400 group-hover:text-cyan-400"
                            }`}
                          >
                            <Vote size={20} />
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${status.className}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />
                            {status.label}
                          </span>

                        </div>

                        <h3 className="line-clamp-2 font-black leading-6 text-white">
                          {election.name}
                        </h3>

                        {election.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {election.description}
                          </p>
                        )}

                        <div className="mt-5 flex items-center gap-2 text-xs text-slate-600">
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
                        <div className="relative mt-5 border-t border-slate-800 pt-4">

                          {election.status ===
                            "not_started" && (
                            <button
                              onClick={() =>
                                handleStartElection(
                                  election.id
                                )
                              }
                              className="group/start flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-black text-emerald-400 ring-1 ring-emerald-500/10 transition hover:bg-emerald-500 hover:text-white"
                            >
                              <Zap
                                size={16}
                                className="transition-transform group-hover/start:scale-110"
                              />
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
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-black text-red-400 ring-1 ring-red-500/10 transition hover:bg-red-500 hover:text-white"
                            >
                              <X size={16} />
                              End Election
                            </button>
                          )}

                          {election.status ===
                            "ended" && (
                            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/60 px-4 py-3 text-xs font-bold text-slate-500">
                              <CheckCircle2 size={15} />
                              Election Completed
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}

              </div>
            )}

          </div>
        </section>

        {/* =================================================
            SELECTED ELECTION OVERVIEW
        ================================================= */}

        {selectedElectionData && (
          <section className="mb-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Award size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Positions
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    {positions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Users size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Candidates
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    {candidates.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <Vote size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    My Votes
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    {myVotes.length}
                  </p>
                </div>
              </div>
            </div>

          </section>
        )}

        {/* =================================================
            ELECTION DETAILS
        ================================================= */}

        {selectedElectionData && (
          <section className="grid gap-8 lg:grid-cols-[.8fr_1.7fr]">

            {/* =================================================
                POSITIONS
            ================================================= */}

            <div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">

                <div className="border-b border-white/5 p-5 sm:p-6">

                  <div className="flex items-center justify-between gap-3">

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-400">
                        Election Setup
                      </p>

                      <h2 className="mt-1 text-xl font-black text-white">
                        Positions
                      </h2>

                      <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                        {selectedElectionData.name}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Award size={19} />
                    </div>

                  </div>

                </div>

                <div className="p-5 sm:p-6">

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
                        className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5"
                      />

                      <button
                        type="submit"
                        disabled={saving}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-400 disabled:opacity-50"
                      >
                        <Plus size={19} />
                      </button>

                    </form>
                  )}

                  {positions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 p-7 text-center">
                      <Vote
                        size={28}
                        className="mx-auto mb-3 text-slate-600"
                      />

                      <p className="text-sm font-semibold text-slate-500">
                        No positions added yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">

                      {positions.map(
                        (position, index) => {
                          const isSelected =
                            selectedPosition ===
                            position.id;

                          const candidateCount =
                            candidates.filter(
                              (candidate) =>
                                candidate.position_id ===
                                position.id
                            ).length;

                          const votedForPosition =
                            myVotes.some(
                              (vote) =>
                                vote.position_id ===
                                position.id
                            );

                          return (
                            <div
                              key={position.id}
                              className={`group relative flex items-center gap-2 overflow-hidden rounded-2xl border p-3 transition-all duration-300 ${
                                isSelected
                                  ? "border-cyan-500/30 bg-cyan-500/10 shadow-lg shadow-cyan-950/10"
                                  : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900"
                              }`}
                            >

                              {isSelected && (
                                <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500" />
                              )}

                              <button
                                onClick={() =>
                                  setSelectedPosition(
                                    position.id
                                  )
                                }
                                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                              >

                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                                    isSelected
                                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-950/20"
                                      : "bg-slate-800 text-slate-500 group-hover:text-cyan-400"
                                  }`}
                                >
                                  <span className="text-xs font-black">
                                    {String(
                                      index + 1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <p
                                    className={`truncate text-sm font-black ${
                                      isSelected
                                        ? "text-white"
                                        : "text-slate-300"
                                    }`}
                                  >
                                    {
                                      position.position_name
                                    }
                                  </p>

                                  <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-600">
                                      {candidateCount} candidate
                                      {candidateCount !==
                                      1
                                        ? "s"
                                        : ""}
                                    </span>

                                    {votedForPosition && (
                                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                                        <CheckCircle2
                                          size={11}
                                        />
                                        Voted
                                      </span>
                                    )}
                                  </div>
                                </div>

                              </button>

                              {isAdmin && (
                                <button
                                  onClick={() =>
                                    handleDeletePosition(
                                      position.id
                                    )
                                  }
                                  className="rounded-xl p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                                >
                                  <Trash2
                                    size={16}
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
            </div>

            {/* =================================================
                CANDIDATES
            ================================================= */}

            <div>

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">

                <div className="border-b border-white/5 p-5 sm:p-6">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[.18em] text-blue-400">
                        Candidate List
                      </p>

                      <h2 className="mt-1 text-xl font-black text-white">
                        Candidates
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {selectedPositionData
                          ? selectedPositionData.position_name
                          : "Select a position"}
                      </p>
                    </div>

                    {selectedPositionData && (
                      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/10 bg-blue-500/10 px-3.5 py-2 text-xs font-black text-blue-400">
                        <Users size={15} />

                        {positionCandidates.length} Candidate
                        {positionCandidates.length !==
                        1
                          ? "s"
                          : ""}
                      </div>
                    )}

                  </div>

                </div>

                <div className="p-5 sm:p-6">

                  {/* ADD CANDIDATE */}

                  {isAdmin &&
                    selectedPositionData && (
                      <form
                        onSubmit={
                          handleAddCandidate
                        }
                        className="mb-7 overflow-hidden rounded-3xl border border-indigo-500/10 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 p-4 sm:p-5"
                      >

                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                            <UserPlus size={18} />
                          </div>

                          <div>
                            <h3 className="font-black text-white">
                              Add Candidate
                            </h3>

                            <p className="text-xs text-slate-600">
                              Add a member to this position.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4">

                          <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
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
                                className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 pr-10 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5"
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
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
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
                              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-400 disabled:opacity-50"
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
                    <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center">
                      <Vote
                        size={36}
                        className="mx-auto mb-4 text-slate-600"
                      />

                      <p className="font-bold text-slate-400">
                        Select a position
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Candidates will appear here.
                      </p>
                    </div>
                  ) : positionCandidates.length ===
                    0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center">
                      <Users
                        size={36}
                        className="mx-auto mb-4 text-slate-600"
                      />

                      <p className="font-bold text-slate-400">
                        No candidates yet
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Add candidates for this position.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2">

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
                              className={`group relative overflow-hidden rounded-3xl border bg-slate-950/50 transition-all duration-300 ${
                                hasVoted
                                  ? "border-emerald-500/20"
                                  : "border-slate-800 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-950/10"
                              }`}
                            >

                              {/* Top gradient */}
                              <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-60 transition-opacity group-hover:opacity-100" />

                              {/* CANDIDATE */}

                              <div className="p-5">

                                <div className="flex items-start gap-4">

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
                                      className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-cyan-500/5 transition duration-300 group-hover:ring-cyan-500/15"
                                    />
                                  ) : (
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-xl font-black text-white shadow-lg shadow-blue-950/20">
                                      {candidate.members?.full_name
                                        ?.charAt(
                                          0
                                        )
                                        ?.toUpperCase() ||
                                        "?"}
                                    </div>
                                  )}

                                  <div className="min-w-0 flex-1">

                                    <div className="flex items-start justify-between gap-2">

                                      <div className="min-w-0">
                                        <h3 className="truncate font-black text-white">
                                          {candidate
                                            .members
                                            ?.full_name ||
                                            "Unknown Member"}
                                        </h3>

                                        <p className="mt-1 text-xs font-bold text-cyan-400">
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
                                          className="shrink-0 rounded-xl p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                                        >
                                          <Trash2
                                            size={
                                              16
                                            }
                                          />
                                        </button>
                                      )}

                                    </div>

                                  </div>

                                </div>

                                {/* MANIFESTO */}

                                {candidate.manifesto && (
                                  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                      <Megaphone
                                        size={14}
                                        className="text-indigo-400"
                                      />

                                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                        Manifesto
                                      </p>
                                    </div>

                                    <p className="text-sm leading-6 text-slate-400">
                                      {
                                        candidate.manifesto
                                      }
                                    </p>
                                  </div>
                                )}

                              </div>

                              {/* VOTE */}

                              {selectedElectionData.status ===
                                "active" && (
                                <div className="border-t border-slate-800 bg-slate-900/50 p-4">

                                  {hasVoted ? (
                                    <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/10 px-4 py-3 text-sm font-black text-emerald-400">
                                      <CheckCircle2
                                        size={17}
                                      />
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
                                      disabled={
                                        voteLoading
                                      }
                                      className="group/vote flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-950/20 transition duration-300 hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <Vote
                                        size={17}
                                        className="transition-transform duration-300 group-hover/vote:scale-110"
                                      />

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
            </div>

          </section>
        )}

        {/* =================================================
            RESULTS
        ================================================= */}

        {selectedElectionData?.status ===
          "ended" && (
          <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-amber-400/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-[90px]" />

            <div className="relative border-b border-white/5 p-6 sm:p-8">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-400/10">
                    <Trophy size={25} />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.2em] text-amber-400">
                      Final Outcome
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-white">
                      Election Results
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Final voting results
                    </p>
                  </div>
                </div>

                {results.length > 0 && (
                  <div className="rounded-2xl border border-amber-400/10 bg-amber-500/5 px-5 py-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                      Total Votes
                    </p>

                    <p className="mt-1 text-2xl font-black text-amber-400">
                      {totalVotes}
                    </p>
                  </div>
                )}

              </div>
            </div>

            <div className="relative p-6 sm:p-8">

              {results.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center">
                  <Trophy
                    size={40}
                    className="mx-auto mb-4 text-slate-600"
                  />

                  <p className="font-bold text-slate-400">
                    No votes were recorded.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

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
                          className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                            index === 0
                              ? "border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-slate-950 shadow-xl shadow-amber-950/10"
                              : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                          }`}
                        >

                          {index === 0 && (
                            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-amber-400/10 blur-3xl" />
                          )}

                          <div className="relative flex items-center gap-4">

                            <div className="relative shrink-0">

                              {result.photo_url ? (
                                <img
                                  src={
                                    result.photo_url
                                  }
                                  alt={
                                    result.candidate_name
                                  }
                                  className={`h-16 w-16 rounded-2xl object-cover ${
                                    index === 0
                                      ? "ring-4 ring-amber-400/10"
                                      : ""
                                  }`}
                                />
                              ) : (
                                <div
                                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-black text-white ${
                                    index === 0
                                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                      : "bg-gradient-to-br from-cyan-500 to-indigo-600"
                                  }`}
                                >
                                  {result.candidate_name
                                    ?.charAt(
                                      0
                                    )
                                    ?.toUpperCase()}
                                </div>
                              )}

                              {index === 0 && (
                                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-amber-400 text-slate-950 shadow-lg">
                                  <Trophy
                                    size={
                                      13
                                    }
                                  />
                                </div>
                              )}

                            </div>

                            <div className="min-w-0">

                              {index === 0 && (
                                <span className="mb-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-400">
                                  <Sparkles
                                    size={
                                      11
                                    }
                                  />
                                  Top Result
                                </span>
                              )}

                              <h3 className="truncate font-black text-white">
                                {
                                  result.candidate_name
                                }
                              </h3>

                              <p className="mt-1 truncate text-xs font-semibold text-slate-600">
                                {
                                  result.position_name
                                }
                              </p>

                            </div>

                          </div>

                          <div
                            className={`relative mt-5 rounded-2xl p-4 text-center ${
                              index === 0
                                ? "bg-amber-400/10"
                                : "bg-slate-900"
                            }`}
                          >
                            <p
                              className={`text-3xl font-black ${
                                index === 0
                                  ? "text-amber-400"
                                  : "text-cyan-400"
                              }`}
                            >
                              {
                                result.vote_count
                              }
                            </p>

                            <p className="mt-1 text-[10px] font-black uppercase tracking-[.18em] text-slate-600">
                              Votes
                            </p>
                          </div>

                        </div>
                      )
                    )}

                </div>
              )}

            </div>
          </section>
        )}

        {/* =================================================
            MEMBER NOTICE
        ================================================= */}

        {!isAdmin && (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5 p-5 shadow-xl sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <ShieldCheck size={22} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-white">
                    Secure Member Voting
                  </h3>

                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                    Protected
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You can vote once for each position
                  during an active election. Your vote
                  cannot be submitted twice for the same
                  position.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Election;

