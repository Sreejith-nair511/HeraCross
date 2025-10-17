"use client"

import { useState } from "react"
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

type Section =
  | "dashboard"
  | "ai-models"
  | "waste-classifier"
  | "industrial-exchange"
  | "cctv-audit"
  | "municipal-insights"
  | "ai-chat"
  | "settings"
  | "documentation"

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "ai-models":
        return <AIModelGallery />
      case "waste-classifier":
        return <WasteClassifier />
      case "industrial-exchange":
        return <IndustrialExchange />
      case "cctv-audit":
        return <CCTVAudit />
      case "municipal-insights":
        return <MunicipalInsights />
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
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} sidebarOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto fade-in">{renderContent()}</main>
      </div>
      <FloatingActionButton />
    </div>
  )
}
