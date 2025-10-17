"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time waste management insights</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/40 backdrop-blur-md border border-border/50 shadow-lg shadow-neon-green/20 hover:shadow-neon-green/40 transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24,580 kg</div>
            <p className="text-xs text-neon-green mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50 shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recycling Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">68%</div>
            <p className="text-xs text-neon-cyan mt-1">+5% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50 shadow-lg shadow-neon-violet/20 hover:shadow-neon-violet/40 transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Segregation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">82%</div>
            <p className="text-xs text-neon-violet mt-1">Efficiency score</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-destructive mt-1">Bin overflow detected</p>
          </CardContent>
        </Card>
      </div>

      {/* External AI Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>RealWaste Prediction</CardTitle>
            <CardDescription>Deep learning waste prediction model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[450px]">
              <iframe
                src="https://silverblade254-realwaste-prediction-deep-learning.hf.space"
                frameBorder="0"
                width="100%"
                height="450"
                className="rounded-lg"
              ></iframe>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>Garbage Classifier</CardTitle>
            <CardDescription>AI-powered waste classification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[450px]">
              <iframe
                src="https://bhushanmehar-garbage-classifier-app.hf.space"
                frameBorder="0"
                width="100%"
                height="450"
                className="rounded-lg"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}