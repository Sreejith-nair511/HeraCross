"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Video, AlertTriangle, Download, Send, Loader2, Play, Pause, Square } from "lucide-react"
import { apiClient } from "@/lib/api"

export default function CCTVAudit() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [aiSummary, setAiSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setAiSummary("")
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
    setAiSummary("")

    try {
      // Call the actual API
      const result = await apiClient.analyzeWasteImage(selectedFile, question)
      setAiSummary(result.ai_insights)
    } catch (err) {
      console.error("Analysis failed:", err)
      setAiSummary("Failed to analyze the video. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

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
            {!selectedFile ? (
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
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">Drop your video here</p>
                <p className="text-muted-foreground text-sm mb-4">or</p>
                <Button 
                  className="bg-neon-green hover:bg-neon-green/90 text-background"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Video
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  aria-label="File upload input"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={URL.createObjectURL(selectedFile)}
                    className="w-full rounded-lg border border-border"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <Button 
                      size="icon" 
                      className="bg-background/80 backdrop-blur"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neon-green" 
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatTime(duration)}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedFile(null)}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button 
                    className="flex-1 bg-neon-green hover:bg-neon-green/90 text-background"
                    onClick={handleAnalyze}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
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

      {/* AI Analysis */}
      <Card className="bg-card/40 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle>AI Analysis</CardTitle>
          <CardDescription>Ask questions about the video content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about the video..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
              className="bg-input border-border/50"
              disabled={isLoading}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !question.trim()}
              className="bg-neon-green hover:bg-neon-green/90 text-background"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          
          {aiSummary && (
            <div className="p-4 bg-card/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">AI Summary</h4>
              <p className="text-muted-foreground text-sm">{aiSummary}</p>
            </div>
          )}
        </CardContent>
      </Card>

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