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
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        setError("Current password is incorrect.");
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-sm text-slate-400">
            Loading profile...
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={40} />

          <h2 className="text-xl font-bold">
            Profile Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            We could not find your member profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Member Account
          </p>

          <h1 className="text-3xl font-black sm:text-4xl">
            My Profile
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            View your member information and securely manage your account.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ================= PROFILE CARD ================= */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

            {/* Profile Header */}
            <div className="mb-8 flex items-center gap-4">

              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.full_name}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-cyan-500/20"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <User size={34} />
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold">
                  {member.full_name}
                </h2>

                <p className="mt-1 text-sm text-cyan-400">
                  Student ID: {member.member_id}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                  {member.role}
                </span>
              </div>
            </div>

            {/* Information */}
            <div className="space-y-3">

              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <Mail className="text-cyan-400" size={20} />

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="text-sm font-medium text-slate-200">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <Phone className="text-cyan-400" size={20} />

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-slate-200">
                    {member.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <ShieldCheck className="text-cyan-400" size={20} />

                <div>
                  <p className="text-xs text-slate-500">
                    Account Status
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      member.is_active
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ================= PASSWORD CARD ================= */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Lock size={23} />
              </div>

              <h2 className="text-xl font-bold">
                Change Password
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Update your account password securely.
              </p>
            </div>

            {/* Success */}
            {message && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                <CheckCircle2 size={18} />
                {message}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">

              {/* Current Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
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
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                  >
                    {showNew ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Minimum 6 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                  >
                    {showConfirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={passwordLoading}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock size={17} />

                {passwordLoading
                  ? "Changing Password..."
                  : "Change Password"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;