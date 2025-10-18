"use client"
import { useEffect } from "react"
import {
  ChevronRight,
  LayoutDashboard,
  Zap,
  Trash2,
  Store,
  Video,
  BarChart3,
  MessageSquare,
  Settings,
  BookOpen,
  Award,
  Trophy,
  Map,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: any) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ai-models", label: "AI Models", icon: Zap },
  { id: "waste-classifier", label: "Waste Classifier", icon: Trash2 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "industrial-exchange", label: "Industrial Exchange", icon: Store },
  { id: "cctv-audit", label: "CCTV Audit", icon: Video },
  { id: "municipal-insights", label: "Municipal Insights", icon: BarChart3 },
  { id: "garbage-map", label: "Garbage Map", icon: Map },
  { id: "ai-chat", label: "TrashGPT", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "documentation", label: "Documentation", icon: BookOpen },
]

export default function Sidebar({ activeSection, onSectionChange, sidebarOpen, onToggleSidebar }: SidebarProps) {
  const isMobile = useIsMobile()

  // Close sidebar on mobile when a section is selected (with delay to prevent flickering)
  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId)
    // Only close sidebar on mobile after a short delay to prevent flickering
    if (isMobile && sidebarOpen) {
      setTimeout(() => {
        onToggleSidebar()
      }, 150)
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggleSidebar}
        />
      )}
      
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isMobile 
            ? "fixed inset-y-0 z-50 w-64" 
            : (sidebarOpen ? "w-64" : "w-20"),
          isMobile && !sidebarOpen ? "transform -translate-x-full" : "",
          isMobile && sidebarOpen ? "transform translate-x-0" : "",
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className={cn("flex items-center gap-2", !sidebarOpen && !isMobile && "justify-center w-full")}>
            <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            {(sidebarOpen || !isMobile) && <span className="font-bold text-lg text-foreground">OpenCity</span>}
          </div>
          {isMobile && sidebarOpen && (
            <button 
              onClick={onToggleSidebar}
              className="p-1 rounded-md hover:bg-sidebar-accent/20"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleSectionChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-neon-green/30"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                    )}
                    title={!sidebarOpen && !isMobile ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {(sidebarOpen || !isMobile) && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4" />}
                      </>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("text-xs text-sidebar-foreground/60", (!sidebarOpen && !isMobile) && "text-center")}>
            {(sidebarOpen || !isMobile) ? "v1.0.0" : ""}
          </div>
        </div>
      </aside>
    </>
  )
}