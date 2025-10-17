"use client"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: any) => void
  sidebarOpen: boolean
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ai-models", label: "AI Models", icon: Zap },
  { id: "waste-classifier", label: "Waste Classifier", icon: Trash2 },
  { id: "industrial-exchange", label: "Industrial Exchange", icon: Store },
  { id: "cctv-audit", label: "CCTV Audit", icon: Video },
  { id: "municipal-insights", label: "Municipal Insights", icon: BarChart3 },
  { id: "ai-chat", label: "TrashGPT", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "documentation", label: "Documentation", icon: BookOpen },
]

export default function Sidebar({ activeSection, onSectionChange, sidebarOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-20",
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className={cn("flex items-center gap-2", !sidebarOpen && "justify-center w-full")}>
          <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-background" />
          </div>
          {sidebarOpen && <span className="font-bold text-lg text-foreground">OpenCity</span>}
        </div>
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
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-neon-green/30"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
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
        <div className={cn("text-xs text-sidebar-foreground/60", !sidebarOpen && "text-center")}>
          {sidebarOpen ? "v1.0.0" : ""}
        </div>
      </div>
    </aside>
  )
}
