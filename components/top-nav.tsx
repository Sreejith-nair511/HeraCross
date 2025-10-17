"use client"

import { Menu, Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ThemeToggle from "@/components/theme-toggle"
import LanguageSelector from "@/components/language-selector"
import Logo from "@/components/logo"
import { useLanguage } from "@/contexts/language-context"

interface TopNavProps {
  onToggleSidebar: () => void
}

export default function TopNav({ onToggleSidebar }: TopNavProps) {
  const { t } = useLanguage()

  return (
    <header className="bg-card/50 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-foreground hover:bg-card focus-ring"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Logo size="sm" variant="icon" />

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            className="pl-10 bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus-ring"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSelector />
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-card focus-ring relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-green rounded-full"></span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-card focus-ring"
          aria-label="User profile"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
