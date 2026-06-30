import { AlertTriangle, Bell, CheckCircle2, Clock, Send } from "lucide-react";

import { formatDateTime } from "../../utils/dateUtils.js";

export default function ReminderTimeline({ policy }) {
  if (!policy) {
    return (
      <section className="glass-card reminder-panel">
        <p className="eyebrow">Reminder Plan</p>
        <h3>No release policy yet</h3>
        <p className="muted">
          Reminder steps will appear after you create a release policy.
        </p>
      </section>
    );
  }

  const graceDays = policy.graceDays ?? 0;

  if (graceDays === 0) {
    return (
      <section className="glass-card reminder-panel">
        <p className="eyebrow">Reminder Plan</p>
        <h3>No grace-period reminders</h3>
        <p className="muted">
          The reminder period is 0 days, so access may be shared immediately after the check-in deadline.
        </p>
      </section>
    );
  }

  const items = [
    {
      label: "First reminder",
      helper: "Sent when inactivity deadline is reached.",
      value: policy.firstReminderSentAt,
      icon: <Bell size={18} />,
      tone: "warning",
    },
    {
      label: "Second reminder",
      helper: "Sent around the middle of the grace period.",
      value: policy.secondReminderSentAt,
      icon: <Send size={18} />,
      tone: "info",
    },
    {
      label: "Final reminder",
      helper: "Sent one day before release.",
      value: policy.finalReminderSentAt,
      icon: <AlertTriangle size={18} />,
      tone: "danger",
    },
  ];

  return (
    <section className="glass-card reminder-panel">
      <p className="eyebrow">Reminder Plan</p>
      <h3>Owner reminders</h3>
      <p className="muted">
        Review which reminders have been sent and which ones are still pending.
      </p>

      <div className="reminder-timeline">
        {items.map((item) => (
          <article className={`reminder-item ${item.tone}`} key={item.label}>
            <div className="reminder-icon">{item.value ? <CheckCircle2 size={18} /> : item.icon}</div>

            <div>
              <h4>{item.label}</h4>
              <p className="muted">{item.helper}</p>
              <span>
                {item.value ? formatDateTime(item.value) : "Pending"}
              </span>
            </div>
          </article>
        ))}

        <article className="reminder-item release">
          <div className="reminder-icon">
            <Clock size={18} />
          </div>

          <div>
            <h4>Release</h4>
            <p className="muted">After the check-in deadline and reminder period.</p>
            <span>Automatic when due</span>
          </div>
        </article>
      </div>
    </section>
  );
}
