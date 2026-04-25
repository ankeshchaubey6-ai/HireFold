/**
 * SKELETON CSS REFERENCE
 * 
 * Complete list of skeleton CSS classes and their use cases.
 * All animations respect prefers-reduced-motion.
 */

// ============================================================
// BASE ELEMENTS
// ============================================================

/**
 * .skeleton
 * Base skeleton element
 * - Default height: 16px
 * - Width: 100%
 * - Animated by default
 * - Respects prefers-reduced-motion
 * 
 * Usage:
 * <div class="skeleton"></div>
 * or via React:
 * <Skeleton />
 */

/**
 * .skeleton--animated
 * Adds soft pulse animation (1.4s cycle)
 * - Opacity: 85%  55%  85%
 * - Respects prefers-reduced-motion
 * 
 * Applied automatically on all skeletons
 */

// ============================================================
// SKELETON VARIANTS
// ============================================================

/**
 * .skeleton--text
 * Single line of text
 * - Height: 16px
 * - Border radius: 4px
 * - Used for: titles, labels, descriptions
 * 
 * Usage:
 * <Skeleton variant="text" />
 * or
 * <div class="skeleton skeleton--text"></div>
 */

/**
 * .skeleton--card
 * Full-height card container
 * - Height: 360px
 * - Border radius: 18px
 * - Used for: card images, card containers
 * 
 * Usage:
 * <Skeleton variant="card" />
 * or
 * <div class="skeleton skeleton--card"></div>
 */

/**
 * .skeleton--avatar
 * Circular profile image
 * - Size: 48x48px (customizable)
 * - Border radius: 50%
 * - Used for: user profiles, avatars
 * 
 * Usage:
 * <Skeleton variant="avatar" width={64} height={64} />
 * or
 * <div class="skeleton skeleton--avatar" style="width: 64px; height: 64px;"></div>
 */

/**
 * .skeleton--button
 * Clickable button-sized skeleton
 * - Height: 40px
 * - Width: auto (min-width: 100px)
 * - Border radius: 8px
 * - Used for: action buttons, CTAs
 * 
 * Usage:
 * <Skeleton variant="button" width={120} height={40} />
 * or
 * <div class="skeleton skeleton--button"></div>
 */

/**
 * .skeleton--line
 * Flexible line for lists
 * - Height: 12px
 * - Border radius: 4px
 * - Used for: list items, descriptions
 * 
 * Usage:
 * <Skeleton variant="line" />
 * or
 * <div class="skeleton skeleton--line"></div>
 */

/**
 * .skeleton--circle
 * Round indicator skeleton
 * - Size: 24x24px
 * - Border radius: 50%
 * - Used for: status icons, indicators
 * 
 * Usage:
 * <Skeleton variant="circle" />
 * or
 * <div class="skeleton skeleton--circle"></div>
 */

/**
 * .skeleton--table-row
 * Horizontal row layout with multiple columns
 * - Display: flex with gap
 * - First column: 40px (for checkboxes)
 * - Remaining: equal flex
 * - Used for: data table rows
 * 
 * Usage:
 * <Skeleton variant="table-row" />
 * or
 * <div class="skeleton skeleton--table-row">
 *   <div></div>
 *   <div></div>
 *   <div></div>
 * </div>
 */

// ============================================================
// COMPLEX LAYOUTS
// ============================================================

/**
 * .skeleton-card-header
 * Header section for card skeletons
 * - Flex layout: avatar + text
 * - Includes spacing and alignment
 * 
 * Usage:
 * <div class="skeleton-card-header">
 *   <div class="skeleton skeleton--avatar"></div>
 *   <div class="skeleton-card-header-text">
 *     <div class="skeleton"></div>
 *     <div class="skeleton"></div>
 *   </div>
 * </div>
 */

/**
 * .skeleton-card-header-text
 * Text content area for card headers
 * - Flex column layout
 * - Proper spacing
 * - Child skeletons: 14px height
 * 
 * Usage:
 * <div class="skeleton-card-header-text">
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 * </div>
 */

/**
 * .skeleton-card-body
 * Body section for card skeletons
 * - Padding: 0 16px 16px
 * - Proper spacing between lines
 * 
 * Usage:
 * <div class="skeleton-card-body">
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 * </div>
 */

/**
 * .skeleton-list
 * Vertical list of skeleton items
 * - Flex column layout
 * - Gap: 16px
 * - Auto-responsive
 * 
 * Usage:
 * <div class="skeleton-list">
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 * </div>
 */

/**
 * .skeleton-grid
 * Card grid layout
 * - CSS Grid
 * - 4 columns on desktop
 * - Auto-responsive for tablet/mobile
 * - Gap: 24px (16px on mobile)
 * 
 * Usage:
 * <div class="skeleton-grid">
 *   <div class="skeleton skeleton--card"></div>
 *   <div class="skeleton skeleton--card"></div>
 *   <div class="skeleton skeleton--card"></div>
 *   <div class="skeleton skeleton--card"></div>
 * </div>
 */

/**
 * .skeleton-header
 * Section header with title and subtitle
 * - Title: 28px height
 * - Subtitle: 14px height, 60% width
 * - Margin bottom: 24px
 * 
 * Usage:
 * <div class="skeleton-header">
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 * </div>
 */

/**
 * .skeleton-table
 * Data table skeleton
 * - Full width
 * - Multiple rows with grid columns
 * - Border bottom on rows
 * 
 * Usage:
 * <div class="skeleton-table">
 *   <div class="skeleton-table-row">
 *     <div class="skeleton"></div>
 *     <div class="skeleton"></div>
 *     <div class="skeleton"></div>
 *   </div>
 * </div>
 */

/**
 * .skeleton-table-row
 * Single table row
 * - Display: grid with auto-fit columns
 * - Min width: 80px per column
 * - Gap: 12px
 * - Border bottom: 1px solid var(--border)
 * 
 * Usage:
 * <div class="skeleton-table-row">
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 *   <div class="skeleton"></div>
 * </div>
 */

// ============================================================
// UTILITY CLASSES
// ============================================================

/**
 * .skeleton-block
 * Full-width skeleton block
 * - Height: 16px
 * - Margin bottom: 12px
 * - Used for: quick paragraphs
 * 
 * Usage:
 * <div class="skeleton-block"></div>
 */

/**
 * .skeleton-inline
 * Inline skeleton element
 * - Display: inline-block
 * - Height: 16px
 * - Margin: 0 4px
 * - Used for: inline text replacements
 * 
 * Usage:
 * <span class="skeleton-inline"></span>
 */

/**
 * .skeleton-wrapper
 * Container for skeleton content
 * - Width: 100%
 * - Min height: 100px
 * - Prevents layout shift
 * 
 * Usage:
 * <div class="skeleton-wrapper">
 *   <div class="skeleton"></div>
 * </div>
 */

/**
 * .skeleton-container
 * Safe skeleton container
 * - Width: 100%
 * - Overflow: hidden
 * - Prevents overflow issues
 * 
 * Usage:
 * <div class="skeleton-container">
 *   <div class="skeleton"></div>
 * </div>
 */

/**
 * .skeleton--fade-out
 * Smooth fade-out animation
 * - Animates opacity to 0
 * - Duration: 0.3s
 * - Use when transitioning from skeleton to real content
 * 
 * Usage:
 * <div class="skeleton skeleton--fade-out"></div>
 */

// ============================================================
// DARK MODE
// ============================================================

/**
 * Skeletons automatically adapt to dark mode
 * - Light mode: background-color: var(--border, #e5e7eb)
 * - Dark mode: background-color: var(--border, #374151)
 * 
 * No additional CSS needed!
 */

// ============================================================
// RESPONSIVE BEHAVIOR
// ============================================================

/**
 * Skeletons automatically adapt:
 * - Desktop (1024px+): 4-column grid
 * - Tablet (641px-1024px): 2-3 columns
 * - Mobile (640px): single column
 * 
 * No media queries needed in component code!
 */

// ============================================================
// ANIMATION CONTROL
// ============================================================

/**
 * Pulse Animation (default)
 * - Duration: 1.4s
 * - Easing: cubic-bezier(0.4, 0, 0.6, 1)
 * - Pattern: 85%  55%  85%
 * - Respects prefers-reduced-motion
 */

/**
 * Reduced Motion
 * When user has prefers-reduced-motion: reduce
 * - Animation: disabled
 * - Opacity: fixed at 0.7
 * - No visual flashing
 */

// ============================================================
// PERFORMANCE
// ============================================================

/**
 *  Optimizations:
 * - CSS-only animations (no JS overhead)
 * - Uses opacity/transform only (GPU accelerated)
 * - No layout thrashing
 * - Respects prefers-reduced-motion
 * - Lightweight skeleton.css file (~4KB)
 * 
 * No animation libraries required!
 */

// ============================================================
// ACCESSIBILITY
// ============================================================

/**
 *  Accessible:
 * - Respects prefers-reduced-motion
 * - No focus capture
 * - No aria-busy needed (temporary)
 * - Uses semantic colors from design system
 * - Screen readers ignore (temp content)
 */

// ============================================================
// SIZING REFERENCE
// ============================================================

/**
 * Common Heights:
 * - Extra small text: 10px
 * - Small text: 12px
 * - Default text: 16px
 * - Subtitle: 14px
 * - Title: 18px-28px
 * - Button: 32px-40px
 * - Avatar: 48px-64px
 * - Card image: 200px
 * - Full card: 360px
 */

/**
 * Common Widths:
 * - Full width: 100%
 * - Wide text: 85%-95%
 * - Normal text: 70%-80%
 * - Short text: 40%-60%
 * - Avatar: 48px-64px
 */

// ============================================================
// SPACING REFERENCE
// ============================================================

/**
 * Common Gaps/Margins:
 * - Tight: 4px-6px
 * - Normal: 8px-12px
 * - Medium: 16px
 * - Large: 24px
 * - Extra large: 32px+
 */

// ============================================================
// COLOR REFERENCE
// ============================================================

/**
 * Skeleton Colors:
 * - Light mode: var(--border) or #e5e7eb
 * - Dark mode: var(--border) or #374151
 * - Opacity during animation: 55%-85%
 * 
 * Automatically matches design system!
 */

// ============================================================
// ROUNDING REFERENCE
// ============================================================

/**
 * Border Radius:
 * - Text/lines: 4px
 * - Buttons: 8px
 * - Cards: 18px
 * - Avatars: 50%
 */

export default {
  // This file is a reference - not meant to be imported
  // Use the CSS classes directly in your HTML/JSX
};

