import { Loader2 } from "lucide-react";

export default function PageLoader({ title = "Loading...", text = "Please wait." }) {
  return (
    <section className="empty-dashboard glass-card">
      <Loader2 size={34} className="spin status-loading" />
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </section>
  );
}
