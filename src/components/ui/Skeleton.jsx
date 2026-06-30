export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
  return (
    <article className="glass-card skeleton-card">
      <Skeleton className="skeleton-icon" />
      <Skeleton className="skeleton-title" />
      <Skeleton className="skeleton-line" />
      <Skeleton className="skeleton-line short" />
      <Skeleton className="skeleton-button" />
    </article>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <section className="capsule-grid">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </section>
  );
}
