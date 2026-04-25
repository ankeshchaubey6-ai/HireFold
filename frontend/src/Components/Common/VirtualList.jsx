import React, { useRef, useState, useEffect, useCallback } from "react";

// Simple fixed-height windowing list. Lightweight alternative to adding a new dependency.
// Props:
// - items: array
// - renderItem: (item, index) => ReactNode
// - itemHeight: number (px) estimated/fixed height of each item
// - overscan: number (items before/after viewport)
// - className: optional
export default function VirtualList({
  items = [],
  renderItem,
  itemHeight = 64,
  overscan = 5,
  className,
  style,
}) {
  const rootRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(600);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight || 600));
    ro.observe(el);

    // initial
    setViewportHeight(el.clientHeight || 600);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const offsetY = startIndex * itemHeight;

  const visibleItems = items.slice(startIndex, endIndex);

  const innerStyle = {
    height: totalHeight,
    position: "relative",
  };

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ overflow: "auto", WebkitOverflowScrolling: "touch", ...style }}
    >
      <div style={innerStyle}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => renderItem(item, startIndex + i))}
        </div>
      </div>
    </div>
  );
}
