import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "../../layouts/AuthLayout.jsx";
import { useAuth } from "../../auth/AuthProvider.jsx";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveOAuthSession } = useAuth();

  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const roles =
      searchParams.get("roles") ||
      searchParams.get("role") ||
      searchParams.get("authorities") ||
      "";
    const tokenType = searchParams.get("tokenType") || "Bearer";

    if (!accessToken || !refreshToken) {
      toast.error("Google login failed. Missing tokens.");
      navigate("/login", { replace: true });
      return;
    }

    saveOAuthSession({
      accessToken,
      refreshToken,
      email,
      name,
      roles,
      tokenType,
    });

    window.history.replaceState({}, document.title, "/oauth2/success");

    toast.success("Google login successful.");
    navigate("/app", { replace: true });
  }, [navigate, saveOAuthSession, searchParams]);

  return (
    <AuthLayout
      eyebrow="Google OAuth"
      title="Completing secure login"
      subtitle="Please wait while we prepare your workspace."
    >
      <div className="auth-status-center">
        <Loader2 size={56} className="spin status-loading" />
      </div>
    </AuthLayout>
  );
}
