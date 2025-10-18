"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import TopNav from "@/components/top-nav"
import FloatingActionButton from "@/components/floating-action-button"
import Dashboard from "@/components/pages/dashboard"
import AIModelGallery from "@/components/pages/ai-model-gallery"
import WasteClassifier from "@/components/pages/waste-classifier"
import IndustrialExchange from "@/components/pages/industrial-exchange"
import CCTVAudit from "@/components/pages/cctv-audit"
import MunicipalInsights from "@/components/pages/municipal-insights"
import AIChat from "@/components/pages/ai-chat"
import Settings from "@/components/pages/settings"
import Documentation from "@/components/pages/documentation"
import Leaderboard from "@/components/pages/leaderboard"
import GarbageMap from "@/components/pages/garbage-map"
import { useIsMobile } from "@/hooks/use-mobile"

type Section =
  | "dashboard"
  | "ai-models"
  | "waste-classifier"
  | "leaderboard"
  | "industrial-exchange"
  | "cctv-audit"
  | "municipal-insights"
  | "garbage-map"
  | "ai-chat"
  | "settings"
  | "documentation"

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useIsMobile()

  // Handle sidebar state based on screen size
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "ai-models":
        return <AIModelGallery />
      case "waste-classifier":
        return <WasteClassifier />
      case "leaderboard":
        return <Leaderboard />
      case "industrial-exchange":
        return <IndustrialExchange />
      case "cctv-audit":
        return <CCTVAudit />
      case "municipal-insights":
        return <MunicipalInsights />
      case "garbage-map":
        return <GarbageMap />
      case "ai-chat":
        return <AIChat />
      case "settings":
        return <Settings />
      case "documentation":
        return <Documentation />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto fade-in p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
      <FloatingActionButton />
    </div>
  )
}