import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./auth/ProtectedRoute.jsx";
import { PublicOnlyRoute } from "./auth/PublicOnlyRoute.jsx";

import Landing from "./pages/public/Landing.jsx";
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import VerifyEmail from "./pages/public/VerifyEmail.jsx";
import ForgotPassword from "./pages/public/ForgotPassword.jsx";
import ResetPassword from "./pages/public/ResetPassword.jsx";
import OAuthSuccess from "./pages/public/OAuthSuccess.jsx";

import AppHome from "./pages/AppHome.jsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import ReceiverDashboard from "./pages/receiver/ReceiverDashboard.jsx";
import AppPlaceholder from "./pages/AppPlaceholder.jsx";

import CapsulesPage from "./pages/owner/CapsulesPage.jsx";
import NewCapsulePage from "./pages/owner/NewCapsulePage.jsx";
import CapsuleDetailPage from "./pages/owner/CapsuleDetailPage.jsx";
import ReceiversPage from "./pages/owner/ReceiversPage.jsx";
import CheckInsPage from "./pages/owner/CheckInsPage.jsx";
import ReleaseStatusPage from "./pages/owner/ReleaseStatusPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/success" element={<OAuthSuccess />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner"
        element={
          <ProtectedRoute requiredRole="OWNER">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/capsules"
        element={
          <ProtectedRoute requiredRole="OWNER">
            <CapsulesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/capsules/new"
        element={
          <ProtectedRoute requiredRole="OWNER">
            <NewCapsulePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/capsules/:capsuleId"
        element={
          <ProtectedRoute requiredRole="OWNER">
            <CapsuleDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/receivers"
        element={
          <ProtectedRoute requiredRole="OWNER">
            <ReceiversPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/check-ins"
        element={
          <ProtectedRoute requiredRole="OWNER">
            <CheckInsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/capsules/:capsuleId/release-status"
        element={
          <ProtectedRoute requiredRole="OWNER">
            <ReleaseStatusPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receiver"
        element={
          <ProtectedRoute requiredRole="RECEIVER">
            <ReceiverDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receiver/capsules"
        element={
          <ProtectedRoute requiredRole="RECEIVER">
            <AppPlaceholder
              area="Receiver Inbox"
              title="Released capsules coming next"
              text="Milestone 6 will add released capsule list and detail pages."
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
