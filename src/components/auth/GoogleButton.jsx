import { authApi } from "../../api/authApi.js";

export default function GoogleButton() {
  function handleGoogleLogin() {
    window.location.href = authApi.googleLoginUrl();
  }

  return (
    <button type="button" className="google-button" onClick={handleGoogleLogin}>
      <span className="google-icon">G</span>
      Continue with Google
    </button>
  );
}
