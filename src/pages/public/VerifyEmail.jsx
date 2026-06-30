import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import AuthLayout from "../../layouts/AuthLayout.jsx";
import { authApi } from "../../api/authApi.js";
import { getApiErrorMessage } from "../../utils/errorParser.js";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const calledRef = useRef(false);

  const [state, setState] = useState({
    loading: true,
    success: false,
    message: "",
  });

  useEffect(() => {
    async function verify() {
      if (calledRef.current) return;
      calledRef.current = true;

      if (!token) {
        setState({
          loading: false,
          success: false,
          message: "Verification token is missing from the URL.",
        });
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);

        setState({
          loading: false,
          success: true,
          message:
            typeof response.data === "string"
              ? response.data
              : "Email verified successfully.",
        });
      } catch (error) {
        setState({
          loading: false,
          success: false,
          message: getApiErrorMessage(
            error,
            "Verification link is invalid or expired."
          ),
        });
      }
    }

    verify();
  }, [token]);

  return (
    <AuthLayout
      eyebrow="Email verification"
      title={
        state.loading
          ? "Verifying your email"
          : state.success
            ? "Email verified"
            : "Verification failed"
      }
      subtitle={
        state.loading
          ? "Please wait while we confirm your secure account."
          : state.message
      }
      footer={
        <p>
          Need to sign in? <Link to="/login">Go to login</Link>
        </p>
      }
    >
      <div className="auth-status-center">
        {state.loading && <Loader2 size={56} className="spin status-loading" />}
        {!state.loading && state.success && (
          <CheckCircle2 size={64} className="status-success" />
        )}
        {!state.loading && !state.success && (
          <XCircle size={64} className="status-danger" />
        )}

        {!state.loading && state.success && (
          <Link to="/login" className="glass-button primary full-button">
            Continue to login
          </Link>
        )}

        {!state.loading && !state.success && (
          <Link to="/register" className="glass-button ghost full-button">
            Create account again
          </Link>
        )}
      </div>
    </AuthLayout>
  );
}
