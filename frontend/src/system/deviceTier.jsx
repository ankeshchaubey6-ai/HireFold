import { createContext, useContext, useEffect, useState } from "react";

const DeviceTierContext = createContext("LG");

const getTier = (width) => {
  if (width < 480) return "XS";
  if (width < 640) return "SM";
  if (width < 768) return "MD";
  if (width < 1024) return "LG";
  return "XL";
};

export const DeviceTierProvider = ({ children }) => {
  const [tier, setTier] = useState(() => getTier(window.innerWidth));

  useEffect(() => {
    const onResize = () => {
      setTier(getTier(window.innerWidth));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <DeviceTierContext.Provider value={tier}>
      {children}
    </DeviceTierContext.Provider>
  );
};

export const useDeviceTier = () => {
  return useContext(DeviceTierContext);
};
