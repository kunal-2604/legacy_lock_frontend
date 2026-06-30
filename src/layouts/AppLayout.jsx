import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Boxes,
  CheckCircle2,
  FileLock2,
  Home,
  Inbox,
  LogOut,
  Menu,
  Shield,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../auth/AuthProvider.jsx";
import { isOwner, isReceiver } from "../auth/roleUtils.js";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userIsOwner = isOwner(user);
  const userIsReceiver = isReceiver(user);

  const isOwnerArea = location.pathname.startsWith("/owner");
  const isReceiverArea = location.pathname.startsWith("/receiver");

  return (
    <main className="app-shell dashboard-shell">
      <aside className={`app-sidebar glass-card ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <Link to="/app" className="brand sidebar-brand">
            <span className="brand-mark image-brand-mark">
              <img src="/logo.png" alt="LegacyLock" />
            </span>
            <span>LegacyLock</span>
          </Link>

          <button
            className="sidebar-logout-button"
            type="button"
            onClick={logout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>

        <div className="profile-mini">
          <div className="profile-avatar">
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user?.name || "LegacyLock User"}</strong>
            <span>{user?.email}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavItem to="/app" icon={<Home size={18} />} label="Overview" />

          {userIsOwner && (
            <>
              <div className="sidebar-label">Owner</div>

              <NavItem
                to="/owner"
                icon={<Shield size={18} />}
                label="Dashboard"
              />

              <NavItem
                to="/owner/capsules"
                icon={<FileLock2 size={18} />}
                label="Capsules"
              />

              <NavItem
                to="/owner/receivers"
                icon={<UserRoundPlus size={18} />}
                label="Receivers"
              />

              <NavItem
                to="/owner/check-ins"
                icon={<CheckCircle2 size={18} />}
                label="Check-ins"
              />
            </>
          )}

          {userIsReceiver && (
            <>
              <div className="sidebar-label">Receiver</div>

              <NavItem
                to="/receiver"
                icon={<Inbox size={18} />}
                label="Inbox"
              />

              <NavItem
                to="/receiver/capsules"
                icon={<Boxes size={18} />}
                label="Released Capsules"
              />
            </>
          )}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <section className="dashboard-main">
        <header className="topbar glass-card">
          <button
            className="mobile-menu-button"
            type="button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div>
            <p className="eyebrow topbar-eyebrow">
              {isOwnerArea
                ? "Owner Workspace"
                : isReceiverArea
                  ? "Receiver Inbox"
                  : "Workspace Overview"}
            </p>

            <h1>
              {isOwnerArea
                ? "Manage your vault"
                : isReceiverArea
                  ? "Released capsules"
                  : "Choose your workspace"}
            </h1>
          </div>

          <div className="topbar-actions">
            <ThemeToggle compact />

            <div className="topbar-status">
              <span className="status-dot" />
              Protected
            </div>
          </div>
        </header>

        <div className="dashboard-content">{children}</div>
      </section>
    </main>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/app" || to === "/owner" || to === "/receiver"}
      className={({ isActive }) =>
        isActive ? "sidebar-link active" : "sidebar-link"
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
