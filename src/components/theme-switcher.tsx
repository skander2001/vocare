"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 bg-gray-100 rounded-xl animate-pulse"
      >
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-soft">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className={`w-8 h-8 p-0 rounded-lg transition-all duration-200 hover-scale ${
          theme === "light"
            ? "bg-white text-amber-600 shadow-soft"
            : "text-gray-600 hover:text-amber-600 hover:bg-white/50"
        }`}
      >
        <Sun className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={`w-8 h-8 p-0 rounded-lg transition-all duration-200 hover-scale ${
          theme === "dark"
            ? "bg-gray-800 text-blue-400 shadow-soft"
            : "text-gray-600 hover:text-blue-400 hover:bg-gray-800/10"
        }`}
      >
        <Moon className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("system")}
        className={`w-8 h-8 p-0 rounded-lg transition-all duration-200 hover-scale ${
          theme === "system"
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-soft"
            : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
        }`}
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  )
}
