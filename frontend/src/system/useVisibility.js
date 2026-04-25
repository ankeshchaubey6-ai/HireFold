import { useEffect, useRef, useState } from "react";

export const useVisibility = (options = { rootMargin: "120px" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      options
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};
