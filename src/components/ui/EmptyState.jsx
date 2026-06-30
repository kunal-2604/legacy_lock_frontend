export default function EmptyState({
  icon,
  eyebrow,
  title,
  text,
  action,
}) {
  return (
    <section className="empty-dashboard glass-card empty-state-polished">
      {icon && <div className="empty-icon">{icon}</div>}

      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <h3>{title}</h3>

      {text && <p className="muted">{text}</p>}

      {action && <div className="empty-state-action">{action}</div>}
    </section>
  );
}
