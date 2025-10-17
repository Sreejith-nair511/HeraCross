"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Trash2 } from "lucide-react"

export default function WasteClassifier() {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Waste Classifier</h1>
        <p className="text-muted-foreground mt-1">Upload images to classify waste types</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Drag and drop or click to upload</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? "border-neon-green bg-neon-green/5" : "border-border"
              }`}
            >
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">Drop your image here</p>
              <p className="text-muted-foreground text-sm mb-4">or</p>
              <Button className="bg-neon-green hover:bg-neon-green/90 text-background">
                <Upload className="w-4 h-4 mr-2" />
                Select File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle>Classification Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Trash2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Upload an image to see results</p>
            </div>
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
