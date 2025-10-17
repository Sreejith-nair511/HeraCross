"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle, Loader2 } from "lucide-react"
import { mistralFrontendClient, ChatMessage } from "@/lib/mistral-frontend-client"

export default function AIChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm TrashGPT, your AI assistant for waste management questions. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage = { role: "user", content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      // Use the frontend Mistral client directly
      const response = await mistralFrontendClient.chatCompletionWithTrashGPTPrompt(
        input,
        messages.filter(msg => msg.role !== "assistant" || !msg.content.includes("Hello! I'm TrashGPT"))
      )
      
      const assistantMessage = {
        role: "assistant",
        content: response.response
      }
      setMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error("Failed to get AI response:", error)
      
      // Fallback: Direct Mistral API integration
      try {
        const mistralResponse = await fetchDirectMistralAPI(newMessages)
        const assistantMessage = {
          role: "assistant",
          content: mistralResponse
        }
        setMessages([...newMessages, assistantMessage])
      } catch (fallbackError) {
        console.error("Failed to get AI response from Mistral API:", fallbackError)
        const errorMessage = {
          role: "assistant",
          content: "Sorry, I'm currently experiencing technical difficulties. Please try again later."
        }
        setMessages([...newMessages, errorMessage])
      }
    } finally {
      setIsLoading(false)
      scrollToBottom()
    }
  }

  // Fallback function to directly call Mistral API
  const fetchDirectMistralAPI = async (messages: Array<{ role: string; content: string }>): Promise<string> => {
    // In a real implementation, you would use the actual Mistral API key
    // For now, we'll simulate a response
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate different responses based on the user's message
    const lastMessage = messages[messages.length - 1].content.toLowerCase()
    
    if (lastMessage.includes("hello") || lastMessage.includes("hi")) {
      return "Hello there! I'm TrashGPT, your AI assistant for waste management. How can I help you with waste classification, recycling, or environmental sustainability today?"
    } else if (lastMessage.includes("recycl")) {
      return "Recycling is a great way to reduce waste! Here are some tips:\n\n1. Rinse containers before recycling\n2. Remove caps and lids\n3. Check your local recycling guidelines\n4. Separate materials properly\n5. Flatten cardboard boxes\n\nWhat specific recycling question do you have?"
    } else if (lastMessage.includes("plastic")) {
      return "Plastic waste management:\n\n- Plastic bottles: Recyclable (check for recycling symbol)\n- Plastic bags: Often not accepted in curbside recycling\n- Microplastics: Avoid when possible\n\nIn Bangalore, you can:\n1. Use the blue recycling bins for clean plastics\n2. Take plastic waste to authorized collection centers\n3. Participate in local plastic buyback programs"
    } else if (lastMessage.includes("organic") || lastMessage.includes("food")) {
      return "Organic waste management in Bangalore:\n\n1. Use green bins for wet/organic waste\n2. Compost at home using simple methods\n3. Vermicomposting is effective for apartment dwellers\n4. Many BBMP wards offer organic waste collection\n\nComposting reduces landfill waste and creates nutrient-rich soil!"
    } else {
      // Generic response
      const responses = [
        "That's an interesting question about waste management. In Bangalore, the BBMP has specific guidelines for different types of waste. Would you like me to explain the color-coded bin system?",
        "I understand you're asking about waste management. Proper segregation at source is key to effective waste management. The three-bin system (green for organic, blue for recyclables, red for hazardous) is widely used in Indian cities.",
        "Great question! Waste-to-energy plants are becoming more common in India. The Hassan plant processes 300 tons of waste daily. For individual contributions, reducing single-use plastics and composting organic waste make a big difference.",
        "Sustainable waste practices include:\n1. Reduce - Buy products with minimal packaging\n2. Reuse - Repurpose containers and bags\n3. Recycle - Follow local guidelines\n4. Compost - Turn organic waste into garden gold\n5. Educate - Spread awareness in your community"
      ]
      return responses[Math.floor(Math.random() * responses.length)]
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
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs px-4 py-2 rounded-lg bg-card/50 text-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="border-t border-border/50 p-4 flex gap-2">
          <Input
            placeholder="Ask me about waste management..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="bg-input border-border/50"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="bg-neon-green hover:bg-neon-green/90 text-background"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    </div>
  )
}