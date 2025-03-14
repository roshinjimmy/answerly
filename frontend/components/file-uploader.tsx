import { useState, useRef, useEffect } from "react";
import { Upload, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
}

export function FileUploader({
  onFilesAdded,
  maxFiles = 1,
  maxSize = 5242880, // 5MB default
  accept = "*",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [ocrResults, setOcrResults] = useState<string | null>(null); // ✅ Store OCR result
  const [isLoading, setIsLoading] = useState(false); // ✅ Handle loading state
  const [data, setData] = useState<any[]>([]); // ✅ Store fetched data
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch/");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFiles = (fileList: FileList | null): File[] => {
    if (!fileList) return [];

    const validFiles: File[] = [];
    const newErrors: string[] = [];

    const fileArray = Array.from(fileList);

    if (files.length + fileArray.length > maxFiles) {
      newErrors.push(`You can only upload up to ${maxFiles} files.`);
      return [];
    }

    fileArray.forEach((file) => {
      if (file.size > maxSize) {
        newErrors.push(`${file.name} exceeds the maximum file size of ${maxSize / 1048576}MB.`);
        return;
      }

      validFiles.push(file);
    });

    if (newErrors.length > 0) {
      setErrors((prev) => [...prev, ...newErrors]);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }

    return validFiles;
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const validFiles = validateFiles(e.target.files);
    if (validFiles.length > 0) {
      setFiles(validFiles);
      onFilesAdded(validFiles);
      await uploadFiles(validFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    formData.append("file", files[0]); // Only processing one file at a time

    setIsLoading(true);
    setErrors([]);
    setOcrResults(null); // Reset previous results

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Extract OCR text and store it in state
      setOcrResults(response.data.extracted_text);
      fetchData(); // ✅ Fetch updated data
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrors(["Failed to process the image."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          multiple={false} // ✅ Allow only one file
          accept={accept}
        />

        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Drag & drop a file or click to browse</h3>
          <p className="text-sm text-muted-foreground">
            Maximum file size: {maxSize / 1048576}MB
          </p>
        </div>
      </div>

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

      {/* ✅ Show OCR Results */}
      <AnimatePresence>
        {isLoading && <p className="text-sm text-blue-500">Processing file...</p>}
        {ocrResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 border rounded-md bg-gray-100"
          >
            <h3 className="text-lg font-medium">Extracted Text:</h3>
            <p className="mt-2 text-gray-700">{ocrResults}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Show fetched data */}
      <AnimatePresence>
        {data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 border rounded-md bg-gray-100"
          >
            <h3 className="text-lg font-medium">Stored Data:</h3>
            {data.map((item, index) => (
              <div key={index} className="mt-2">
                <p className="text-gray-700"><strong>ID:</strong> {item.id}</p>
                <p className="text-gray-700"><strong>Text:</strong> {item.text}</p>
                <p className="text-gray-700"><strong>Timestamp:</strong> {item.timestamp}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}