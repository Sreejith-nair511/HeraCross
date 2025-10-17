"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, AlertTriangle, Download } from "lucide-react"

export default function CCTVAudit() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">CCTV Waste Audit</h1>
        <p className="text-muted-foreground mt-1">Analyze video feeds for waste management insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Upload */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload Video Feed</CardTitle>
            <CardDescription>Upload or stream CCTV footage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">Drop your video here</p>
              <Button className="bg-neon-green hover:bg-neon-green/90 text-background mt-4">Select Video</Button>
            </div>
          </CardContent>
        </Card>

        {/* Anomalies */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>Detected Anomalies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Bin Overflow</p>
                <p className="text-xs text-muted-foreground">2 instances</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-neon-violet/10 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-neon-violet flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Illegal Dumping</p>
                <p className="text-xs text-muted-foreground">1 instance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle>AI Summary Report</CardTitle>
          <CardDescription>Generate comprehensive audit report</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="gap-2 bg-neon-cyan hover:bg-neon-cyan/90 text-background">
            <Download className="w-4 h-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
