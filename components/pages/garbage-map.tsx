"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, Filter, Trash2, Recycle, AlertTriangle, Loader2 } from "lucide-react"

// Mock data for Bangalore garbage collection points
const bangaloreAreas = [
  { id: 1, name: "Madhuranagar", lat: 12.9716, lng: 77.5946, wasteLevel: 85, collectionTime: "6:00 AM", type: "residential" },
  { id: 2, name: "Varthur", lat: 12.9716, lng: 77.5946, wasteLevel: 65, collectionTime: "7:30 AM", type: "commercial" },
  { id: 3, name: "Samethanahalli", lat: 12.9716, lng: 77.5946, wasteLevel: 45, collectionTime: "8:00 AM", type: "residential" },
  { id: 4, name: "Hoskote Taluk", lat: 12.9716, lng: 77.5946, wasteLevel: 95, collectionTime: "5:30 AM", type: "industrial" },
  { id: 5, name: "Jayanager", lat: 12.9716, lng: 77.5946, wasteLevel: 75, collectionTime: "6:45 AM", type: "residential" },
]

const wasteTypes = [
  { id: 1, name: "Organic Waste", color: "bg-green-500" },
  { id: 2, name: "Plastic Waste", color: "bg-blue-500" },
  { id: 3, name: "Paper Waste", color: "bg-yellow-500" },
  { id: 4, name: "Metal Waste", color: "bg-gray-500" },
]

export default function GarbageMap() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedArea, setSelectedArea] = useState<typeof bangaloreAreas[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredAreas = bangaloreAreas.filter(area => 
    (area.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === "") &&
    (filterType === "all" || area.type === filterType)
  )

  const getWasteLevelColor = (level: number) => {
    if (level >= 80) return "text-red-500"
    if (level >= 60) return "text-yellow-500"
    return "text-green-500"
  }

  const handleAreaSelect = (area: typeof bangaloreAreas[0]) => {
    setSelectedArea(area)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bangalore Garbage Map</h1>
        <p className="text-muted-foreground mt-1">Interactive map of waste collection points in Bangalore</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-neon-green" />
              Interactive Map
            </CardTitle>
            <CardDescription>Real-time waste collection status across Bangalore</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[500px] bg-gradient-to-br from-card to-muted rounded-lg border border-border overflow-hidden">
              {/* Map placeholder with interactive points */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20">
                {/* Bangalore map outline */}
                <div className="absolute inset-4 border-2 border-neon-green/30 rounded-lg"></div>
                
                {/* Waste collection points */}
                {filteredAreas.map((area) => (
                  <div
                    key={area.id}
                    className={`absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                      selectedArea?.id === area.id 
                        ? "ring-4 ring-neon-green scale-125 z-10" 
                        : "ring-2 ring-white hover:scale-110"
                    } ${
                      area.wasteLevel >= 80 
                        ? "bg-red-500" 
                        : area.wasteLevel >= 60 
                          ? "bg-yellow-500" 
                          : "bg-green-500"
                    }`}
                    style={{
                      left: `${20 + (area.id * 15)}%`,
                      top: `${30 + (area.id * 10)}%`
                    }}
                    onClick={() => handleAreaSelect(area)}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap">
                      {area.name}
                    </div>
                  </div>
                ))}
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground text-sm mb-2">Waste Level</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-muted-foreground">Low (&lt;60%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs text-muted-foreground">Medium (60-80%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs text-muted-foreground">High (&gt;80%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-card/80 backdrop-blur"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshIcon />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-card/40 backdrop-blur-md border border-border/50">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search areas..." 
                  className="pl-10 bg-input border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-input border-border/50">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Area List */}
          <Card className="bg-card/40 backdrop-blur-md border border-border/50">
            <CardHeader>
              <CardTitle>Collection Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAreas.map((area) => (
                <div
                  key={area.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedArea?.id === area.id
                      ? "bg-neon-green/10 border-neon-green"
                      : "bg-card/50 border-border hover:bg-card/70"
                  }`}
                  onClick={() => handleAreaSelect(area)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{area.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{area.type}</p>
                    </div>
                    <span className={`text-sm font-bold ${getWasteLevelColor(area.wasteLevel)}`}>
                      {area.wasteLevel}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-muted-foreground">Collection: {area.collectionTime}</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Waste Types */}
          <Card className="bg-card/40 backdrop-blur-md border border-border/50">
            <CardHeader>
              <CardTitle>Waste Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {wasteTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                  <span className="text-sm text-foreground">{type.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Area Details */}
      {selectedArea && (
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedArea.name}</CardTitle>
                <CardDescription>Waste Collection Point</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedArea(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-card/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-1">Waste Level</h4>
                <p className={`text-2xl font-bold ${getWasteLevelColor(selectedArea.wasteLevel)}`}>
                  {selectedArea.wasteLevel}%
                </p>
              </div>
              <div className="p-3 bg-card/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-1">Collection Time</h4>
                <p className="text-2xl font-bold text-neon-green">{selectedArea.collectionTime}</p>
              </div>
              <div className="p-3 bg-card/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-1">Area Type</h4>
                <p className="text-2xl font-bold text-neon-cyan capitalize">{selectedArea.type}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button className="bg-neon-green hover:bg-neon-green/90 text-background">
                <Trash2 className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
              <Button variant="outline">
                <Recycle className="w-4 h-4 mr-2" />
                Recycling Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}