import AppLayout from "../layouts/AppLayout.jsx";

export default function AppPlaceholder({ area, title, text }) {
  return (
    <AppLayout>
      <section className="empty-dashboard glass-card">
        <p className="eyebrow">{area}</p>
        <h3>{title}</h3>
        <p className="muted">{text}</p>
      </section>
    </AppLayout>
  );
}
