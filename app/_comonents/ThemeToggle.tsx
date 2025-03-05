// components/ThemeToggle.tsx
"use client";

import { useState, useEffect } from "react";

import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme as "light" | "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <>
    <Switch 
    // className="bg-secondary h-6 w-6"
     onClick={toggleTheme}

    />

    </>
  );
}