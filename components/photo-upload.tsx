"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Crop } from "lucide-react"

interface PhotoUploadProps {
  onPhotoSelect: (photoUrl: string) => void
  currentPhoto?: string
}

export function PhotoUpload({ onPhotoSelect, currentPhoto }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(currentPhoto || "")
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        setIsEditing(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropAndSave = () => {
    if (!previewUrl) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Set canvas size to square
      const size = 200
      canvas.width = size
      canvas.height = size

      // Calculate crop dimensions to make it square
      const minDimension = Math.min(img.width, img.height)
      const startX = (img.width - minDimension) / 2
      const startY = (img.height - minDimension) / 2

      // Draw cropped image
      ctx.drawImage(img, startX, startY, minDimension, minDimension, 0, 0, size, size)

      // Convert to data URL
      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.8)
      setPreviewUrl(croppedDataUrl)
      onPhotoSelect(croppedDataUrl)
      setIsEditing(false)
    }
    img.src = previewUrl
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Upload Photo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        <div className="flex flex-col items-center space-y-4">
          {previewUrl ? (
            <div className="space-y-3">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Profile preview" />
                <AvatarFallback>Preview</AvatarFallback>
              </Avatar>

              {isEditing && (
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleCropAndSave}>
                    <Crop className="w-4 h-4 mr-1" />
                    Crop & Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}

              {!isEditing && (
                <div className="flex space-x-2">
                  <Button size="sm" onClick={triggerFileInput}>
                    Change Photo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPreviewUrl("")
                      setSelectedFile(null)
                      onPhotoSelect("")
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-24 h-24 border-2 border-dashed border-muted-foreground rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <Button onClick={triggerFileInput}>Select Photo</Button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Supported formats: JPG, PNG, GIF</p>
          <p>• Maximum file size: 5MB</p>
          <p>• Images will be automatically cropped to square</p>
        </div>
      </CardContent>
    </Card>
  )
}
