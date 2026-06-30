import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";
import GoogleButton from "../../components/auth/GoogleButton.jsx";
import AuthDivider from "../../components/auth/AuthDivider.jsx";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/app";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(form);
      toast.success("Welcome back to LegacyLock.");
      navigate(from, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, "Login failed.");

      if (
        message.toLowerCase().includes("verify") ||
        message.toLowerCase().includes("verification")
      ) {
        toast.warning("Please verify your email before login.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to your vault"
      subtitle="Access your owner workspace and receiver inbox securely."
      footer={
        <p>
          New to LegacyLock? <Link to="/register">Create an account</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField
          label="Email address"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <FormField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="form-row-between">
          <span />
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <SubmitButton loading={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </SubmitButton>

        <AuthDivider />
        <GoogleButton />
      </form>
    </AuthLayout>
  );
}
