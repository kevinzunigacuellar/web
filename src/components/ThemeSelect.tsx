import { useState, useEffect } from "preact/hooks";

const themes = ["light", "dark", "system"];

export default function ThemeSelect() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system")
  const [hasMounted, setHasMounted] = useState(false);

  const handleChange = (e) => {
      if (e.target.value === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", e.target.value);
      }
      setTheme(e.target.value);
    }

    useEffect(() => {
      setHasMounted(true);
    },[]);
  
    useEffect(() => {
      if (theme === 'dark' || (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [theme]);

    if (!hasMounted) {
      return null;
    }

  return (
    <select onChange={handleChange} value={theme}>
      {themes.map((t) => {
        return (
            <option key={t} value={t}>{t}</option>
        );
      })}
    </select>
  );
};
