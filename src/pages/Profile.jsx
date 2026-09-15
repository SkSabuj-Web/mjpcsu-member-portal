
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  CircleCheck,
  Fingerprint,
  ArrowUpRight,
} from "lucide-react";

function Profile() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------
  // Load Member Profile
  // --------------------------------
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("members")
        .select(
          "member_id, full_name, email, photo_url, phone, role, is_active"
        )
        .eq("email", user.email)
        .single();

      if (error) {
        console.log("Profile loading error:", error);
      } else {
        setMember(data);
      }

      setLoading(false);
    };

    getProfile();
  }, []);

  // --------------------------------
  // Change Password
  // --------------------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setPasswordLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) {
        setError("User session not found. Please login again.");
        return;
      }

      // Verify current password
      const { error: verifyError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (verifyError) {
        setError("Current password is incorrect.");
        return;
      }

      // Update password
      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log("Password change error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <div className="relative mx-auto mb-5 h-14 w-14">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-cyan-500/20" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900">
              <User className="text-cyan-400" size={24} />
            </div>
          </div>

          <p className="text-sm font-medium text-slate-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Profile not found
  // --------------------------------
  if (!member) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertCircle size={32} />
          </div>

          <h2 className="text-xl font-black">
            Profile Not Found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            We could not find your member profile. Please contact
            the administrator if this problem continues.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/5 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            <Sparkles size={14} />
            Member Account
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            My{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Manage your member information and keep your account
            secure from one place.
          </p>
        </div>

        {/* ================= PROFILE IDENTITY ================= */}

        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="relative overflow-hidden p-6 sm:p-8">
            {/* Top glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 sm:gap-6">

                {/* Avatar */}
                <div className="relative shrink-0">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.full_name}
                      className="h-20 w-20 rounded-2xl object-cover ring-2 ring-cyan-400/30 sm:h-24 sm:w-24"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/20 sm:h-24 sm:w-24">
                      <User size={38} />
                    </div>
                  )}

                  <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-slate-900 bg-emerald-500 text-white">
                    <CircleCheck size={13} />
                  </div>
                </div>

                {/* Identity */}
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Welcome back
                  </p>

                  <h2 className="truncate text-xl font-black sm:text-2xl">
                    {member.full_name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-cyan-400">
                    Student ID: {member.member_id}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
                      <ShieldCheck size={13} />
                      {member.role}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        member.is_active
                          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                          : "border border-red-400/20 bg-red-400/10 text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          member.is_active
                            ? "bg-emerald-400"
                            : "bg-red-400"
                        }`}
                      />
                      {member.is_active ? "Active Account" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security badge */}
              <div className="hidden rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Fingerprint size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Account Security
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-200">
                      Protected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

          {/* ================= MEMBER INFORMATION ================= */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <User size={22} />
              </div>

              <h2 className="text-xl font-black">
                Member Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your registered information is shown below.
              </p>
            </div>

            <div className="space-y-3">

              {/* Email */}
              <div className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-500/30 hover:bg-slate-950">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition group-hover:scale-105">
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">
                    Email Address
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                    {member.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-blue-500/30 hover:bg-slate-950">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:scale-105">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Phone Number
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    {member.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Student ID */}
              <div className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-indigo-500/30 hover:bg-slate-950">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition group-hover:scale-105">
                  <Fingerprint size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Student ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-200">
                    {member.member_id}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-emerald-500/30 hover:bg-slate-950">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition group-hover:scale-105">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Account Status
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      member.is_active
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {member.is_active
                      ? "Active & Verified"
                      : "Inactive"}
                  </p>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
              <div className="flex gap-3">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-cyan-400"
                  size={18}
                />

                <div>
                  <p className="text-sm font-bold text-cyan-300">
                    Account Protection
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Keep your account credentials private and never
                    share your password with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PASSWORD ================= */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <KeyRound size={23} />
                </div>

                <h2 className="text-xl font-black">
                  Change Password
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Update your password to keep your account secure.
                </p>
              </div>

              <div className="hidden rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:block">
                <Lock className="text-cyan-400" size={19} />
              </div>
            </div>

            {/* Success */}
            {message && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-400">
                <CheckCircle2 className="mt-0.5 shrink-0" size={18} />

                <div>
                  <p className="font-bold">Success</p>
                  <p className="mt-0.5 text-xs text-emerald-400/80">
                    {message}
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm text-red-400">
                <AlertCircle className="mt-0.5 shrink-0" size={18} />

                <div>
                  <p className="font-bold">Unable to change password</p>
                  <p className="mt-0.5 text-xs text-red-400/80">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleChangePassword}
              className="space-y-5"
            >

              {/* Current Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label={
                      showCurrent
                        ? "Hide current password"
                        : "Show current password"
                    }
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-cyan-400"
                  >
                    {showCurrent ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={
                      showNew
                        ? "Hide new password"
                        : "Show new password"
                    }
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-cyan-400"
                  >
                    {showNew ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 size={13} />
                  Minimum 6 characters
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-cyan-400"
                  >
                    {showConfirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={passwordLoading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <Lock size={17} />

                {passwordLoading
                  ? "Changing Password..."
                  : "Change Password"}

                {!passwordLoading && (
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </button>
            </form>

            {/* Bottom Security */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-300">
                  Secure Account
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                  Your password is securely managed by Supabase
                  Authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER MESSAGE ================= */}

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 text-center backdrop-blur-xl sm:p-6">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <ShieldCheck className="text-cyan-400" size={18} />

            <p className="text-xs leading-5 text-slate-500 sm:text-sm">
              Keep your profile information accurate and your
              account credentials secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

