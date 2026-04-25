/**
 * CARD COMPONENT SKELETON INTEGRATION PATTERN
 * 
 * This file shows the exact pattern to follow when adding skeleton
 * loading support to any card component in HireFold.
 * 
 * Copy this pattern for:
 * - HiringSnapshotCard
 * - CandidateMatchCard
 * - EvaluationToolCard
 * - CareerDomainCard
 * - InDemandRoleCard
 * - Any other card component
 */

// ============================================================
// BEFORE: Original Card Component (without skeleton)
// ============================================================

// import React from "react";
// 
// function HiringSnapshotCard({ data }) {
//   return (
//     <div className="hs-card">
//       <div className="hs-card-inner">
//         <div className="hs-card-image-wrapper">
//           <img src={data.image} className="hs-card-image" />
//         </div>
//         <div className="hs-card-body">
//           <h3 className="hs-card-title">{data.title}</h3>
//           <p className="hs-card-description">{data.description}</p>
//           <div className="hs-card-actions">
//             <button className="hs-card-btn">View</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// 
// export default HiringSnapshotCard;

// ============================================================
// AFTER: Enhanced with Skeleton Support
// ============================================================

import React from "react";
import Skeleton from "@/Components/Common/Skeleton";

function HiringSnapshotCard({ data, isLoading = false }) {
  // If data is loading, show skeleton
  if (isLoading) {
    return (
      <div className="hs-card">
        <div className="hs-card-inner">
          {/* Image skeleton */}
          <div className="hs-card-image-wrapper">
            <Skeleton
              variant="card"
              height={200}
              className="skeleton-card-image"
            />
          </div>
          {/* Content skeleton */}
          <div className="hs-card-body">
            <Skeleton width="70%" height={18} />
            <Skeleton width="100%" height={12} style={{ marginTop: "8px" }} />
            <Skeleton width="85%" height={12} style={{ marginTop: "8px" }} />
            <div style={{ marginTop: "12px" }}>
              <Skeleton width="40%" height={32} variant="button" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show real content when loaded
  return (
    <div className="hs-card">
      <div className="hs-card-inner">
        <div className="hs-card-image-wrapper">
          <img src={data.image} className="hs-card-image" />
        </div>
        <div className="hs-card-body">
          <h3 className="hs-card-title">{data.title}</h3>
          <p className="hs-card-description">{data.description}</p>
          <div className="hs-card-actions">
            <button className="hs-card-btn">View</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default HiringSnapshotCard;

// ============================================================
// USAGE IN PARENT COMPONENT (Page/Container)
// ============================================================

// import HiringSnapshotCard from "@/Components/Cards/HiringSnapshotCard";
// import { useState, useEffect } from "react";
//
// function HiringSnapshotSection() {
//   const [cards, setCards] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     fetchHiringSnapshots()
//       .then((data) => {
//         setCards(data);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         
//         setIsLoading(false);
//       });
//   }, []);
//
//   return (
//     <section className="hiring-snapshots">
//       <div className="hiring-snapshots-grid">
//         {isLoading ? (
//           // Show 4 skeleton cards while loading
//           <>
//             <HiringSnapshotCard isLoading={true} />
//             <HiringSnapshotCard isLoading={true} />
//             <HiringSnapshotCard isLoading={true} />
//             <HiringSnapshotCard isLoading={true} />
//           </>
//         ) : cards.length > 0 ? (
//           // Show real cards once loaded
//           cards.map((card) => (
//             <HiringSnapshotCard key={card.id} data={card} />
//           ))
//         ) : (
//           // Show empty state if no cards
//           <p>No hiring snapshots available</p>
//         )}
//       </div>
//     </section>
//   );
// }

// ============================================================
// ALTERNATIVE: Dynamic Card Count Skeleton
// ============================================================

// If you want to show the exact number of skeleton cards:

// function HiringSnapshotSection() {
//   const [cards, setCards] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [expectedCount, setExpectedCount] = useState(4); // or fetch this
//
//   useEffect(() => {
//     fetchHiringSnapshots()
//       .then((data) => {
//         setCards(data);
//         setIsLoading(false);
//       });
//   }, []);
//
//   const displayCards = isLoading ? expectedCount : cards.length;
//
//   return (
//     <div className="hiring-snapshots-grid">
//       {Array.from({ length: displayCards }).map((_, i) => (
//         <HiringSnapshotCard
//           key={i}
//           data={isLoading ? null : cards[i]}
//           isLoading={isLoading}
//         />
//       ))}
//     </div>
//   );
// }

// ============================================================
// LIST COMPONENT SKELETON INTEGRATION
// ============================================================

// For list/table components, use similar pattern:

// function JobsList({ jobs, isLoading = false }) {
//   if (isLoading) {
//     return (
//       <div className="jobs-list">
//         <div className="jobs-list-item skeleton">
//           <Skeleton width="60%" height={16} />
//           <Skeleton width="100%" height={12} style={{ marginTop: "8px" }} />
//           <Skeleton width="40%" height={12} style={{ marginTop: "8px" }} />
//         </div>
//         <div className="jobs-list-item skeleton">
//           <Skeleton width="60%" height={16} />
//           <Skeleton width="100%" height={12} style={{ marginTop: "8px" }} />
//           <Skeleton width="40%" height={12} style={{ marginTop: "8px" }} />
//         </div>
//         <div className="jobs-list-item skeleton">
//           <Skeleton width="60%" height={16} />
//           <Skeleton width="100%" height={12} style={{ marginTop: "8px" }} />
//           <Skeleton width="40%" height={12} style={{ marginTop: "8px" }} />
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="jobs-list">
//       {jobs.map((job) => (
//         <JobListItem key={job.id} job={job} />
//       ))}
//     </div>
//   );
// }

// ============================================================
// KEY POINTS
// ============================================================

/**
 *  DO:
 * - Add isLoading prop to components
 * - Check isLoading before rendering content
 * - Mirror exact layout in skeleton
 * - Use Skeleton component from Common/Skeleton.jsx
 * - Adjust skeleton heights to match real content
 * - Handle errors gracefully (still show UI, not skeleton)
 *
 *  DON'T:
 * - Use inline style animations
 * - Create custom skeleton markup
 * - Leave skeleton showing indefinitely
 * - Change component layout between skeleton/real
 * - Import Skeleton multiple times in same file
 *
 *  SIZING:
 * - Text: 12px-16px height
 * - Titles: 18px-24px height
 * - Images: match real image height (usually 200px)
 * - Buttons: 32px-40px height
 *
 *  STYLING:
 * - Skeleton color: var(--border) or var(--card)
 * - Border radius: 4px-8px for text, 18px for cards
 * - Spacing: match real component gaps
 * - Width: usually 100%, or specific percentages
 */

// ============================================================
// OPTIONAL: Create a Wrapper Component
// ============================================================

// If you want to make skeleton integration even easier:

// function CardWithSkeleton({
//   CardComponent,
//   data,
//   isLoading,
//   skeletonCount = 4,
// }) {
//   return isLoading ? (
//     <>
//       {Array.from({ length: skeletonCount }).map((_, i) => (
//         <div key={i} className="card-skeleton">
//           <Skeleton variant="card" />
//         </div>
//       ))}
//     </>
//   ) : (
//     <CardComponent data={data} />
//   );
// }

// export default HiringSnapshotCard;

