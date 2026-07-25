"use client";

import { Icon } from "./Icon";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, resolvedTheme, cycleTheme } = useTheme();
  const label = theme === "system" ? `Using system ${resolvedTheme} mode` : `Using ${theme} mode`;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="icon-btn"
      aria-label={`${label}. Switch visual mode`}
      title={`${label}. Click for next mode.`}
    >
      <Icon name={resolvedTheme === "dark" ? "sun" : "moon"} size={18} />
    </button>
  );
}
