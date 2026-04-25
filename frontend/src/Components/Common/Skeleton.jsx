import React from "react";
import "../../../src/Styles/skeleton.css";


const Skeleton = ({
  variant = "text",
  width = "100%",
  height,
  count = 1,
  animated = true,
  className = "",
  ...props
}) => {
  const baseClass = "skeleton";
  const variantClass = `skeleton--${variant}`;
  const animationClass = animated ? "skeleton--animated" : "";

  // Convert height to number if it's a string
  const heightValue = typeof height === "number" ? `${height}px` : height;

  const skeletonStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    ...(heightValue && { height: heightValue }),
  };

  // For list rendering (count > 1)
  if (count > 1) {
    return (
      <div className={`skeleton-list ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} ${variantClass} ${animationClass}`}
            style={skeletonStyle}
            {...props}
          />
        ))}
      </div>
    );
  }

  // Single skeleton
  return (
    <div
      className={`${baseClass} ${variantClass} ${animationClass} ${className}`}
      style={skeletonStyle}
      {...props}
    />
  );
};

export default Skeleton;

