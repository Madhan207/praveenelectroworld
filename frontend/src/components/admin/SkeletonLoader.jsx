export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton rounded-2xl ${className}`} style={{ minHeight: '140px' }} />
);

export const SkeletonRow = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="skeleton h-4 rounded-lg" style={{ width: `${60 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="admin-card overflow-hidden">
    <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--admin-border)' }}>
      <div className="skeleton h-5 rounded-lg w-32" />
    </div>
    <table className="w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonStats = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
