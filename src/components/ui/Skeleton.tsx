function Base({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={{ borderRadius: 'var(--radius-md)', ...style }} />;
}

function Text({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Base
          key={i}
          className="h-3"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

function Circle({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <Base
      className={className}
      style={{ width: size, height: size, borderRadius: 'var(--radius-full)' }}
    />
  );
}

function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)' }}
    >
      <Base className="w-full" style={{ aspectRatio: '4/5', borderRadius: 0 }} />
      <div className="p-3 flex flex-col gap-2">
        <Base className="h-3 w-3/4" />
        <Base className="h-3 w-1/2" />
        <Base className="h-4 w-1/3 mt-1" />
      </div>
    </div>
  );
}

const Skeleton = Object.assign(Base, {
  Text,
  Circle,
  Card: CardSkeleton,
});

export default Skeleton;
