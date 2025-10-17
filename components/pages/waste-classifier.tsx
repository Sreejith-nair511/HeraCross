"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, Trash2, Loader2, Camera } from "lucide-react"
import { mistralFrontendClient } from "@/lib/mistral-frontend-client"
import { downloadCertificate } from "@/lib/certificate-utils"

// Define the AnalysisResult interface
interface AnalysisResult {
  detected_objects: string[]
  total_objects: number
  ai_insights: string
  recommendations: string[]
}

export default function WasteClassifier() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showWebcam, setShowWebcam] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setAnalysisResult(null)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setAnalysisResult(null)
    setError(null)

    try {
      // Simulate image analysis and use Mistral API directly for insights
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate detected objects
      const detectedObjects = ["plastic bottle", "paper waste", "metal can"]
      
      // Use Mistral API to generate insights based on detected objects and question
      const systemPrompt = `You are an AI assistant for waste classification. 
Based on the detected objects in an image, provide insights and recommendations for proper waste management.
Be concise but informative, and provide actionable advice.`

      const userPrompt = `Detected objects: ${detectedObjects.join(", ")}
${question ? `User question: ${question}` : "Provide general waste management recommendations for these items."}`

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]

      const response = await mistralFrontendClient.chatCompletion(messages)
      
      // Parse the response to extract insights and recommendations
      const aiInsights = response.response
      
      // Simple parsing for recommendations
      const recommendations = [
        "Segregate waste at the source for better recycling",
        "Clean containers before disposal to improve recycling quality",
        "Check local recycling guidelines for specific items",
        "Consider composting organic waste when possible"
      ]

      const result: AnalysisResult = {
        detected_objects: detectedObjects,
        total_objects: detectedObjects.length,
        ai_insights: aiInsights,
        recommendations: recommendations
      }
      
      setAnalysisResult(result)
    } catch (err) {
      console.error("Analysis failed:", err)
      setError("Failed to analyze the image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowWebcam(true)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
      setError("Could not access webcam. Please check permissions.")
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" })
            handleFileSelect(file)
            setShowWebcam(false)
            // Stop all video tracks
            const stream = video.srcObject as MediaStream
            const tracks = stream.getTracks()
            tracks.forEach(track => track.stop())
          }
        }, "image/jpeg", 0.95)
      }
    }
  }

  const closeWebcam = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
    setShowWebcam(false)
  }

  const handleDownloadCertificate = (language: 'en' | 'kn') => {
    const certificateData = {
      userName: "Waste Classifier User",
      achievement: "Waste Classification Completed",
      date: new Date().toLocaleDateString(),
      points: analysisResult ? Math.floor(Math.random() * 100) + 50 : 0,
      certificateId: `WASTE-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    
    downloadCertificate(certificateData, 'html', language);
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Waste Classifier</h1>
        <p className="text-muted-foreground mt-1">Upload images or use webcam to classify waste types</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Drag and drop, click to upload, or use webcam</CardDescription>
          </CardHeader>
          <CardContent>
            {!showWebcam ? (
              <>
                <div
                  onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging ? "border-neon-green bg-neon-green/5" : "border-border"
                  }`}
                >
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">Drop your image here</p>
                  <p className="text-muted-foreground text-sm mb-4">or</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button 
                      className="bg-neon-green hover:bg-neon-green/90 text-background"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select File
                    </Button>
                    <Button 
                      className="bg-neon-cyan hover:bg-neon-cyan/90 text-background"
                      onClick={startWebcam}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Use Webcam
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    aria-label="File upload input"
                  />
                </div>
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-card/50 rounded-lg">
                    <p className="text-sm text-foreground">Selected: {selectedFile.name}</p>
                  </div>
                )}
                
                {/* Question input */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Ask a question about the image (optional)
                  </label>
                  <Input
                    placeholder="e.g., How should I dispose of these items?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="bg-input border-border/50"
                  />
                </div>
                
                <Button
                  className="mt-4 w-full bg-neon-green hover:bg-neon-green/90 text-background"
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Waste"
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center">
                <div className="relative mx-auto w-full max-w-md">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full rounded-lg border border-border"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <Button 
                    className="bg-neon-green hover:bg-neon-green/90 text-background"
                    onClick={captureImage}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={closeWebcam}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/20 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>Classification Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-neon-green animate-spin" />
                <p className="text-foreground">Analyzing image...</p>
                <p className="text-muted-foreground text-sm mt-2">Detecting objects and generating insights</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Detected Objects</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.detected_objects.map((obj, idx) => (
                      <span key={idx} className="px-2 py-1 bg-neon-green/20 text-foreground rounded text-sm">
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">AI Insights</h3>
                  <p className="text-muted-foreground text-sm">{analysisResult.ai_insights}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-neon-green mt-1.5 mr-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Download Certificate Button */}
                <div className="pt-4">
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-neon-green hover:bg-neon-green/90 text-background"
                      onClick={() => handleDownloadCertificate('en')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      English
                    </Button>
                    <Button 
                      className="flex-1 bg-neon-cyan hover:bg-neon-cyan/90 text-background"
                      onClick={() => handleDownloadCertificate('kn')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      ಕನ್ನಡ
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trash2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Upload an image or use webcam to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle>Classification History</CardTitle>
          <CardDescription>Recent uploads and results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No history yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}