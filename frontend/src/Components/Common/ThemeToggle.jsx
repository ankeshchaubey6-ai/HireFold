import React from "react";
import { useTheme } from "../../Context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "dark" ? "" : ""}
    </button>
  );
};

export default ThemeToggle;

