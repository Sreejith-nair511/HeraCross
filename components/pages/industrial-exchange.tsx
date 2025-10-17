"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, MessageSquare } from "lucide-react"

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
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Industrial Waste Exchange</h1>
        <p className="text-muted-foreground mt-1">Marketplace for industrial waste trading</p>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {listings.map((listing) => (
          <Card
            key={listing.id}
            className="bg-card/40 backdrop-blur-md border border-border/50 hover:bg-card/60 transition-all duration-300"
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
  )
}
