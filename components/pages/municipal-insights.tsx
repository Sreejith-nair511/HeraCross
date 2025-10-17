"use client"

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
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

const trendData = [
  { day: "Mon", waste: 2400, recycled: 1600 },
  { day: "Tue", waste: 2210, recycled: 1500 },
  { day: "Wed", waste: 2290, recycled: 1700 },
  { day: "Thu", waste: 2000, recycled: 1400 },
  { day: "Fri", waste: 2181, recycled: 1600 },
  { day: "Sat", waste: 2500, recycled: 1800 },
  { day: "Sun", waste: 2100, recycled: 1500 },
]

export default function MunicipalInsights() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Municipal Insights</h1>
        <p className="text-muted-foreground mt-1">Analytics and forecasts for waste management</p>
      </div>

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

      {/* Recommendations */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-neon-green" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-neon-green/10 rounded-lg border border-neon-green/20">
            <p className="text-sm font-medium text-foreground">Optimize Bin Placement</p>
            <p className="text-xs text-muted-foreground mt-1">Add 5 more bins in Ward 3 to reduce overflow incidents</p>
          </div>
          <div className="p-3 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20">
            <p className="text-sm font-medium text-foreground">Adjust Collection Schedule</p>
            <p className="text-xs text-muted-foreground mt-1">Increase collections on weekends by 20%</p>
          </div>
          <div className="p-3 bg-neon-violet/10 rounded-lg border border-neon-violet/20">
            <p className="text-sm font-medium text-foreground">Focus Recycling Efforts</p>
            <p className="text-xs text-muted-foreground mt-1">Prioritize plastic waste in high-density areas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
