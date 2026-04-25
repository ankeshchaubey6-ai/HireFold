/**
 * SKELETON QUICK REFERENCE CARD
 * 
 * Copy-paste ready code snippets for common patterns.
 * Keep this open while implementing!
 */

// ============================================================
// IMPORT STATEMENTS
// ============================================================

// For single skeleton component:
// import Skeleton from "@/Components/Common/Skeleton";

// For pre-built variants:
// import {
//   CardSkeleton,
//   CardGridSkeleton,
//   ListSkeleton,
//   TableRowSkeleton,
//   HeaderSkeleton,
//   StatsCardSkeleton,
//   ProfileSkeleton,
//   DetailsSkeleton,
// } from "@/Components/Common/SkeletonVariants";

// ============================================================
// SINGLE SKELETON PATTERNS
// ============================================================

// Text line: <Skeleton variant="text" width="100%" />
// Title: <Skeleton width="70%" height={24} />
// Description: <Skeleton width="100%" height={12} />
// Image/Card: <Skeleton variant="card" height={200} />
// Avatar: <Skeleton variant="avatar" width={48} height={48} />
// Button: <Skeleton variant="button" width={120} height={40} />

// ============================================================
// COMPONENT WITH LOADING STATE
// ============================================================

// function MyComponent({ data, isLoading = false }) {
//   return (
//     <div>
//       {isLoading ? (
//         <>
//           <Skeleton width="70%" height={20} />
//           <Skeleton width="100%" height={12} style={{ marginTop: "8px" }} />
//           <Skeleton width="40%" height={40} style={{ marginTop: "12px" }} />
//         </>
//       ) : (
//         <>
//           <h3>{data.title}</h3>
//           <p>{data.description}</p>
//           <button>{data.buttonText}</button>
//         </>
//       )}
//     </div>
//   );
// }

// ============================================================
// CARD COMPONENT WITH SKELETON
// ============================================================

// function CardComponent({ data, isLoading = false }) {
//   if (isLoading) {
//     return <CardSkeleton />;
//   }
//
//   return (
//     <div className="card">
//       <img src={data.image} alt="" />
//       <h3>{data.title}</h3>
//       <p>{data.description}</p>
//       <button>{data.action}</button>
//     </div>
//   );
// }

// ============================================================
// GRID WITH MULTIPLE CARD SKELETONS
// ============================================================

function CardGrid({ cards, isLoading = false }) {
  return (
    <div className="grid">
      {isLoading ? (
        <CardGridSkeleton count={4} />
      ) : (
        cards.map((card) => <Card key={card.id} data={card} />)
      )}
    </div>
  );
}

// ============================================================
// LIST WITH SKELETON
// ============================================================

// ============================================================
// GRID WITH MULTIPLE CARD SKELETONS
// ============================================================

// function CardGrid({ cards, isLoading = false }) {
//   return (
//     <div className="grid">
//       {isLoading ? (
//         <CardGridSkeleton count={4} />
//       ) : (
//         cards.map((card) => <Card key={card.id} data={card} />)
//       )}
//     </div>
//   );
// }

// ============================================================
// LIST WITH SKELETON
// ============================================================

// function JobList({ jobs, isLoading = false }) {
//   return (
//     <div className="jobs-list">
//       {isLoading ? (
//         <ListSkeleton count={5} />
//       ) : (
//         jobs.map((job) => <JobItem key={job.id} data={job} />)
//       )}
//     </div>
//   );
// }

// ============================================================
// TABLE WITH SKELETON
// ============================================================

// function ApplicantsTable({ applicants, isLoading = false }) {
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Email</th>
//           <th>Status</th>
//           <th>Score</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {isLoading ? (
//           <TableRowSkeleton columns={5} count={5} />
//         ) : (
//           applicants.map((applicant) => (
//             <tr key={applicant.id}>
//               <td>{applicant.name}</td>
//               <td>{applicant.email}</td>
//               <td>{applicant.status}</td>
//               <td>{applicant.score}</td>
//               <td>
//                 <button>View</button>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   );
// }

// ============================================================
// PAGE/SECTION WITH MULTIPLE LOADING STATES
// ============================================================

// function DashboardPage() {
//   const [stats, setStats] = useState(null);
//   const [jobs, setJobs] = useState(null);
//   const [applicants, setApplicants] = useState(null);
//
//   useEffect(() => {
//     Promise.all([fetchStats(), fetchJobs(), fetchApplicants()])
//       .then(([s, j, a]) => {
//         setStats(s);
//         setJobs(j);
//         setApplicants(a);
//       });
//   }, []);
//
//   return (
//     <div className="dashboard">
//       <section>
//         <h2>Overview</h2>
//         {!stats ? <StatsCardSkeleton count={4} /> : <StatCards data={stats} />}
//       </section>
//
//       <section>
//         <h2>Recent Jobs</h2>
//         {!jobs ? <CardGridSkeleton count={6} /> : <JobGrid data={jobs} />}
//       </section>
//
//       <section>
//         <h2>Applicants</h2>
//         {!applicants ? (
//           <TableRowSkeleton columns={5} count={5} />
//         ) : (
//           <ApplicantsList data={applicants} />
//         )}
//       </section>
//     </div>
//   );
// }

// ============================================================
// CONDITIONAL SKELETON COUNT
// ============================================================

// function SmartGrid({ items, isLoading = false, expectedCount = 4 }) {
//   const displayCount = isLoading ? expectedCount : items.length;
//
//   return (
//     <div className="grid">
//       {Array.from({ length: displayCount }).map((_, i) => (
//         <div key={i}>
//           {isLoading ? (
//             <CardSkeleton />
//           ) : (
//             <Card data={items[i]} />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// ============================================================
// ERROR STATE (Don't use skeleton)
// ============================================================

// function ComponentWithErrorHandling({ data, isLoading = false, error = null }) {
//   if (error) {
//     return <div className="error-state">Failed to load data</div>;
//   }
//
//   if (isLoading) {
//     return <CardSkeleton />;
//   }
//
//   return <RealContent data={data} />;
// }

// ============================================================
// CUSTOM SKELETON LAYOUT
// ============================================================

// function CustomCardSkeleton() {
//   return (
//     <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "8px" }}>
//       {/* Header with avatar */}
//       <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
//         <Skeleton variant="avatar" width={40} height={40} />
//         <div style={{ flex: 1 }}>
//           <Skeleton width="60%" height={14} />
//           <Skeleton width="40%" height={10} style={{ marginTop: "4px" }} />
//         </div>
//       </div>
//
//       {/* Title */}
//       <Skeleton width="80%" height={18} style={{ marginBottom: "8px" }} />
//
//       {/* Description */}
// //       {/* Description */}
//       <Skeleton width="100%" height={12} style={{ marginBottom: "4px" }} />
//       <Skeleton width="95%" height={12} style={{ marginBottom: "12px" }} />
//
//       {/* Footer buttons */}
//       <div style={{ display: "flex", gap: "8px" }}>
//         <Skeleton width="60px" height={32} />
//         <Skeleton width="60px" height={32} />
//       </div>
//     </div>
//   );
// }

// ============================================================
// CSS-ONLY SKELETON (if you prefer)
// ============================================================

// <div className="skeleton-card">
//   <div className="skeleton skeleton--card"></div>
//   <div className="skeleton-card-body">
//     <div className="skeleton skeleton--text"></div>
//     <div className="skeleton skeleton--text"></div>
//     <div className="skeleton skeleton--text"></div>
//   </div>
// </div>

// ============================================================
// SKELETON WITH ANIMATION DISABLED
// ============================================================

// For components that don't need animation:
// <Skeleton variant="text" animated={false} />

// ============================================================
// SIZING QUICK REFERENCE
// ============================================================

// Height (px):
// const heights = {
//   extraSmallText: 10,
//   smallText: 12,
//   normalText: 14,
//   subtitle: 14,
//   title: 18,
//   largeTitle: 24,
//   button: 40,
//   avatar: 48,
//   cardImage: 200,
//   fullCard: 360,
// };
//
// Width (examples):
// const widths = {
//   full: "100%",
//   wide: "95%",
//   normalWide: "85%",
//   normal: "80%",
//   medium: "70%",
//   narrow: "60%",
//   short: "40%",
// };

// ============================================================
// TESTING SKELETONS
// ============================================================

// function TestComponent() {
//   const [isLoading, setIsLoading] = useState(true);
//
//   return (
//     <div>
//       <button onClick={() => setIsLoading(!isLoading)}>
//         Toggle Loading
//       </button>
//       <CardComponent isLoading={isLoading} />
//     </div>
//   );
// }

// ============================================================
// ACCESSIBILITY CHECK
// ============================================================

// Automatically handled:
// - Respects prefers-reduced-motion
// - Doesn't interfere with screen readers
// - Uses semantic colors
// - No focus capture
// 
// No additional code needed!

// ============================================================
// PERFORMANCE NOTES
// ============================================================

//  Fast:
// - CSS-only animations
// - No animation libraries
// - No JS overhead
// - Minimal bundle size
// - Auto-responsive
// 
// No performance worries!

export default {
  // Quick reference - not meant to be imported
};

