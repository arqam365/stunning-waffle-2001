'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (theme === 'dark' || (!theme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
      <button
          onClick={toggleTheme}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-accent text-background rounded-full shadow-lg hover:scale-110 transition-all duration-300 glow-accent"
          aria-label="Toggle theme"
      >
        {isDark ? (
            <Sun className="w-5 h-5 md:w-6 md:h-6" />
        ) : (
            <Moon className="w-5 h-5 md:w-6 md:h-6" />
        )}
      </button>
  )
}