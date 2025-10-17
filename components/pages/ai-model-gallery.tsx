"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Zap, Filter } from "lucide-react"

const models = [
  {
    id: 1,
    name: "ResNet-50",
    type: "Image Classification",
    provider: "Hugging Face",
    tags: ["Vision", "Classification"],
    description: "Deep residual network for image classification",
    accuracy: "92.5%",
  },
  {
    id: 2,
    name: "YOLO v8",
    type: "Object Detection",
    provider: "Hugging Face",
    tags: ["Vision", "Detection"],
    description: "Real-time object detection model",
    accuracy: "95.2%",
  },
  {
    id: 3,
    name: "Mistral 7B",
    type: "Language Model",
    provider: "Mistral AI",
    tags: ["NLP", "Chat"],
    description: "Efficient language model for text generation",
    accuracy: "88.1%",
  },
  {
    id: 4,
    name: "SegFormer",
    type: "Semantic Segmentation",
    provider: "Hugging Face",
    tags: ["Vision", "Segmentation"],
    description: "Efficient semantic segmentation model",
    accuracy: "91.8%",
  },
]

export default function AIModelGallery() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Model Gallery</h1>
        <p className="text-muted-foreground mt-1">Explore and test available AI models</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search models..." className="pl-10 bg-input border-border/50" />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card
            key={model.id}
            className="bg-card/40 backdrop-blur-md border border-border/50 hover:bg-card/60 cursor-pointer transition-all duration-300"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <CardDescription>{model.type}</CardDescription>
                </div>
                <Zap className="w-5 h-5 text-neon-green" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{model.description}</p>
              <div className="flex gap-2 flex-wrap">
                {model.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-neon-green/10 text-neon-green text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">{model.provider}</span>
                <span className="text-sm font-semibold text-neon-cyan">{model.accuracy}</span>
              </div>
              <Button className="w-full bg-neon-green hover:bg-neon-green/90 text-background">Try Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
