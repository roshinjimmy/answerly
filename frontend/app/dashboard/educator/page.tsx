"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, FileText, Home, LogOut, Plus, Settings, Upload, Users } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileUploader } from "@/components/file-uploader"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function EducatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadedAnswerScripts, setUploadedAnswerScripts] = useState<string[]>([])
  const [uploadedReferenceAnswers, setUploadedReferenceAnswers] = useState<string[]>([])
  const [evaluationResults, setEvaluationResults] = useState<{ similarity_score: number; marks_obtained: number } | null>(null);
  const [uploadedAnswerFiles, setUploadedAnswerFiles] = useState<File[]>([]);
  const [uploadedReferenceFiles, setUploadedReferenceFiles] = useState<File[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"sbert" | "gemini">("sbert"); // Default to SBERT
  const [processedAnswerText, setProcessedAnswerText] = useState<string | null>(null); // Separate state for answer scripts
  const [processedReferenceText, setProcessedReferenceText] = useState<string | null>(null); // Separate state for reference answers
  const [students, setStudents] = useState<{ name: string; class: string; roll_no: string }[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [fileUploaderKey, setFileUploaderKey] = useState(0); // State to force re-render of FileUploader
  const [marksList, setMarksList] = useState<{ name: string; class: string; roll_no: string; marks: number }[]>([]);
  const [showMarksList, setShowMarksList] = useState(false); // State to toggle marks list display
  const [examName, setExamName] = useState<string | null>(null); // State for exam name
  const [isExamSetupComplete, setIsExamSetupComplete] = useState(false); // State to track if initial setup is complete

  const handleExamSetupComplete = () => {
    if (examName && students.length > 0 && processedReferenceText) {
      setIsExamSetupComplete(true);
    } else {
      alert("Please provide the exam name, upload student details, and process the reference answer.");
    }
  };

  const handleAnswerScriptUpload = (files: File[]) => {
    if (files.length === 0) {
      console.warn("No files selected for upload.");
      return;
    }
    const newFiles = files.map((file) => file.name);
    setUploadedAnswerScripts(newFiles); // Reset the uploaded files
    setUploadedAnswerFiles(files); // Reset the uploaded file objects
  };

  const handleReferenceAnswerUpload = (files: File[]) => {
    if (files.length === 0) {
      console.warn("No files selected for upload.");
      return;
    }
    const newFiles = files.map((file) => file.name);
    setUploadedReferenceAnswers(newFiles); // Reset the uploaded files
    setUploadedReferenceFiles(files); // Reset the uploaded file objects
  };

  const handleDeleteAnswerScript = (index: number) => {
    setUploadedAnswerScripts((prev) => prev.filter((_, i) => i !== index));
    setUploadedAnswerFiles((prev) => prev.filter((_, i) => i !== index));
    // Force re-render by resetting the key of the FileUploader
    setFileUploaderKey((prevKey) => prevKey + 1);
  };

  const handleDeleteReferenceAnswer = (index: number) => {
    setUploadedReferenceAnswers((prev) => prev.filter((_, i) => i !== index));
    setUploadedReferenceFiles((prev) => prev.filter((_, i) => i !== index));
    // Force re-render by resetting the key of the FileUploader
    setFileUploaderKey((prevKey) => prevKey + 1);
  };

  const handleProcessAnswerScripts = async () => {
    if (uploadedAnswerFiles.length > 0) {
      console.log("Processing Answer Scripts:", uploadedAnswerFiles);

      try {
        const formData = new FormData();
        formData.append("file", uploadedAnswerFiles[0]); // Process the first file

        console.log("Sending request to process answer script...");
        const response = await axios.post("http://localhost:8000/api/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Response received:", response.data);

        if (response.data && response.data.extracted_text) {
          setProcessedAnswerText(response.data.extracted_text); // Set processed text for answer scripts
          console.log("Processed text set successfully.");
        } else {
          console.warn("No extracted text found in the response.");
          alert("Processing completed, but no text was extracted.");
        }
      } catch (error) {
        console.error("Error processing answer scripts:", error);
        alert("Failed to process the answer scripts. Please check the backend and try again.");
      }
    } else {
      console.warn("No answer scripts to process.");
      alert("Please upload answer scripts before processing.");
    }
  };

  const handleProcessReferenceAnswers = async () => {
    if (uploadedReferenceFiles.length > 0) {
      console.log("Processing Reference Answers:", uploadedReferenceFiles);

      try {
        const formData = new FormData();
        formData.append("file", uploadedReferenceFiles[0]); // Process the first file

        console.log("Sending request to process reference answer...");
        const response = await axios.post("http://localhost:8000/api/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Response received:", response.data);

        if (response.data && response.data.extracted_text) {
          setProcessedReferenceText(response.data.extracted_text); // Set processed text for reference answers
          console.log("Reference answer processed successfully.");
        } else {
          console.warn("No extracted text found in the response.");
          alert("Processing completed, but no text was extracted.");
        }
      } catch (error) {
        console.error("Error processing reference answers:", error);
        alert("Failed to process the reference answers. Please check the backend and try again.");
      }
    } else {
      console.warn("No reference answers to process.");
      alert("Please upload reference answers before processing.");
    }
  };

  const handleEvaluateScripts = async () => {
    if (uploadedAnswerFiles.length === 0) {
      alert("Please upload the answer sheet for the current student before evaluation.");
      return;
    }

    if (!uploadedReferenceFiles.length) {
      alert("Reference answer is missing. Please ensure the reference answer is uploaded and processed.");
      return;
    }

    try {
      setIsEvaluating(true);
      console.log("Evaluating scripts...");

      const formData = new FormData();
      formData.append("reference_file", uploadedReferenceFiles[0]); // Use the same reference key for all students
      formData.append("answer_file", uploadedAnswerFiles[0]); // Use the current student's answer sheet
      formData.append("model", selectedModel);

      console.log("Sending request to evaluate scripts...");
      const response = await axios.post("http://localhost:8000/evaluate/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response received:", response.data);

      if (response.data) {
        const result = {
          similarity_score: response.data.similarity_score,
          marks_obtained: response.data.marks_obtained,
        };
        setEvaluationResults(result); // Ensure evaluation results are set
        console.log("Evaluation results set successfully.");
      } else {
        console.warn("No evaluation results found in the response.");
        alert("Evaluation completed, but no results were returned.");
      }
    } catch (error) {
      console.error("Error evaluating scripts:", error);
      alert("Failed to evaluate the scripts. Please check the backend and try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleExcelUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length > 0) {
        setStudents(jsonData as { name: string; class: string; roll_no: string }[]);
        setCurrentStudentIndex(0); // Start with the first student
      } else {
        alert("The Excel sheet is empty or invalid.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleNextStudent = () => {
    const currentStudentMarks = {
      name: currentStudent.name,
      class: currentStudent.class,
      roll_no: currentStudent.roll_no,
      marks: evaluationResults?.marks_obtained || 0,
    };

    // Add the current student's marks only if not already added
    setMarksList((prev) => {
      const isAlreadyAdded = prev.some((student) => student.roll_no === currentStudent.roll_no);
      return isAlreadyAdded ? prev : [...prev, currentStudentMarks];
    });

    if (currentStudentIndex < students.length - 1) {
      resetUploadAndEvaluationSections();
      setCurrentStudentIndex((prevIndex) => prevIndex + 1);
    } else {
      handleFinishEvaluation(); // Call finish evaluation when the last student is reached
    }
  };

  const handlePreviousStudent = () => {
    if (currentStudentIndex > 0) {
      resetUploadAndEvaluationSections();
      setCurrentStudentIndex((prevIndex) => prevIndex - 1);
    } else {
      alert("No previous students to process.");
    }
  };

  const handleFinishEvaluation = () => {
    const currentStudentMarks = {
      name: currentStudent.name,
      class: currentStudent.class,
      roll_no: currentStudent.roll_no,
      marks: evaluationResults?.marks_obtained || 0,
    };

    // Add the current student's marks only if not already added
    setMarksList((prev) => {
      const isAlreadyAdded = prev.some((student) => student.roll_no === currentStudent.roll_no);
      return isAlreadyAdded ? prev : [...prev, currentStudentMarks];
    });

    resetUploadAndEvaluationSections(); // Reset upload and evaluation sections
    setActiveTab("students"); // Navigate to the "Students" tab
  };

  const handleDownloadMarksList = () => {
    const csvContent = [
      ["Name", "Class", "Roll Number", "Marks"],
      ...marksList.map((student) => [student.name, student.class, student.roll_no, student.marks]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "marks_list.csv"); // Trigger download
  };

  const resetUploadAndEvaluationSections = () => {
    setUploadedAnswerScripts([]);
    setUploadedAnswerFiles([]);
    setProcessedAnswerText(null);
    setEvaluationResults(null);
    setFileUploaderKey((prevKey) => prevKey + 1); // Reset FileUploader by updating its key
    // Retain uploadedReferenceAnswers and uploadedReferenceFiles to use the same reference key for all students
  };

  const currentStudent = students[currentStudentIndex] || { name: "", class: "", roll_no: "" };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold">EduEval AI</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={activeTab === "overview"}>
                      <Link href="#overview" onClick={() => setActiveTab("overview")}>
                        <Home className="h-4 w-4" />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={activeTab === "assignments"}>
                      <Link href="#assignments" onClick={() => setActiveTab("assignments")}>
                        <FileText className="h-4 w-4" />
                        <span>Exam</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={activeTab === "students"}>
                      <Link href="#students" onClick={() => setActiveTab("students")}>
                        <Users className="h-4 w-4" />
                        <span>Students</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={activeTab === "settings"}>
                      <Link href="#settings" onClick={() => setActiveTab("settings")}>
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium">Dr. Jane Doe</p>
                <p className="truncate text-xs text-muted-foreground">jane.doe@university.edu</p>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 ml-75">
          <DashboardHeader>
            <div className="flex items-center">
              <SidebarTrigger className="mr-2" />
              <h1 className="text-xl font-bold">Educator Dashboard</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </Button>
              <ThemeToggle />
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </DashboardHeader>
          <DashboardShell>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value)} // Ensure state updates correctly
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="assignments">Exam</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">145</div>
                        <p className="text-xs text-muted-foreground">+12 from last semester</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Evaluations Pending</CardTitle>
                        <svg
                          className="h-4 w-4 text-muted-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">8 due today</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <svg
                          className="h-4 w-4 text-muted-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">78.3%</div>
                        <p className="text-xs text-muted-foreground">+2.1% from last semester</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>Recent Assignments</CardTitle>
                        <CardDescription>Your most recently created assignments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            "Midterm Exam",
                            "Essay on Modern Literature",
                            "Programming Assignment #3",
                            "Final Project Proposal",
                          ].map((assignment, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{assignment}</span>
                              </div>
                              <Badge variant={i === 0 ? "destructive" : i === 1 ? "warning" : "secondary"}>
                                {i === 0 ? "Due Today" : i === 1 ? "Due Soon" : "Upcoming"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Assignment
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>Evaluation Progress</CardTitle>
                        <CardDescription>Current status of your evaluations</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Midterm Exam</span>
                              <span className="text-sm text-muted-foreground">75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Essay on Modern Literature</span>
                              <span className="text-sm text-muted-foreground">40%</span>
                            </div>
                            <Progress value={40} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Programming Assignment #3</span>
                              <span className="text-sm text-muted-foreground">90%</span>
                            </div>
                            <Progress value={90} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Final Project Proposal</span>
                              <span className="text-sm text-muted-foreground">10%</span>
                            </div>
                            <Progress value={10} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Evaluations
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="space-y-4">
                {!isExamSetupComplete ? (
                  <Card className="space-y-4">
                    <CardHeader>
                      <CardTitle>Exam Setup</CardTitle>
                      <CardDescription>Provide the exam name, upload student details, and reference answer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Exam Name</label>
                        <Input
                          type="text"
                          placeholder="Enter exam name"
                          value={examName || ""}
                          onChange={(e) => setExamName(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Upload Student Details</label>
                        <Input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleExcelUpload(e.target.files[0]);
                            }
                          }}
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Upload an Excel file containing student details (columns: Name, Class, Roll Number).
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Upload Reference Answer</label>
                        <div className={`relative ${uploadedReferenceAnswers.length > 0 ? "opacity-50 pointer-events-none" : ""}`}>
                          <FileUploader
                            key={fileUploaderKey} // Add a key to force re-render
                            onFilesAdded={(files) => handleReferenceAnswerUpload(files)}
                            maxFiles={1} // Ensure this is respected
                            maxSize={10485760} // 10MB
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </div>
                        {uploadedReferenceAnswers.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 text-sm font-medium">Uploaded File:</h4>
                            <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                              {uploadedReferenceAnswers.map((file, index) => (
                                <div key={index} className="flex items-center justify-between py-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{file}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button className="w-full" onClick={handleProcessReferenceAnswers}>
                        <Upload className="mr-2 h-4 w-4" />
                        Process Reference Answer
                      </Button>
                      {processedReferenceText && (
                        <div className="mt-4 p-4 border rounded-md bg-black text-white">
                          <h3 className="text-lg font-medium">Processed Reference Answer:</h3>
                          <p className="mt-2">{processedReferenceText}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={handleExamSetupComplete}>
                        Proceed to Answer Sheet Upload
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="space-y-4">
                    <CardHeader>
                      <CardTitle>Answer Sheet Upload and Evaluation</CardTitle>
                      <CardDescription>Upload answer sheets for each student and evaluate them.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Current Student:</p>
                          <div className="p-4 border rounded-md bg-black text-white">
                            <p className="text-sm">
                              <strong>Name:</strong> {currentStudent.name || "N/A"}
                            </p>
                            <p className="text-sm">
                              <strong>Class:</strong> {currentStudent.class || "N/A"}
                            </p>
                            <p className="text-sm">
                              <strong>Roll Number:</strong> {currentStudent.roll_no || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className={`relative ${uploadedAnswerScripts.length > 0 ? "opacity-50 pointer-events-none" : ""}`}>
                          <FileUploader
                            key={fileUploaderKey} // Add a key to force re-render
                            onFilesAdded={(files) => handleAnswerScriptUpload(files)}
                            maxFiles={1} // Ensure this is respected
                            maxSize={10485760} // 10MB
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </div>
                        {uploadedAnswerScripts.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 text-sm font-medium">Uploaded File:</h4>
                            <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                              {uploadedAnswerScripts.map((file, index) => (
                                <div key={index} className="flex items-center justify-between py-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{file}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteAnswerScript(index)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                       
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-col space-y-4 w-full">
                        <Button className="w-full" onClick={handleProcessAnswerScripts}>
                          <Upload className="mr-2 h-4 w-4" />
                          Process Answer Sheet
                        </Button>

                        {processedAnswerText && (
                          <div className="mt-4 p-4 border rounded-md bg-black text-white">
                            <h3 className="text-lg font-medium">Processed Answer Text:</h3>
                            <p className="mt-2">{processedAnswerText}</p>
                          </div>
                        )}

                        {evaluationResults && (
                          <div className="mt-4 p-4 border rounded-md bg-black text-white">
                            <h3 className="text-lg font-medium">Evaluation Results:</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Similarity Score:</p>
                                <p className="text-base font-semibold text-green-400">{evaluationResults.similarity_score}%</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Marks Obtained:</p>
                                <p className="text-base font-semibold text-blue-400">{evaluationResults.marks_obtained}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          onClick={handleEvaluateScripts}
                          disabled={uploadedAnswerScripts.length === 0}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Evaluate Answer Sheet
                        </Button>

                        <div className="flex justify-between w-full mt-4">
                          <Button onClick={handlePreviousStudent} disabled={currentStudentIndex === 0}>
                            Previous Student
                          </Button>
                          <Button
                            onClick={currentStudentIndex >= students.length - 1 ? handleFinishEvaluation : handleNextStudent}
                          >
                            {currentStudentIndex >= students.length - 1 ? "Finish" : "Next Student"}
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Student Management</CardTitle>
                        <CardDescription>View and manage your students</CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 gap-4 p-4 font-medium">
                        <div>Name</div>
                        <div>ID</div>
                        <div>Email</div>
                        <div>Performance</div>
                        <div>Actions</div>
                      </div>
                      <div className="divide-y">
                        {[
                          {
                            name: "Alex Johnson",
                            id: "S12345",
                            email: "alex.j@university.edu",
                            performance: "Excellent",
                          },
                          { name: "Maria Garcia", id: "S12346", email: "maria.g@university.edu", performance: "Good" },
                          {
                            name: "James Wilson",
                            id: "S12347",
                            email: "james.w@university.edu",
                            performance: "Average",
                          },
                          { name: "Sarah Lee", id: "S12348", email: "sarah.l@university.edu", performance: "Good" },
                          {
                            name: "David Kim",
                            id: "S12349",
                            email: "david.k@university.edu",
                            performance: "Needs Improvement",
                          },
                        ].map((student, i) => (
                          <div key={i} className="grid grid-cols-5 gap-4 p-4">
                            <div className="font-medium">{student.name}</div>
                            <div>{student.id}</div>
                            <div>{student.email}</div>
                            <div>
                              <Badge
                                variant={
                                  student.performance === "Excellent"
                                    ? "success"
                                    : student.performance === "Good"
                                      ? "default"
                                      : student.performance === "Average"
                                        ? "secondary"
                                        : "destructive"
                                }
                              >
                                {student.performance}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                Message
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between">
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                      <div className="text-sm text-muted-foreground">Page 1 of 3</div>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Students Marks List</CardTitle>
                    <CardDescription>
                      {examName ? `Marks for Exam: ${examName}` : "View the marks obtained by students"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Class</th>
                            <th className="border border-gray-300 px-4 py-2">Roll Number</th>
                            <th className="border border-gray-300 px-4 py-2">Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marksList.map((student, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                              <td className="border border-gray-300 px-4 py-2">{student.class}</td>
                              <td className="border border-gray-300 px-4 py-2">{student.roll_no}</td>
                              <td className="border border-gray-300 px-4 py-2">{student.marks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleDownloadMarksList}>
                      Download Marks List
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Evaluation Settings</CardTitle>
                    <CardDescription>Configure how the AI evaluates student answers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Evaluation Strictness</label>
                        <div className="flex items-center space-x-2">
                          <input type="range" min="1" max="5" defaultValue="3" className="w-full" />
                          <span className="text-sm text-muted-foreground">Medium</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Adjust how strictly the AI evaluates answers against reference materials
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Feedback Detail Level</label>
                        <select className="w-full rounded-md border p-2">
                          <option>Detailed (Paragraph-level feedback)</option>
                          <option>Standard (Section-level feedback)</option>
                          <option>Basic (Overall feedback only)</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                          Choose how detailed the feedback should be for students
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Automatic Grading</label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="auto-grading" defaultChecked />
                          <label htmlFor="auto-grading" className="text-sm">
                            Enable automatic grading
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Allow the AI to assign grades based on evaluation
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Plagiarism Detection</label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="plagiarism" defaultChecked />
                          <label htmlFor="plagiarism" className="text-sm">
                            Enable plagiarism detection
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Check student submissions against a database of existing content
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Save Settings</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Configure how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email-notifications" defaultChecked />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Submission Alerts</p>
                          <p className="text-sm text-muted-foreground">Get notified when students submit answers</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="submission-alerts" defaultChecked />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Reevaluation Requests</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when students request reevaluation
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="reevaluation-requests" defaultChecked />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weekly Summary</p>
                          <p className="text-sm text-muted-foreground">Receive a weekly summary of activities</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="weekly-summary" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </DashboardShell>
        </div>
      </div>
    </SidebarProvider>
  )
}
