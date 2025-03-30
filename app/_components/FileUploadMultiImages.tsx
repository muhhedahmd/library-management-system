"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X } from 'lucide-react'
import Image from "next/image"
import React, { useCallback, useRef, useState, useEffect } from "react"

interface FileUploadMultiImagesProps {
  accept?: string // Accepted file types (e.g., "image/*")
  multiple?: boolean // Allow multiple files
  maxSize?: number // Maximum file size in bytes
  value?: File[] // Controlled value (array of files)
  onChange?: (files: File[]) => void // Callback when files change
  onSizeChange?: (size: number) => void // Callback for total size of files
}

const FileUploadMultiImages: React.FC<FileUploadMultiImagesProps> = ({
  accept = "image/*",
  multiple = false,
  maxSize = 5 * 1024 * 1024, // Default max size: 5MB
  value = [],
  onChange,
  onSizeChange,
}) => {
  const [files, setFiles] = useState<File[]>(value)
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate previews when files change
  useEffect(() => {
    // Clean up previous preview URLs to avoid memory leaks
    previews.forEach(url => URL.revokeObjectURL(url))
    
    // Generate new previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
    
    // Clean up when component unmounts
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length === 0) return

    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    const newFiles: File[] = []
    let hasError = false
    let totalSize = 0

    // Process each selected file
    selectedFiles.forEach(file => {
      // Check if file already exists by name
      const isDuplicate = files.some(existingFile => 
        existingFile.name === file.name && 
        existingFile.size === file.size
      )

      if (isDuplicate) {
        return // Skip duplicate files
      }

      // Validate file type
      if (accept && !file.type.match(new RegExp(accept.replace("*", ".*")))) {
        setError(`File type not supported: ${file.type}`)
        hasError = true
        return
      }

      // Validate file size
      if (file.size > maxSize) {
        setError(`File size exceeds limit: ${file.name}`)
        hasError = true
        return
      }

      newFiles.push(file)
      totalSize += file.size
    })

    if (!hasError) {
      setError(null)
    }

    // If multiple is false, replace the existing file
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
    
    setFiles(updatedFiles)
    onChange?.(updatedFiles)
    onSizeChange?.(totalSize)
  }

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index)
      
      setFiles(updatedFiles)
      onChange?.(updatedFiles)

      // Recalculate total size
      const totalSize = updatedFiles.reduce((acc, file) => acc + file.size, 0)
      onSizeChange?.(totalSize)
    },
    [files, onChange, onSizeChange]
  )

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="upload-images" className="text-sm font-medium">
          Upload Images
          {maxSize && (
            <span className="ml-1 text-sm text-muted-foreground">
              (Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB)
            </span>
          )}
        </Label>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleButtonClick}
          className="w-full h-24 border-dashed flex flex-col gap-2"
        >
          <Upload className="h-6 w-6" />
          <span>
            Click to {files.length > 0 ? "add more" : "upload"} 
            {multiple ? " images" : " an image"}
          </span>
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          id="upload-images"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 grid-row-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-md overflow-hidden border bg-muted">
                <Image
                  fill
                  src={previews[index] || "/placeholder.svg?height=120&width=120"}
                  alt={`Preview ${file.name}`}
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => handleRemoveFile(index)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-80 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </Button>
              <p className="text-xs mt-1 truncate text-muted-foreground">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploadMultiImages
