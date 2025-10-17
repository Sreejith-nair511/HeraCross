"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Recycle, Trash2, TrendingUp, Calendar, MapPin, Users, Loader2 } from "lucide-react"
import { mistralFrontendClient } from "@/lib/mistral-frontend-client"

// Updated data for Bangalore areas
const trendData = [
  { day: "Mon", waste: 2400, recycled: 1600 },
  { day: "Tue", waste: 2210, recycled: 1500 },
  { day: "Wed", waste: 2290, recycled: 1700 },
  { day: "Thu", waste: 2000, recycled: 1400 },
  { day: "Fri", waste: 2181, recycled: 1600 },
  { day: "Sat", waste: 2500, recycled: 1800 },
  { day: "Sun", waste: 2100, recycled: 1500 },
]

const wasteCompositionData = [
  { name: "Organic", value: 45, color: "#22c55e" },
  { name: "Plastic", value: 25, color: "#06b6d4" },
  { name: "Paper", value: 15, color: "#f59e0b" },
  { name: "Metal", value: 10, color: "#8b5cf6" },
  { name: "Other", value: 5, color: "#ef4444" },
]

const userData = [
  { month: "Jan", users: 120, classifications: 420 },
  { month: "Feb", users: 180, classifications: 650 },
  { month: "Mar", users: 240, classifications: 890 },
  { month: "Apr", users: 310, classifications: 1200 },
  { month: "May", users: 420, classifications: 1650 },
  { month: "Jun", users: 510, classifications: 1980 },
]

// Bangalore-specific data
const bangaloreAreas = [
  { name: "Madhuranagar", waste: 1200, recycling: 800 },
  { name: "Varthur", waste: 950, recycling: 650 },
  { name: "Samethanahalli", waste: 780, recycling: 520 },
  { name: "Hoskote Taluk", waste: 1100, recycling: 720 },
  { name: "Jayanager", waste: 1350, recycling: 900 },
]

export default function MunicipalInsights() {
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  useEffect(() => {
    fetchAIRecommendations()
  }, [])

  const fetchAIRecommendations = async () => {
    setIsLoadingRecommendations(true)
    try {
      // Prepare data for AI analysis
      const dataSummary = `
Bangalore Waste Management Data:
- Total classifications: 12,480
- Accuracy rate: 94.2%
- Active users: 1,842
- Waste composition: Organic (45%), Plastic (25%), Paper (15%), Metal (10%), Other (5%)
- Areas: Madhuranagar, Varthur, Samethanahalli, Hoskote Taluk, Jayanager

Based on this data, provide 3 specific, actionable recommendations for improving waste management in Bangalore.
Each recommendation should be concise (under 100 characters) and include a specific action.
`

      const messages = [
        { 
          role: "system", 
          content: "You are an AI assistant for municipal waste management. Provide specific, actionable recommendations based on data. Each recommendation should be concise and include a specific action." 
        },
        { 
          role: "user", 
          content: dataSummary 
        }
      ]

      const response = await mistralFrontendClient.chatCompletion(messages)
      
      // Parse recommendations from response
      const recommendations = response.response
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 3)
      
      setAiRecommendations(recommendations)
    } catch (error) {
      console.error("Failed to fetch AI recommendations:", error)
      // Fallback recommendations
      setAiRecommendations([
        "Optimize bin placement in high-traffic areas to reduce overflow incidents",
        "Adjust collection schedules based on weekend waste generation patterns",
        "Focus recycling efforts on plastic waste in commercial zones"
      ])
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Municipal Insights - BBMP</h1>
        <p className="text-muted-foreground mt-1">Analytics and forecasts for Bangalore waste management</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-neon-green" />
              Total Classifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12,480</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Recycle className="w-4 h-4 text-neon-cyan" />
              Accuracy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94.2%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.1% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-violet" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,842</div>
            <p className="text-xs text-muted-foreground mt-1">+8% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-destructive" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,650</div>
            <p className="text-xs text-muted-foreground mt-1">Classifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Bangalore Area Data */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-neon-green" />
            Waste Management by Area (BBMP Zones)
          </CardTitle>
          <CardDescription>Madhuranagar, Varthur, Samethanahalli, Hoskote Taluk, Jayanager</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bangaloreAreas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Bar dataKey="waste" fill="#22c55e" name="Waste Generated (kg)" />
              <Bar dataKey="recycling" fill="#06b6d4" name="Recycled (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>Daily waste collection and recycling</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                <Legend />
                <Bar dataKey="waste" fill="#22c55e" />
                <Bar dataKey="recycled" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>Waste Composition</CardTitle>
            <CardDescription>Distribution of waste types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteCompositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {wasteCompositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly active users and classifications</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="classifications" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
            <CardDescription>Predicted waste for next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                <Line type="monotone" dataKey="waste" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-neon-green" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingRecommendations ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-neon-green" />
              <span className="ml-2 text-foreground">Generating recommendations...</span>
            </div>
          ) : (
            aiRecommendations.map((recommendation, index) => (
              <div 
                key={index} 
                className="p-3 bg-card/50 rounded-lg border border-border/50 hover:bg-card/60 transition-colors"
              >
                <p className="text-sm text-foreground">{recommendation}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}