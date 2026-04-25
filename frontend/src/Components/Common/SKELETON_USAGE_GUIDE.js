/**
 * SKELETON LOADING  USAGE GUIDE
 * 
 * This guide shows how to integrate skeleton loading into components.
 * All skeleton components are flexible and responsive.
 */

// ============================================================
// BASIC USAGE
// ============================================================

// import Skeleton, { CardSkeleton, ListSkeleton } from "@/Components/Common/SkeletonVariants";

// Example: Component with loading state
// function MyComponent() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState(null);
//
//   useEffect(() => {
//     fetchData().then((data) => {
//       setData(data);
//       setIsLoading(false);
//     });
//   }, []);
//
//   return (
//     <div>
//       {isLoading ? (
//         <CardSkeleton />
//       ) : (
//         <CardContent data={data} />
//       )}
//     </div>
//   );
// }

// ============================================================
// SINGLE SKELETON VARIANTS
// ============================================================

// Text/Line skeleton
// JSX: <Skeleton variant="text" width="100%" />

// Card skeleton (full height 360px)
// JSX: <Skeleton variant="card" />

// Avatar skeleton (circular)
// JSX: <Skeleton variant="avatar" width={48} height={48} />

// Button skeleton
// JSX: <Skeleton variant="button" width={120} height={40} />

// Custom height and width
// JSX: <Skeleton width="75%" height={24} />

// Inline skeleton
// JSX: <Skeleton width="100px" height={16} />

// ============================================================
// MULTIPLE SKELETONS (Lists)
// ============================================================

// Render 5 text skeletons
// JSX: <Skeleton variant="text" count={5} />

// Render 10 line skeletons
// JSX: <Skeleton variant="line" count={10} />

// ============================================================
// COMMON PATTERN: CARDS
// ============================================================

// Single card skeleton
// JSX: <CardSkeleton />

// Grid of 4 card skeletons
// JSX: <CardGridSkeleton count={4} />

// ============================================================
// COMMON PATTERN: TABLES
// ============================================================

// Table with 5 rows and 6 columns
// JSX: <TableRowSkeleton columns={6} count={5} />

// ============================================================
// COMMON PATTERN: LISTS
// ============================================================

// List of 5 items
// JSX: <ListSkeleton count={5} />

// ============================================================
// COMMON PATTERN: HEADERS
// ============================================================

// Section header skeleton
// JSX: <HeaderSkeleton />

// ============================================================
// COMMON PATTERN: STATS
// ============================================================

// Stats card grid (4 cards)
// JSX: <StatsCardSkeleton count={4} />

// ============================================================
// COMMON PATTERN: PROFILE
// ============================================================

// Profile card with avatar + details
// JSX: <ProfileSkeleton />

// ============================================================
// COMMON PATTERN: DETAILS
// ============================================================

// Multi-line description
// JSX: <DetailsSkeleton />

// ============================================================
// REAL-WORLD EXAMPLE: Job Card with Skeleton
// ============================================================

// function JobCard({ job, isLoading }) {
//   return (
//     <div className="job-card">
//       {isLoading ? (
//         <>
//           <Skeleton width="70%" height={20} style={{ marginBottom: "8px" }} />
//           <Skeleton width="100%" height={12} style={{ marginBottom: "8px" }} />
//           <Skeleton width="85%" height={12} style={{ marginBottom: "12px" }} />
//           <Skeleton width="40%" height={40} variant="button" />
//         </>
//       ) : (
//         <>
//           <h3>{job.title}</h3>
//           <p>{job.company}</p>
//           <p>{job.location}</p>
//           <button>Apply Now</button>
//         </>
//       )}
//     </div>
//   );
// }

// ============================================================
// REAL-WORLD EXAMPLE: Dashboard with Multiple Sections
// ============================================================

// function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [jobs, setJobs] = useState(null);
//   const [candidates, setCandidates] = useState(null);
//
//   const statsLoading = !stats;
//   const jobsLoading = !jobs;
//   const candidatesLoading = !candidates;
//
//   return (
//     <div>
//       <section>
//         <h2>Stats Overview</h2>
//         {statsLoading ? (
//           <StatsCardSkeleton count={4} />
//         ) : (
//           <StatsGrid stats={stats} />
//         )}
//       </section>
//
//       <section>
//         <h2>Recent Jobs</h2>
//         {jobsLoading ? (
//           <CardGridSkeleton count={6} />
//         ) : (
//           <JobList jobs={jobs} />
//         )}
//       </section>
//
//       <section>
//         <h2>Top Candidates</h2>
//         {candidatesLoading ? (
//           <ListSkeleton count={5} />
//         ) : (
//           <CandidateList candidates={candidates} />
//         )}
//       </section>
//     </div>
//   );
// }

// ============================================================
// ANIMATION CONTROL
// ============================================================

// Disable animation (already animated by default)
// JSX: <Skeleton animated={false} />

// Custom class for additional styling
// JSX: <Skeleton className="my-custom-class" />

// ============================================================
// RESPONSIVE BEHAVIOR
// ============================================================

// Skeletons automatically adapt to:
// - Mobile (single column)
// - Tablet (2-3 columns)
// - Desktop (4+ columns)
// No additional code needed!

// ============================================================
// ACCESSIBILITY
// ============================================================

// Skeletons:
// - Respect prefers-reduced-motion
// - Don't interfere with screen readers (temporary)
// - Don't capture keyboard focus
// - Use semantic color from design system

// ============================================================
// CSS UTILITIES
// ============================================================

// Available CSS classes for custom skeletons:
// .skeleton  base skeleton element
// .skeleton--text  text line
// .skeleton--card  card-sized
// .skeleton--avatar  circular
// .skeleton--button  button-sized
// .skeleton--line  flexible line
// .skeleton--circle  round indicator
// .skeleton--table-row  horizontal row
// .skeleton--animated  adds animation
// .skeleton-list  vertical list layout
// .skeleton-grid  grid layout
// .skeleton-table  table layout

// Custom skeleton with CSS:
// function CustomSkeleton() {
//   return (
//     <div className="skeleton-list">
//       <div className="skeleton skeleton--text" />
//       <div className="skeleton skeleton--text" />
//       <div className="skeleton skeleton--button" />
//     </div>
//   );
// }

// ============================================================
// PERFORMANCE NOTES
// ============================================================

// - Lightweight - no animation libraries
// - CSS-only animations - no JS overhead
// - Respects prefers-reduced-motion
// - No layout shift during transitions
// - Auto-responsive - works on all breakpoints
// - Matches exact component shapes

// ============================================================
// COMMON MISTAKES TO AVOID
// ============================================================

// DON'T: Use skeleton for everything
// DO: Use only for async-loaded content

// DON'T: Leave skeleton animated for too long
// DO: Show real content as soon as available

// DON'T: Create mismatched skeleton shapes
// DO: Mirror exact layout of real component

// DON'T: Add inline styles for animations
// DO: Use CSS classes (already responsive)

// ============================================================
// TESTING SKELETON LOADING
// ============================================================

// To test skeletons during development, add a delay:
// function MyComponent() {
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 2000); // Simulate 2s loading
//   }, []);
//
//   return isLoading ? <CardSkeleton /> : <RealContent />;
// }

