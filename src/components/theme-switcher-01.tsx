"use client";

import React, { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const [checked, setChecked] = React.useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setChecked(theme === "dark");
  }, [theme]);

  return (
    <div className="flex items-center space-x-3">
      <Sun className="size-4" />
      <Switch
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value);
          setTheme(value ? "dark" : "light");
        }}
        aria-label="Toggle theme"
      />
      <Moon className="size-4" />
    </div>
  );
}
