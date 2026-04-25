import React from "react";

const Button = ({
  children,
  className = "",
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`hf-premium ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
