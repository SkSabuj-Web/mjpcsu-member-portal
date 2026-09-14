import { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lightbulb,
  Send,
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

      setSuccess("Your proposal has been sent successfully! 🎉");

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
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-cyan-600"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 shadow-sm">
            <Lightbulb size={32} />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-600">
            MJPCSU Member Portal
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Submit a Proposal
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Have an idea or suggestion for MJPCSU? Share your proposal
            directly with the President.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-5">

          {/* Information */}
          <div className="relative overflow-hidden bg-slate-900 p-6 text-white sm:p-8 md:col-span-2">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-2xl" />

            <div className="relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                <FileText size={24} />
              </div>

              <h2 className="text-2xl font-bold">
                Your Voice Matters
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Every good idea can help improve our student community.
                Submit your proposal and share your thoughts with the
                MJPCSU President.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                  <p className="text-sm text-slate-300">
                    Share your ideas and suggestions
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                  <p className="text-sm text-slate-300">
                    Suggest events and student activities
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                  <p className="text-sm text-slate-300">
                    Help make MJPCSU better
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Proposal Recipient
                </p>

                <p className="mt-1 break-all text-sm font-medium text-cyan-300">
                  sksabuj653@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div>
                <label
                  htmlFor="proposal-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Proposal Title
                </label>

                <input
                  id="proposal-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Blood Donation Campaign"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="proposal-message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Your Proposal
                </label>

                <textarea
                  id="proposal-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your proposal or suggestion here..."
                  rows={8}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Please describe your idea clearly and respectfully.
                </p>
              </div>

              {/* Success */}
              {success && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  <CheckCircle2 size={20} />
                  {success}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <Send
                  size={18}
                  className={sending ? "animate-pulse" : ""}
                />

                {sending ? "Sending Proposal..." : "Send Proposal"}
              </button>

              <p className="text-center text-xs text-slate-400">
                Your proposal will be sent directly to the President.
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            MJPCSU Member Portal • Proposal System
          </p>
        </div>
      </div>
    </div>
  );
}

export default Proposal;