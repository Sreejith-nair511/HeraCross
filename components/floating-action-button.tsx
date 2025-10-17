"use client"

import { Zap } from "lucide-react"
import { useState } from "react"

export default function FloatingActionButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRunInferences = async () => {
    setIsLoading(true)
    // Simulate running inferences
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleRunInferences}
      disabled={isLoading}
      className="fab group"
      title="Run All Inferences"
      aria-label="Run all inferences"
    >
      <Zap
        className={`w-6 h-6 transition-transform duration-300 ${isLoading ? "animate-spin" : "group-hover:rotate-12"}`}
      />
    </button>
  )
}
