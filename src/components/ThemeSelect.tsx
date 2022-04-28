import { useState, useEffect } from "preact/hooks";

export default function ThemeSelect() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
  const [hasMounted, setHasMounted] = useState(false);

  const handleClick = (e) => {
      localStorage.setItem("theme", theme === "light" ? "dark" : "light");
      setTheme(theme === "light" ? "dark" : "light");
    }

    useEffect(() => {
      setHasMounted(true);
    },[]);
  
    useEffect(() => {
      if (theme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [theme]);

    if (!hasMounted) {
      return <div class="shrink-0 h-16 w-16 dark:bg-zinc-700 rounded-2xl bg-zinc-200"></div>;
    }

  return (
    <button onClick={handleClick} class="relative shrink-0 group h-16 w-16 dark:bg-zinc-700 rounded-2xl flex justify-center items-center text-zinc-400 hover:text-zinc-500 focus:text-zinc-500 dark:focus:text-zinc-300 dark:hover:text-zinc-300 transition-all hover:ring-2 hover:ring-blue-500 dark:hover:ring-indigo-500 dark:focus:ring-indigo-500 hover:ring-offset-2 bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ring-offset-zinc-200 dark:ring-offset-slate-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-auto w-8 group-hover:w-12 group-focus:w-12 transition-all fill-current" viewBox="0 0 20 20">
        {theme === "light" ? <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /> : <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />}
      </svg>
      <span class="absolute py-1 delay-100 dark:border-zinc-600 duration-300 dark:shadow-black/60 bg-white dark:bg-zinc-700 shadow font-medium -top-[3.25rem] text-sm pointer-events-none w-auto min-w-max px-2 dark:border-t rounded-md opacity-0 sm:group-focus:opacity-100 transition-opacity sm:group-hover:opacity-100 dark:text-zinc-300 text-zinc-600">
        {theme === "light" ?  "Dark mode" : "Light mode"}
      </span>
    </button>
  );
};
