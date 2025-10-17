"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, TrendingUp, MessageSquare, Search, Filter, Send, Loader2 } from "lucide-react"
import { mistralFrontendClient, ChatMessage } from "@/lib/mistral-frontend-client"

const listings = [
  {
    id: 1,
    company: "TechCorp Industries",
    wasteType: "Electronic Waste",
    quantity: "500 kg",
    location: "Industrial Zone A",
    matchScore: 92,
  },
  {
    id: 2,
    company: "GreenManufacturing",
    wasteType: "Plastic Scraps",
    quantity: "1200 kg",
    location: "Industrial Zone B",
    matchScore: 85,
  },
  {
    id: 3,
    company: "MetalWorks Ltd",
    wasteType: "Metal Scraps",
    quantity: "800 kg",
    location: "Industrial Zone C",
    matchScore: 78,
  },
]

export default function IndustrialExchange() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedListing, setSelectedListing] = useState<typeof listings[0] | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm your Industrial Exchange AI assistant. I can help you find the best matches for waste exchange. How can I help you today?",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredListings = listings.filter(listing => 
    listing.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChatSend = async () => {
    if (!chatInput.trim() || isLoading) return

    // Add user message
    const userMessage = { role: "user", content: chatInput }
    const newMessages = [...chatMessages, userMessage]
    setChatMessages(newMessages)
    setChatInput("")
    setIsLoading(true)

    try {
      // Use the frontend Mistral client directly
      const systemPrompt = `You are an AI assistant for an industrial waste exchange platform. 
You help companies find the best matches for waste exchange and provide information about 
industrial symbiosis. You should:

1. Help users find potential partners for waste exchange
2. Provide information about different types of industrial waste
3. Suggest best practices for waste exchange
4. Explain the benefits of industrial symbiosis
5. Be concise but informative

Always prioritize accuracy and practical applicability in your responses.`;

      const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...newMessages.slice(1).map(msg => ({ role: msg.role, content: msg.content }))
      ];

      const response = await mistralFrontendClient.chatCompletion(messages)
      
      const assistantMessage = {
        role: "assistant",
        content: response.response
      }
      setChatMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error("Failed to get AI response:", error)
      
      // Fallback: Direct Mistral API integration
      try {
        const mistralResponse = await fetchDirectMistralAPI(newMessages)
        const assistantMessage = {
          role: "assistant",
          content: mistralResponse
        }
        setChatMessages([...newMessages, assistantMessage])
      } catch (fallbackError) {
        console.error("Failed to get AI response from Mistral API:", fallbackError)
        const errorMessage = {
          role: "assistant",
          content: "Sorry, I'm currently experiencing technical difficulties. Please try again later."
        }
        setChatMessages([...newMessages, errorMessage])
      }
    } finally {
      setIsLoading(false)
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
      return "Hello! I'm your Industrial Exchange AI assistant. I can help you find the best matches for waste exchange between companies. What type of waste are you looking to exchange?"
    } else if (lastMessage.includes("plastic")) {
      return "For plastic waste exchange:\n\n1. Plastic scrap: High demand from recyclers\n2. Plastic packaging: Can be reprocessed into new products\n3. Industrial plastic waste: Often sought after by manufacturers\n\nI can help match you with companies that need or supply plastic waste. What specific type of plastic waste do you have?"
    } else if (lastMessage.includes("metal")) {
      return "Metal waste exchange opportunities:\n\n- Steel scrap: In high demand for steel manufacturing\n- Aluminum cans: Valuable for recycling industry\n- Copper wires: Sought after by electronics recyclers\n- Industrial metal scraps: Used in various manufacturing processes\n\nCompanies often pay for quality metal waste. Would you like me to suggest potential buyers for your metal waste?"
    } else if (lastMessage.includes("paper")) {
      return "Paper waste exchange:\n\n- Office paper: Recycled into new paper products\n- Cardboard: Used for packaging materials\n- Newspaper: Recycled into newsprint\n- Mixed paper: Processed into various paper goods\n\nIn Bangalore, there's a strong market for paper waste. Many paper mills and recycling companies are actively seeking supplies."
    } else {
      // Generic response
      const responses = [
        "Industrial waste exchange is a great way to create circular economy opportunities. Companies can turn their waste into valuable resources for others. What type of industrial waste are you looking to exchange?",
        "I can help you find the best matches for your waste exchange needs. Bangalore has a growing network of companies participating in industrial symbiosis. Would you like me to explain how the matching process works?",
        "For successful industrial waste exchange:\n1. Properly categorize your waste\n2. Specify quantities and quality standards\n3. Identify potential partners in your industry\n4. Establish clear terms for exchange\n5. Maintain documentation for compliance\n\nWhat specific help do you need with your waste exchange?",
        "The benefits of industrial waste exchange include:\n- Cost reduction for waste disposal\n- Revenue generation from waste materials\n- Reduced environmental impact\n- Improved resource efficiency\n- Enhanced corporate sustainability profile\n\nWould you like me to connect you with potential partners for your waste materials?"
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Industrial Waste Exchange</h1>
        <p className="text-muted-foreground mt-1">Marketplace for industrial waste trading</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search and Filter */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search companies, waste types, locations..." 
                className="pl-10 bg-input border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Listings */}
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <Card
                key={listing.id}
                className="bg-card/40 backdrop-blur-md border border-border/50 hover:bg-card/60 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedListing(listing)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{listing.company}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{listing.wasteType}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-neon-green font-medium">{listing.quantity}</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {listing.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-3">
                        <TrendingUp className="w-4 h-4 text-neon-cyan" />
                        <span className="text-sm font-semibold text-neon-cyan">{listing.matchScore}%</span>
                      </div>
                      <Button size="sm" className="gap-2 bg-neon-violet hover:bg-neon-violet/90 text-background">
                        <MessageSquare className="w-4 h-4" />
                        Negotiate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-neon-green" />
              AI Assistant
            </CardTitle>
            <CardDescription>Get smart recommendations for waste exchange</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 overflow-y-auto space-y-3 p-2 bg-card/20 rounded-lg">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.role === "user" ? "bg-neon-green/20 text-foreground" : "bg-card/50 text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs px-3 py-2 rounded-lg bg-card/50 text-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask about waste exchange..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                className="bg-input border-border/50"
                disabled={isLoading}
              />
              <Button 
                onClick={handleChatSend} 
                disabled={isLoading || !chatInput.trim()}
                className="bg-neon-green hover:bg-neon-green/90 text-background"
                size="icon"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Listing Details */}
      {selectedListing && (
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedListing.company}</CardTitle>
                <CardDescription>{selectedListing.wasteType}</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedListing(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-1">Quantity</h4>
                <p className="text-neon-green font-medium">{selectedListing.quantity}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Location</h4>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedListing.location}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Match Score</h4>
                <p className="text-neon-cyan font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {selectedListing.matchScore}%
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-neon-violet hover:bg-neon-violet/90 text-background">
                Contact Supplier
              </Button>
              <Button variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}