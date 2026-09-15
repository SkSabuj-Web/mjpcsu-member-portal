
import { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lightbulb,
  Send,
  Sparkles,
  ShieldCheck,
  MessageSquareText,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";

function Proposal() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);
    setSuccess("");
    setError("");

    const templateParams = {
      proposal_title: title,
      proposal_message: message,
    };

    try {
      await emailjs.send(
        "service_2wo5hzk",
        "template_fty5uii",
        templateParams,
        {
          publicKey: "Usb873gXA-jUowHvW",
        }
      );

      setSuccess(
        "Your proposal has been sent successfully! 🎉"
      );

      setTitle("");
      setMessage("");
    } catch (err) {
      console.error("EmailJS Error:", err);

      setError(
        "Sorry, your proposal could not be sent. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute -right-48 top-20 h-[36rem] w-[36rem] rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

        {/* =====================================================
            BACK BUTTON
        ===================================================== */}

        <Link
          to="/"
          className="group mb-7 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm font-bold text-slate-400 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-x-1 hover:border-cyan-500/30 hover:text-cyan-400"
        >
          <ArrowLeft
            size={17}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          Back to Home
        </Link>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-6 shadow-2xl shadow-blue-950/40 sm:p-8 lg:p-10">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="absolute right-10 top-10 hidden h-24 w-24 rotate-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl sm:block" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-50 backdrop-blur-xl">
                <Sparkles size={15} />
                MJPCSU Member Portal
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Your Ideas.
                <span className="text-cyan-200">
                  {" "}Our Community.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base sm:leading-8">
                Share your ideas, suggestions, and initiatives
                with MJPCSU. Your voice can help create a
                stronger and better student community.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur">
                  <Lightbulb size={15} />
                  Share Ideas
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur">
                  <HeartHandshake size={15} />
                  Build Community
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur">
                  <ShieldCheck size={15} />
                  Direct Submission
                </div>

              </div>
            </div>

            {/* Hero Icon */}

            <div className="relative mx-auto shrink-0 lg:mx-0">

              <div className="absolute inset-0 animate-pulse rounded-[2rem] bg-white/10 blur-2xl" />

              <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl sm:h-36 sm:w-36">

                <div className="absolute inset-3 rounded-[1.5rem] border border-white/10" />

                <Lightbulb
                  size={54}
                  strokeWidth={1.5}
                  className="text-cyan-100 drop-shadow-lg"
                />

                <Sparkles
                  size={18}
                  className="absolute right-5 top-5 text-white"
                />

              </div>
            </div>

          </div>
        </section>

        {/* =====================================================
            SUCCESS / ERROR
        ===================================================== */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-300 shadow-lg backdrop-blur-xl">

            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-black">
                Proposal Submitted
              </p>

              <p className="mt-0.5 text-xs text-emerald-400/80">
                {success}
              </p>
            </div>

          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-300 shadow-lg backdrop-blur-xl">

            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-400 text-xs font-black">
              !
            </div>

            <p className="text-sm font-semibold">
              {error}
            </p>

          </div>
        )}

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <section className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl lg:grid-cols-[0.85fr_1.4fr]">

          {/* =================================================
              LEFT INFORMATION
          ================================================= */}

          <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 lg:border-b-0 lg:border-r">

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative">

              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400 ring-1 ring-cyan-500/10">
                <FileText size={26} />
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                Student Voice
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Your Voice Matters
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Every meaningful idea starts with someone
                willing to speak up. Share your proposal
                and help MJPCSU understand what students
                need.
              </p>

              {/* Benefits */}

              <div className="mt-8 space-y-3">

                <div className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition duration-300 hover:border-cyan-500/10 hover:bg-cyan-500/5">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-200">
                      Share your ideas
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Suggest improvements and new initiatives.
                    </p>
                  </div>

                </div>

                <div className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition duration-300 hover:border-cyan-500/10 hover:bg-cyan-500/5">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <CalendarDaysIcon />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-200">
                      Suggest activities
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Recommend events and student programs.
                    </p>
                  </div>

                </div>

                <div className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition duration-300 hover:border-cyan-500/10 hover:bg-cyan-500/5">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <HeartHandshake size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-200">
                      Improve the community
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Help make MJPCSU more useful for students.
                    </p>
                  </div>

                </div>

              </div>

              {/* Recipient */}

              <div className="mt-8 rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Send size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
                      Proposal Recipient
                    </p>

                    <p className="mt-1 break-all text-sm font-bold text-cyan-300">
                      sksabuj653@gmail.com
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT FORM
          ================================================= */}

          <div className="bg-slate-900/50 p-6 sm:p-8 lg:p-10">

            <div className="mb-8">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <MessageSquareText size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">
                    New Submission
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Submit Your Proposal
                  </h2>
                </div>

              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Describe your idea clearly so it can be
                understood and considered properly.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* =================================================
                  TITLE
              ================================================= */}

              <div>

                <label
                  htmlFor="proposal-title"
                  className="mb-2.5 block text-xs font-black uppercase tracking-wider text-slate-400"
                >
                  Proposal Title
                </label>

                <div className="relative">

                  <Lightbulb
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="proposal-title"
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Blood Donation Campaign"
                    required
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/5"
                  />

                </div>

              </div>

              {/* =================================================
                  MESSAGE
              ================================================= */}

              <div>

                <div className="mb-2.5 flex items-center justify-between gap-3">

                  <label
                    htmlFor="proposal-message"
                    className="block text-xs font-black uppercase tracking-wider text-slate-400"
                  >
                    Your Proposal
                  </label>

                  <span className="text-[10px] font-bold text-slate-700">
                    Be clear & respectful
                  </span>

                </div>

                <textarea
                  id="proposal-message"
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Write your proposal or suggestion here..."
                  rows={9}
                  required
                  className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-sm leading-7 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/5"
                />

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-700">
                  <MessageSquareText size={13} />
                  Explain the idea, purpose, and expected benefit.
                </div>

              </div>

              {/* =================================================
                  SUBMIT BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={sending}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-blue-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-cyan-950/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {/* Shine */}

                <span className="absolute inset-y-0 -left-20 w-20 -skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[120%]" />

                <Send
                  size={18}
                  className={`relative transition-transform duration-300 ${
                    sending
                      ? "animate-pulse"
                      : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  }`}
                />

                <span className="relative">
                  {sending
                    ? "Sending Proposal..."
                    : "Send Proposal"}
                </span>

              </button>

              {/* Security note */}

              <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-700">
                <ShieldCheck
                  size={14}
                  className="text-emerald-500/60"
                />

                Your proposal will be sent directly to
                the President.
              </div>

            </form>
          </div>

        </section>

        {/* =====================================================
            BOTTOM MESSAGE
        ===================================================== */}

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5 p-6 text-center shadow-xl backdrop-blur-xl sm:p-8">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Sparkles size={21} />
          </div>

          <h3 className="mt-4 text-lg font-black text-white">
            Great communities grow from great ideas.
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Don't hesitate to share your thoughts.
            Your suggestion could become the next
            meaningful initiative for MJPCSU.
          </p>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="mt-7 text-center">

          <p className="text-xs font-medium text-slate-700">
            MJPCSU Member Portal
            <span className="mx-2 text-slate-800">
              •
            </span>
            Proposal System
          </p>

        </div>

      </div>
    </div>
  );
}

/*
  Small inline icon component.
  Keeps the page dependency-free.
*/
function CalendarDaysIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect
        width="18"
        height="18"
        x="3"
        y="4"
        rx="2"
      />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

export default Proposal;

