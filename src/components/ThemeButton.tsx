import { useState, useEffect} from 'preact/hooks';
export default function ThemeButton() {
  const [isDark, setIsDark] = useState(false);

  const handleToggle = () => {
    setIsDark(prevState => !prevState)
    document.documentElement.classList.toggle('dark');
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', 'dark' === document.documentElement.classList.value ? 'dark' : 'light');
    }
  }

  

  return (
    <button onClick={handleToggle} className="relative group h-16 w-16 dark:bg-zinc-700 rounded-2xl flex justify-center items-center text-zinc-400 hover:text-zinc-500 focus:text-zinc-500 dark:focus:text-zinc-300 dark:hover:text-gray-300 transition-all hover:ring-2 hover:ring-blue-500 dark:hover:ring-indigo-500 dark:focus:ring-indigo-500 hover:ring-offset-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-slate-800" aria-label={isDark ? "Dark mode" : "Light mode"}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-auto w-8 group-hover:w-12 group-focus:w-12 transition-all fill-current" viewBox="0 0 20 20">
        {isDark ? <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /> : <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />}
      </svg>
    </button>
  )
}