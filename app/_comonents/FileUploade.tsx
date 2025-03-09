"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileText, Image, Upload, X, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { formatFileSize } from "@/lib/utils"

interface FileUploadProps {
  accept: string
  maxSize: number // in bytes
  value: string
  onChange: (url: string) => void
  onSizeChange?: (size: number) => void
  onPagesChange?: (pages: number) => void
  disabled?: boolean
  isPdf?: boolean
}

export function FileUpload({
  accept,
  maxSize,
  value,
  onChange,
  onSizeChange,
  onPagesChange,
  disabled,
  isPdf = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const [fileDetails, setFileDetails] = useState<{
    name: string
    size: number
    pages?: number
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${formatFileSize(maxSize)}.`)
      return
    }

    // Validate file type
    if (!file.type.match(accept.replace(/,/g, "|").replace(/\*/g, ".*"))) {
      setError(`Invalid file type. Accepted types: ${accept}`)
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // In a real app, you would upload the file to a server or cloud storage
      // For this example, we'll create a local URL and simulate an upload
      const fileUrl = URL.createObjectURL(file)

      // Set preview
      setPreview(fileUrl)

      // Set file details
      const details = {
        name: file.name,
        size: file.size,
      }

      // If it's a PDF, try to get page count
      if (isPdf && file.type === "application/pdf") {
        try {
          // In a real app, you would use a PDF library to get page count
          // For this example, we'll simulate it with a random number
          const pageCount = Math.floor(Math.random() * 500) + 50

          if (onPagesChange) {
            onPagesChange(pageCount)
          }

          setFileDetails({
            ...details,
            pages: pageCount,
          })
        } catch (err) {
          console.error("Error getting PDF page count:", err)
          setFileDetails(details)
        }
      } else {
        setFileDetails(details)
      }

      // Update form value
      onChange(fileUrl)

      // Update file size if callback provided
      if (onSizeChange) {
        onSizeChange(file.size)
      }

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (err) {
      console.error("Error uploading file:", err)
      setError("Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setFileDetails(null)
    onChange("")
    if (onSizeChange) {
      onSizeChange(0)
    }
    if (onPagesChange) {
      onPagesChange(0)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 text-center">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading file...</p>
            </div>
          ) : (
            <>
              {isPdf ? (
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              ) : (
                <Image className="h-10 w-10 text-muted-foreground mb-2" />
              )}
              <p className="text-sm font-medium mb-1">{isPdf ? "Upload PDF file" : "Upload thumbnail image"}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {isPdf
                  ? "PDF file (max. " + formatFileSize(maxSize) + ")"
                  : "JPG, PNG or GIF (max. " + formatFileSize(maxSize) + ")"}
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled || isUploading}
                id={isPdf ? "pdf-upload" : "image-upload"}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
            </>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {isPdf ? (
                  <div className="h-16 w-16 flex items-center justify-center bg-primary/10 rounded">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded overflow-hidden bg-muted">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {fileDetails?.name || (isPdf ? "PDF Document" : "Image")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fileDetails?.size ? formatFileSize(fileDetails.size) : ""}
                    {fileDetails?.pages ? ` • ${fileDetails.pages} pages` : ""}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {isPdf && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh]">
                      <iframe src={preview} className="w-full h-full" title="PDF Preview" />
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="outline" size="icon" onClick={handleRemove} disabled={disabled}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  )
}

