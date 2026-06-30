import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";
import { authApi } from "../../api/authApi.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
    } catch {
      // Do not reveal whether email exists.
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  if (sent) {
    return (
      <AuthLayout
        eyebrow="Reset email sent"
        title="Check your inbox"
        subtitle="If this email exists, a reset link has been sent."
        footer={
          <p>
            Remembered your password? <Link to="/login">Back to login</Link>
          </p>
        }
      >
        <div className="auth-success-box">
          <div className="auth-success-icon">
            <MailCheck size={34} />
          </div>

          <h3>Password reset requested</h3>
          <p className="muted">
            Open the email and click the reset password button. The link may
            expire, so use it soon.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Forgot password"
      title="Reset your password"
      subtitle="Enter your email and we will send a secure reset link if the account exists."
      footer={
        <p>
          Remembered your password? <Link to="/login">Back to login</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <SubmitButton loading={loading}>
          {loading ? "Sending reset link..." : "Send reset link"}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
