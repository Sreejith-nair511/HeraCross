"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle } from "lucide-react"

export default function AIChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm TrashGPT, your AI assistant for waste management questions. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }])
      setInput("")
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "This is a simulated response. Connect to Mistral API for real responses." },
        ])
      }, 500)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">TrashGPT</h1>
        <p className="text-muted-foreground mt-1">AI-powered waste management assistant</p>
      </div>

      <Card className="bg-card/40 backdrop-blur-md border border-border/50 h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-neon-green" />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === "user" ? "bg-neon-green/20 text-foreground" : "bg-card/50 text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </CardContent>
        <div className="border-t border-border/50 p-4 flex gap-2">
          <Input
            placeholder="Ask me about waste management..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="bg-input border-border/50"
          />
          <Button onClick={handleSend} className="bg-neon-green hover:bg-neon-green/90 text-background">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
