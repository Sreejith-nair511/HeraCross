"use client"

import { useTheme, type AccentColor, type FontSize } from "@/contexts/theme-context"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/components/toast-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Palette } from "lucide-react"
import { motion } from "framer-motion"

export default function ThemeCustomizer() {
  const { isDark, setIsDark, accentColor, setAccentColor, fontSize, setFontSize, highContrast, setHighContrast } =
    useTheme()
  const { t } = useLanguage()
  const { addToast } = useToast()

  const accentColors: { value: AccentColor; label: string; color: string }[] = [
    { value: "green", label: "Electric Green", color: "bg-neon-green" },
    { value: "cyan", label: "Cyan", color: "bg-neon-cyan" },
    { value: "violet", label: "Violet", color: "bg-neon-violet" },
  ]

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: "small", label: "Small" },
    { value: "normal", label: "Normal" },
    { value: "large", label: "Large" },
  ]

  const handleThemeChange = (isDarkMode: boolean) => {
    setIsDark(isDarkMode)
    addToast(`Switched to ${isDarkMode ? "dark" : "light"} mode`, "success")
  }

  const handleAccentChange = (color: AccentColor) => {
    setAccentColor(color)
    addToast(`Accent color changed to ${color}`, "success")
  }

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size)
    addToast(`Font size changed to ${size}`, "success")
  }

  const handleContrastChange = () => {
    setHighContrast(!highContrast)
    addToast(`High contrast ${!highContrast ? "enabled" : "disabled"}`, "success")
  }

  return (
    <div className="space-y-6">
      {/* Dark/Light Mode */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t("theme")}
          </CardTitle>
          <CardDescription>Choose your preferred appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleThemeChange(true)}
                className={`w-full gap-2 ${isDark ? "bg-neon-green text-background" : "bg-card/50 border border-border/50"}`}
              >
                <Moon className="w-4 h-4" />
                {t("darkMode")}
              </Button>
            </motion.div>
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleThemeChange(false)}
                className={`w-full gap-2 ${!isDark ? "bg-neon-green text-background" : "bg-card/50 border border-border/50"}`}
              >
                <Sun className="w-4 h-4" />
                {t("lightMode")}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Accent Color */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle>{t("accentColor")}</CardTitle>
          <CardDescription>Select your preferred accent color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {accentColors.map((color) => (
              <motion.button
                key={color.value}
                onClick={() => handleAccentChange(color.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  accentColor === color.value ? "border-foreground" : "border-border/50"
                } bg-card/50 hover:bg-card/70`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-8 h-8 rounded-full ${color.color} mx-auto mb-2`}></div>
                <p className="text-xs font-medium text-foreground">{color.label}</p>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle>{t("fontSize")}</CardTitle>
          <CardDescription>Adjust text size for better readability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {fontSizes.map((size) => (
              <motion.div key={size.value} className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => handleFontSizeChange(size.value)}
                  className={`w-full ${fontSize === size.value ? "bg-neon-green text-background" : "bg-card/50 border border-border/50"}`}
                >
                  {size.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Contrast */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle>{t("contrast")}</CardTitle>
          <CardDescription>Enable high contrast mode for better visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleContrastChange}
              className={`w-full ${highContrast ? "bg-neon-green text-background" : "bg-card/50 border border-border/50"}`}
            >
              {highContrast ? "High Contrast Enabled" : "Enable High Contrast"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
