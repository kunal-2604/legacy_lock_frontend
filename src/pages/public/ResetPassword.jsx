import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../layouts/AuthLayout.jsx";
import FormField from "../../components/ui/FormField.jsx";
import SubmitButton from "../../components/ui/SubmitButton.jsx";
import { authApi } from "../../api/authApi.js";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearSession } = useAuth();

  const token = searchParams.get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token) {
      toast.error("Reset link is missing or incomplete.");
      return;
    }

    if (!form.newPassword || !form.confirmPassword) {
      toast.error("Please fill both password fields.");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error("Password should be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        token,
        newPassword: form.newPassword,
      });

      clearSession();
      setSuccess(true);
      toast.success("Password reset successfully.");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Password reset failed."));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthLayout
        eyebrow="Password updated"
        title="Your password has been reset"
        subtitle="You can now login with your new password."
      >
        <div className="auth-status-center">
          <CheckCircle2 size={64} className="status-success" />
          <Link to="/login" className="glass-button primary full-button">
            Continue to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Reset password"
      title="Create a new password"
      subtitle="Enter a strong password to secure your LegacyLock account."
      footer={
        <p>
          Need a new link? <Link to="/forgot-password">Request again</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {!token && (
          <div className="inline-alert danger">
            This reset link is missing information. Please request a new password reset link.
          </div>
        )}

        <FormField
          label="New password"
          type="password"
          value={form.newPassword}
          onChange={(e) => updateField("newPassword", e.target.value)}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          required
        />

        <FormField
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          placeholder="Repeat new password"
          autoComplete="new-password"
          required
        />

        <SubmitButton loading={loading}>
          {loading ? "Updating password..." : "Reset password"}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
