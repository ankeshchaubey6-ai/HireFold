import React from "react";
import { useDeviceTier } from "./deviceTier";
import { useVisibility } from "./useVisibility";

const BLOCKED_ON_MOBILE = ["XS", "SM"];

const HATGuard = ({
  tier = "trivial",
  children,
  fallback = null,
}) => {
  const deviceTier = useDeviceTier();
  const [ref, visible] = useVisibility();

  if (tier === "heavy") {
    if (BLOCKED_ON_MOBILE.includes(deviceTier)) {
      return fallback;
    }

    return <div ref={ref}>{visible ? children : fallback}</div>;
  }

  return <>{children}</>;
};

export default HATGuard;
