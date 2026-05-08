import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import FormInput from "../components/FormInput";
import AuthShell from "../components/AuthShell";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { getApiErrorMessage } from "../utils/apiError";
import { validateRegister } from "../utils/validation";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(form);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post("/auth/register", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim()
      });
      login(data);
      toast.success("Account created.");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create account."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async (credential) => {
    setGoogleLoading(true);

    try {
      const { data } = await api.post("/auth/google", { credential });
      login(data);
      toast.success("Your Google account is ready.");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to continue with Google."));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Create your account to get started."
      asideTitle="Start with a clean workspace."
      asideCopy="Create an account to manage tasks and settings."
    >
      <div className="space-y-5">
        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <>
            <GoogleSignInButton onCredential={handleGoogleSignIn} loading={googleLoading} />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.35em] text-slate-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormInput
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Alex Morgan"
            required
            error={errors.name}
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="alex@example.com"
            required
            error={errors.email}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Use at least 8 characters"
            required
            error={errors.password}
          />

          <label className="block">
            <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 text-[0.95rem] text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950/95"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full"
          >
            {submitting ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="font-medium text-brand-300 hover:text-brand-200" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default RegisterPage;
