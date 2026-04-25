import React from "react";
import Button from "@/Components/Common/Button";

const ErrorSurface = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <p>{message}</p>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
};

export default ErrorSurface;
