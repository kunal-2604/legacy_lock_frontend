import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";
import GoogleButton from "../../components/auth/GoogleButton.jsx";
import AuthDivider from "../../components/auth/AuthDivider.jsx";
import { authApi } from "../../api/authApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "OWNER",
  });

  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password should be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await authApi.register(form);

      setRegisteredEmail(form.email);
      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Registration failed."));
    } finally {
      setLoading(false);
    }
  }

  if (registeredEmail) {
    return (
      <AuthLayout
        eyebrow="Verify your email"
        title="Check your inbox"
        subtitle="Your account was created, but login is locked until email verification is complete."
        footer={
          <p>
            Already verified? <Link to="/login">Go to login</Link>
          </p>
        }
      >
        <div className="auth-success-box">
          <div className="auth-success-icon">
            <MailCheck size={34} />
          </div>

          <h3>Verification email sent</h3>
          <p className="muted">
            We sent a verification link to <strong>{registeredEmail}</strong>.
            Open the email and click the verification button.
          </p>

          <Link to="/login" className="glass-button primary full-button">
            I have verified my email
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Start your secure legacy vault"
      subtitle="Create one account that can work as both owner and receiver."
      footer={
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField
          label="Full name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Kunal Chandak"
          autoComplete="name"
          required
        />

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
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          helper="Use a strong password. Login starts only after email verification."
          required
        />

        <SubmitButton loading={loading}>
          {loading ? "Creating account..." : "Create account"}
        </SubmitButton>

        <AuthDivider />
        <GoogleButton />
      </form>
    </AuthLayout>
  );
}
