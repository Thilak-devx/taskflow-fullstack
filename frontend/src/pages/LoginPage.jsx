import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import FormInput from "../components/FormInput";
import AuthShell from "../components/AuthShell";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { getApiErrorMessage } from "../utils/apiError";
import { validateLogin } from "../utils/validation";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
    const nextErrors = validateLogin(form);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password
      });
      login(data);
      toast.success("Signed in.");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to sign in."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async (credential) => {
    setGoogleLoading(true);

    try {
      const { data } = await api.post("/auth/google", { credential });
      login(data);
      toast.success("Signed in with Google.");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to continue with Google."));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your tasks and account."
      asideTitle="Manage work with clarity."
      asideCopy="Sign in to view tasks, updates, and settings."
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
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            error={errors.email}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            error={errors.password}
          />

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-slate-400">
          Need an account?{" "}
          <Link className="font-medium text-brand-300 hover:text-brand-200" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default LoginPage;
