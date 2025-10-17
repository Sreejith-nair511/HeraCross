"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type AccentColor = "green" | "cyan" | "violet"
export type FontSize = "small" | "normal" | "large"

interface ThemeContextType {
  isDark: boolean
  setIsDark: (dark: boolean) => void
  accentColor: AccentColor
  setAccentColor: (color: AccentColor) => void
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  highContrast: boolean
  setHighContrast: (contrast: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDarkState] = useState(true)
  const [accentColor, setAccentColorState] = useState<AccentColor>("green")
  const [fontSize, setFontSizeState] = useState<FontSize>("normal")
  const [highContrast, setHighContrastState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedDark = localStorage.getItem("theme-dark")
    const savedAccent = localStorage.getItem("theme-accent") as AccentColor | null
    const savedFontSize = localStorage.getItem("theme-fontSize") as FontSize | null
    const savedContrast = localStorage.getItem("theme-contrast")

    if (savedDark !== null) setIsDarkState(savedDark === "true")
    if (savedAccent) setAccentColorState(savedAccent)
    if (savedFontSize) setFontSizeState(savedFontSize)
    if (savedContrast !== null) setHighContrastState(savedContrast === "true")
  }, [])

  useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    if (isDark) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
    localStorage.setItem("theme-dark", isDark.toString())
  }, [isDark, mounted])

  useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    html.setAttribute("data-accent", accentColor)
    localStorage.setItem("theme-accent", accentColor)
  }, [accentColor, mounted])

  useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    html.setAttribute("data-font-size", fontSize)
    localStorage.setItem("theme-fontSize", fontSize)
  }, [fontSize, mounted])

  useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    if (highContrast) {
      html.classList.add("high-contrast")
    } else {
      html.classList.remove("high-contrast")
    }
    localStorage.setItem("theme-contrast", highContrast.toString())
  }, [highContrast, mounted])

  // Return null during SSR to avoid hydration mismatch
  if (!mounted) return null

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        setIsDark: setIsDarkState,
        accentColor,
        setAccentColor: setAccentColorState,
        fontSize,
        setFontSize: setFontSizeState,
        highContrast,
        setHighContrast: setHighContrastState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  // Return a default context instead of throwing an error during SSR
  if (!context) {
    return {
      isDark: false,
      setIsDark: () => {},
      accentColor: "green" as AccentColor,
      setAccentColor: () => {},
      fontSize: "normal" as FontSize,
      setFontSize: () => {},
      highContrast: false,
      setHighContrast: () => {},
    }
  }
  return context
}