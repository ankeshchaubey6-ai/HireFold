import React from "react";
import Skeleton from "./Skeleton";

/**
 * CardSkeleton  Matches card component layout
 * Used for HiringSnapshot, CandidateMatch, EvaluationTool, etc.
 */
export const CardSkeleton = ({ variant = "standard" }) => {
  return (
    <div className="skeleton--card">
      {/* Image area */}
      <Skeleton variant="card" height={200} className="skeleton-card-image" />
      {/* Content area */}
      <div className="skeleton-card-body">
        <Skeleton width="70%" height={18} className="skeleton-card-title" />
        <Skeleton width="100%" height={12} />
        <Skeleton width="85%" height={12} />
        <div style={{ marginTop: "12px" }}>
          <Skeleton width="40%" height={14} />
        </div>
      </div>
    </div>
  );
};

/**
 * CardGridSkeleton  Grid of multiple card skeletons
 */
export const CardGridSkeleton = ({ count = 4 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * TableRowSkeleton  Matches table row structure
 */
export const TableRowSkeleton = ({ columns = 5, count = 5 }) => {
  return (
    <div className="skeleton-table">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} height={16} />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * ListSkeleton  Vertical list of skeleton items
 */
export const ListSkeleton = ({ count = 5, variant = "standard" }) => {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ paddingBottom: "12px" }}>
          <Skeleton width="100%" height={16} />
          <Skeleton width="85%" height={12} style={{ marginTop: "8px" }} />
        </div>
      ))}
    </div>
  );
};

/**
 * HeaderSkeleton  Section header with title and subtitle
 */
export const HeaderSkeleton = () => {
  return (
    <div className="skeleton-header">
      <Skeleton width="50%" height={28} />
      <Skeleton width="35%" height={14} style={{ marginTop: "8px" }} />
    </div>
  );
};

/**
 * StatsCardSkeleton  Metric/stats card
 */
export const StatsCardSkeleton = ({ count = 4 }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: "16px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ padding: "16px", borderRadius: "12px", backgroundColor: "var(--card)" }}>
          <Skeleton width="60%" height={12} style={{ marginBottom: "8px" }} />
          <Skeleton width="80%" height={24} style={{ marginBottom: "8px" }} />
          <Skeleton width="40%" height={10} />
        </div>
      ))}
    </div>
  );
};

/**
 * DetailsSkeleton  Multi-line details/description skeleton
 */
export const DetailsSkeleton = () => {
  return (
    <div>
      <Skeleton width="100%" height={12} style={{ marginBottom: "8px" }} />
      <Skeleton width="98%" height={12} style={{ marginBottom: "8px" }} />
      <Skeleton width="95%" height={12} style={{ marginBottom: "8px" }} />
      <Skeleton width="90%" height={12} />
    </div>
  );
};

/**
 * ProfileSkeleton  Profile/user card with avatar and details
 */
export const ProfileSkeleton = () => {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <Skeleton variant="avatar" width={64} height={64} />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height={16} style={{ marginBottom: "6px" }} />
        <Skeleton width="80%" height={12} style={{ marginBottom: "6px" }} />
        <Skeleton width="50%" height={10} />
      </div>
    </div>
  );
};

export default Skeleton;

