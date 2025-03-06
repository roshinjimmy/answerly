"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: string
}

export function FileUploader({
  onFilesAdded,
  maxFiles = 1,
  maxSize = 5242880, // 5MB default
  accept = "*",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [ocrResults, setOcrResults] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFiles = (fileList: FileList | null): File[] => {
    if (!fileList) return []

    const validFiles: File[] = []
    const newErrors: string[] = []

    // Convert FileList to array for easier processing
    const fileArray = Array.from(fileList)

    // Check if adding these files would exceed maxFiles
    if (files.length + fileArray.length > maxFiles) {
      newErrors.push(`You can only upload a maximum of ${maxFiles} files.`)
      return []
    }

    fileArray.forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        newErrors.push(`${file.name} exceeds the maximum file size of ${maxSize / 1048576}MB.`)
        return
      }

      // Check file type if accept is specified
      if (accept !== "*") {
        const acceptedTypes = accept.split(",")
        const fileType = file.type
        const fileExtension = `.${file.name.split(".").pop()}`

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            // Check by extension
            return fileExtension.toLowerCase() === type.toLowerCase()
          } else {
            // Check by MIME type
            return fileType.match(new RegExp(type.replace("*", ".*")))
          }
        })

        if (!isAccepted) {
          newErrors.push(`${file.name} is not an accepted file type.`)
          return
        }
      }

      validFiles.push(file)
    })

    if (newErrors.length > 0) {
      setErrors((prev) => [...prev, ...newErrors])
      setTimeout(() => {
        setErrors([])
      }, 5000)
    }

    return validFiles
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const validFiles = validateFiles(e.dataTransfer.files)
    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles]
      setFiles(newFiles)
      onFilesAdded(validFiles)
      await uploadFiles(validFiles)
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const validFiles = validateFiles(e.target.files)
    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles]
      setFiles(newFiles)
      onFilesAdded(validFiles)
      await uploadFiles(validFiles)
    }

    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("file", file)
    })

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setOcrResults((prev) => [...prev, response.data])
    } catch (error) {
      console.error("Error uploading files:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          multiple={maxFiles > 1}
          accept={accept}
        />

        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Drag & drop {maxFiles > 1 ? "files" : "a file"} or click to browse</h3>
          <p className="text-sm text-muted-foreground">
            {maxFiles > 1
              ? `Upload up to ${maxFiles} files (max ${maxSize / 1048576}MB each)`
              : `Maximum file size: ${maxSize / 1048576}MB`}
          </p>
          {accept !== "*" && (
            <p className="text-xs text-muted-foreground">Accepted file types: {accept.split(",").join(", ")}</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(index)
                  }}
                  className="rounded-full p-1 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {errors.map((error, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4">
        <h3 className="text-lg font-medium">OCR Results:</h3>
        <ul className="list-disc pl-5">
          {ocrResults.map((result, index) => (
            <li key={index} className="text-sm">
              <strong>{result.filename}:</strong> {result.ocr_results}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}