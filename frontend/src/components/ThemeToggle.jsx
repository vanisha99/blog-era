import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} title={dark ? "Light Mode" : "Dark Mode"}
      style={{
        width: "38px", height: "38px", borderRadius: "10px",
        background: "var(--surface2)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", transition: "all 0.2s", flexShrink: 0,
      }}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}