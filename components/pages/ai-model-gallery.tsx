"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Zap, Filter, Play, Loader2, Image as ImageIcon, MessageSquare, Map } from "lucide-react"
import { mistralFrontendClient } from "@/lib/mistral-frontend-client"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModel, setSelectedModel] = useState<typeof models[0] | null>(null)
  const [testInput, setTestInput] = useState("")
  const [testResult, setTestResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [testType, setTestType] = useState<"text" | "image">("text")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      setTestInput(file.name) // Set the file name as test input
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTestModel = async () => {
    if (!selectedModel || (!testInput.trim() && testType === "text") || (!selectedImage && testType === "image")) return

    setIsLoading(true)
    setTestResult("")

    try {
      // Simulate different model responses based on model type
      switch (selectedModel.id) {
        case 1: // ResNet-50 - Image Classification
          if (testType === "image" && selectedImage) {
            // Simulate image classification with delay
            await new Promise(resolve => setTimeout(resolve, 1500))
            setTestResult(`Image classified as: Plastic Bottle (92.5% confidence)

Additional details:
- Material: PET Plastic
- Recyclability: High
- Disposal method: Blue recycling bin`)
          } else {
            setTestResult("Image classified as: Plastic Bottle (92.5% confidence)")
          }
          break
        case 2: // YOLO v8 - Object Detection
          if (testType === "image" && selectedImage) {
            // Simulate object detection with delay
            await new Promise(resolve => setTimeout(resolve, 2000))
            setTestResult(`Detected objects:
- Plastic Bottle (95.2% confidence)
- Metal Can (87.3% confidence)
- Paper (76.8% confidence)

Bounding boxes:
- Bottle: [120, 150, 200, 300]
- Can: [250, 180, 320, 280]
- Paper: [80, 220, 180, 270]`)
          } else {
            setTestResult("Detected objects: Plastic Bottle (95.2%), Metal Can (87.3%), Paper (76.8%)")
          }
          break
        case 3: // Mistral 7B - Language Model
          // Use frontend Mistral client for language models
          try {
            const response = await mistralFrontendClient.chatCompletion([
              { role: "user", content: testInput }
            ])
            setTestResult(response.response)
          } catch (error) {
            console.error("Mistral API error:", error)
            setTestResult("Failed to get response from Mistral API. Please try again.")
          }
          break
        case 4: // SegFormer - Semantic Segmentation
          if (testType === "image" && selectedImage) {
            // Simulate segmentation with delay
            await new Promise(resolve => setTimeout(resolve, 2500))
            setTestResult(`Segmentation map generated with 91.8% accuracy.

Identified waste types:
- Organic waste: 45%
- Plastic: 25%
- Paper: 15%
- Metal: 10%
- Glass: 5%

Recommendations:
- Separate organic waste for composting
- Recycle plastic and metal items
- Paper can be recycled up to 7 times`)
          } else {
            setTestResult("Segmentation map generated with 91.8% accuracy. Identified: Organic waste (45%), Plastic (25%), Paper (15%)")
          }
          break
        default:
          setTestResult("Model test completed successfully!")
      }
    } catch (error) {
      console.error("Model test failed:", error)
      setTestResult("Failed to test model. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setTestInput("")
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Model Gallery</h1>
        <p className="text-muted-foreground mt-1">Explore and test available AI models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search models..." 
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

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModels.map((model) => (
              <Card
                key={model.id}
                className={`bg-card/40 backdrop-blur-md border border-border/50 hover:bg-card/60 cursor-pointer transition-all duration-300 ${
                  selectedModel?.id === model.id ? "ring-2 ring-neon-green" : ""
                }`}
                onClick={() => setSelectedModel(model)}
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Model Testing Panel */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50 h-fit">
          <CardHeader>
            <CardTitle>Test Model</CardTitle>
            <CardDescription>Try out the selected AI model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedModel ? (
              <>
                <div className="p-3 bg-card/50 rounded-lg">
                  <h3 className="font-medium text-foreground">{selectedModel.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedModel.type}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={testType === "text" ? "default" : "outline"}
                    className={testType === "text" ? "bg-neon-green hover:bg-neon-green/90 text-background" : ""}
                    onClick={() => setTestType("text")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text
                  </Button>
                  <Button
                    variant={testType === "image" ? "default" : "outline"}
                    className={testType === "image" ? "bg-neon-green hover:bg-neon-green/90 text-background" : ""}
                    onClick={() => setTestType("image")}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                </div>
                
                {testType === "text" ? (
                  <Textarea
                    placeholder="Enter text to analyze..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="bg-input border-border/50 min-h-[120px]"
                  />
                ) : (
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="absolute top-2 right-2"
                          onClick={clearImage}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-neon-green transition-colors"
                        onClick={triggerFileSelect}
                      >
                        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">Upload an image</p>
                        <p className="text-muted-foreground text-sm mb-4">Click to select or drag and drop</p>
                        <Button variant="outline" className="bg-transparent">
                          Select Image
                        </Button>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                      aria-label="Select image for model testing"
                    />
                  </div>
                )}
                
                <Button
                  className="w-full bg-neon-green hover:bg-neon-green/90 text-background"
                  onClick={handleTestModel}
                  disabled={isLoading || (testType === "text" ? !testInput.trim() : !selectedImage)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Test
                    </>
                  )}
                </Button>
                
                {testResult && (
                  <div className="p-4 bg-card/50 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Result</h4>
                    <pre className="text-muted-foreground text-sm whitespace-pre-wrap">{testResult}</pre>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a model to test</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}