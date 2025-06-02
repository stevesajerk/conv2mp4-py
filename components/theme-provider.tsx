"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextProps {
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
  setTheme: () => {},
})

export const ThemeProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode
  [key: string]: any
}) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      setTheme("system")
    }
  }, [])

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(systemTheme)
    } else if (theme === "dark") {
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }

    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
