import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { KeyRound, ShieldAlert, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import FormInput from "../components/FormInput";
import ConfirmModal from "../components/ConfirmModal";
import { getApiErrorMessage } from "../utils/apiError";
import { validatePasswordChange, validateProfile } from "../utils/validation";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    const errors = validateProfile(profileForm);

    if (Object.keys(errors).length) {
      setProfileErrors(errors);
      return;
    }

    setProfileSaving(true);

    try {
      const { data } = await api.patch("/account/profile", {
        name: profileForm.name.trim(),
        email: profileForm.email.trim()
      });
      login(data);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update profile."));
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const errors = validatePasswordChange(passwordForm);

    if (Object.keys(errors).length) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordSaving(true);

    try {
      const { data } = await api.post("/account/password", passwordForm);
      login(data);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success(data.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to change password."));
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);

    try {
      await api.delete("/account", {
        data: {
          confirmation
        }
      });
      logout();
      toast.success("Your account has been deleted.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete account."));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <div className="rounded-[2rem] glass-panel p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-white/10 bg-brand-400/10 p-3 text-brand-300">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">Profile settings</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">Update your name and email.</p>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleProfileSubmit}>
            <FormInput
              label="Name"
              value={profileForm.name}
              onChange={(event) => {
                setProfileForm((current) => ({ ...current, name: event.target.value }));
                setProfileErrors((current) => ({ ...current, name: "" }));
              }}
              error={profileErrors.name}
            />
            <FormInput
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(event) => {
                setProfileForm((current) => ({ ...current, email: event.target.value }));
                setProfileErrors((current) => ({ ...current, email: "" }));
              }}
              error={profileErrors.email}
            />
            <button
              type="submit"
              disabled={profileSaving}
              className="btn btn-primary"
            >
              {profileSaving ? "Saving..." : "Save profile"}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] glass-panel p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-white/10 bg-sky-400/10 p-3 text-sky-300">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">Security</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">Change your password.</p>
            </div>
          </div>

          {user?.authProvider === "google" ? (
            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5 text-sm leading-7 text-slate-400">
              Password changes are not available for Google sign-in.
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handlePasswordSubmit}>
              <FormInput
                label="Current password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => {
                  setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }));
                  setPasswordErrors((current) => ({ ...current, currentPassword: "" }));
                }}
                error={passwordErrors.currentPassword}
              />
              <FormInput
                label="New password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => {
                  setPasswordForm((current) => ({ ...current, newPassword: event.target.value }));
                  setPasswordErrors((current) => ({ ...current, newPassword: "" }));
                }}
                error={passwordErrors.newPassword}
              />
              <button
                type="submit"
                disabled={passwordSaving}
                className="btn btn-secondary"
              >
                {passwordSaving ? "Updating..." : "Change password"}
              </button>
            </form>
          )}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-rose-500/18 bg-[linear-gradient(180deg,rgba(127,29,29,0.08),rgba(15,23,42,0.86))] p-6 shadow-glass backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/12 p-3 text-rose-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">Danger zone</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">Delete your account and data.</p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.6rem] border border-rose-500/18 bg-slate-950/50 p-5">
          <h3 className="text-lg font-semibold tracking-[-0.03em] text-white">Delete account</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">This action is permanent.</p>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="btn btn-danger mt-6"
          >
            Delete account
          </button>
        </div>
      </aside>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setConfirmation("");
        }}
        onConfirm={handleDeleteAccount}
        title="Delete your account?"
        description="Type DELETE to confirm permanent account removal."
        confirmLabel="Delete forever"
        loading={deleteLoading}
      >
        <FormInput
          label="Confirmation"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          placeholder="Type DELETE"
        />
      </ConfirmModal>
    </div>
  );
};

export default SettingsPage;
