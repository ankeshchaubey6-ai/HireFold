import React, { useLayoutEffect, useRef, useState } from "react";

const AutoScalePreview = ({ children, containerHeight = 420 }) => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;
    if (contentHeight > 0) {
      const nextScale = containerHeight / contentHeight;
      setScale(Math.min(nextScale, 1));
    }
  }, [children, containerHeight]);

  return (
    <div
      ref={wrapperRef}
      style={{
        height: containerHeight,
        overflow: "hidden",
      }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "794px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AutoScalePreview;
