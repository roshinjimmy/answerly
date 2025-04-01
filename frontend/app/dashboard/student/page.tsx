"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, FileText, Home, LogOut, RefreshCw, Settings, Upload, User } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import axios from "axios"

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

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadedAnswerSheets, setUploadedAnswerSheets] = useState<string[]>([])
  const [showExtractedText, setShowExtractedText] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [isEditingText, setIsEditingText] = useState(false)
  const [evaluationResults, setEvaluationResults] = useState<{ similarity_score: number; marks_obtained: number } | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null)
  const [updatedUser, setUpdatedUser] = useState<{ name: string; email: string }>({ name: "", email: "" })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setUpdatedUser({ name: parsedUser.name, email: parsedUser.email })
    }
  }, [])

  const referenceAnswer = `The Importance of Geography in Understanding the World
Geography is the study of the Earth's physical features, climate, and human interactions with the environment. It helps us understand how natural processes like weather, landforms, and ecosystems shape our planet. Additionally, geography explains how people adapt to different environments, from deserts to rainforests. By studying geography, we can make informed decisions about urban planning, disaster management, and environmental conservation. It also fosters global awareness by showing the connections between different regions and cultures. Overall, geography is essential for understanding the world and solving real-world challenges.`

  const handleAnswerSheetUpload = async (files: File[]) => {
    const newFiles = files.map((file) => file.name)
    setUploadedAnswerSheets((prev) => [...prev, ...newFiles])

    if (files.length > 0) {
      try {
        const formData = new FormData()
        formData.append('file', files[0])

        setShowExtractedText(false)
        setExtractedText("Processing your document...")
        setShowExtractedText(true)

        const response = await axios.post('http://localhost:8000/api/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        });

        setExtractedText(response.data.extracted_text || "No text could be extracted from the document.")
        setShowExtractedText(true)
      } catch (error) {
        console.error('Error uploading file:', error)
        let errorMessage = "Error extracting text. Please try again."

        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            errorMessage = "The request timed out. The document might be too large or complex. Please try again with a simpler document."
          } else if (error.response) {
            if (error.response.data && typeof error.response.data === 'object' && error.response.data.detail) {
              if (error.response.data.detail.includes('session_timed_out') || error.response.data.detail.includes('GOAWAY')) {
                errorMessage = "The server session timed out. Please try again with a smaller document or try later when the server is less busy."
              } else {
                errorMessage = `Error (${error.response.status}): ${error.response.data.detail}`
              }
            } else {
              errorMessage = `Error (${error.response.status}): ${error.message}`
            }
          }
        }

        setExtractedText(errorMessage)
        setShowExtractedText(true)
      }
    }
  }

  const handleSubmitForEvaluation = async () => {
    if (!extractedText) {
      alert("Please upload and process an answer sheet first.")
      return
    }

    setIsEvaluating(true)

    try {
      setTimeout(() => {
        const similarity = calculateSimilarity(extractedText, referenceAnswer)
        const marks = Math.round(similarity * 100)

        setEvaluationResults({
          similarity_score: similarity,
          marks_obtained: marks
        })

        setShowResults(true)
        setIsEvaluating(false)
      }, 1500)
    } catch (error) {
      console.error("Evaluation failed:", error)
      setIsEvaluating(false)
      alert("Evaluation failed. Please try again.")
    }
  }

  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.toLowerCase().split(/\s+/)
    const words2 = text2.toLowerCase().split(/\s+/)

    const commonWords = words1.filter(word => words2.includes(word))
    const similarity = commonWords.length / Math.max(words1.length, words2.length)

    return Math.min(Math.max(similarity, 0), 1)
  }

  const requestRevaluation = () => {
    alert("Reevaluation request submitted successfully!")
  }

  const handleSignOut = () => {
    localStorage.removeItem("user") // Clear user data from localStorage
    router.push("/") // Redirect to login page
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUpdatedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async () => {
    if (!user) return
    setIsUpdating(true)

    try {
      const response = await axios.put(`http://localhost:8000/api/users/${user.id}`, {
        name: updatedUser.name,
        email: updatedUser.email,
      })

      if (response.data.success) {
        const updatedUserData = { ...user, ...updatedUser }
        setUser(updatedUserData)
        localStorage.setItem("user", JSON.stringify(updatedUserData))
        alert("Profile updated successfully!")
      } else {
        alert("Failed to update profile. Please try again.")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("An error occurred while updating your profile.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="z-10">
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
                    <SidebarMenuButton asChild isActive={activeTab === "submissions"}>
                      <Link href="#submissions" onClick={() => setActiveTab("submissions")}>
                        <FileText className="h-4 w-4" />
                        <span>Submissions</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={activeTab === "results"}>
                      <Link href="#results" onClick={() => setActiveTab("results")}>
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <span>Results</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={activeTab === "profile"}>
                      <Link href="#profile" onClick={() => setActiveTab("profile")}>
                        <User className="h-4 w-4" />
                        <span>Profile</span>
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
                <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium">{user?.name || "Guest"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email || "No email available"}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 ml-75">
          <DashboardHeader>
            <div className="flex items-center">
              <SidebarTrigger className="mr-2" />
              <h1 className="text-xl font-bold">Student Dashboard</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </Button>
              <ThemeToggle />
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
            </div>
          </DashboardHeader>
          <DashboardShell>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
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
                        <p className="text-xs text-muted-foreground">4 pending submissions</p>
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
                        <div className="text-2xl font-bold">82.5%</div>
                        <p className="text-xs text-muted-foreground">+5.2% from last semester</p>
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
                        <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8/12</div>
                        <p className="text-xs text-muted-foreground">4 pending submissions</p>
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
                        <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
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
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">1 new feedback</p>
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
                        <CardTitle>Upcoming Assignments</CardTitle>
                        <CardDescription>Assignments due in the next 7 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { name: "Essay on Modern Literature", date: "Mar 20, 2025", status: "Not Started" },
                            { name: "Programming Assignment #3", date: "Mar 25, 2025", status: "In Progress" },
                            { name: "Final Project Proposal", date: "Apr 5, 2025", status: "Not Started" },
                          ].map((assignment, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{assignment.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{assignment.date}</span>
                                <Badge
                                  variant={
                                    assignment.status === "Completed"
                                      ? "success"
                                      : assignment.status === "In Progress"
                                        ? "warning"
                                        : "secondary"
                                  }
                                >
                                  {assignment.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Assignments
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
                        <CardTitle>Recent Results</CardTitle>
                        <CardDescription>Your most recent evaluation results</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { name: "Midterm Exam", score: "85/100", feedback: "Good understanding of core concepts" },
                            { name: "Research Paper", score: "92/100", feedback: "Excellent analysis and research" },
                            {
                              name: "Programming Quiz",
                              score: "78/100",
                              feedback: "Need improvement in algorithm complexity",
                            },
                          ].map((result, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{result.name}</span>
                                <span className="font-bold">{result.score}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{result.feedback}</p>
                              <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${Number.parseInt(result.score.split("/")[0])}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Results
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Answer Sheet</CardTitle>
                    <CardDescription>Upload your answer sheet for AI evaluation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">


                      <FileUploader
                        onFilesAdded={handleAnswerSheetUpload}
                        maxFiles={1}
                        maxSize={10485760}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />

                      {uploadedAnswerSheets.length > 0 && (
                        <div className="mt-4">
                          <h4 className="mb-2 text-sm font-medium">Uploaded Files:</h4>
                          <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                            {uploadedAnswerSheets.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 py-1">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleSubmitForEvaluation}
                      disabled={!showExtractedText || isEvaluating}
                    >
                      {isEvaluating ? (
                        <>
                          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit for Evaluation
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                {showExtractedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Extracted Text</CardTitle>
                        <CardDescription>Text extracted from your uploaded answer sheet</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-60 overflow-y-auto rounded-md border bg-muted p-4">
                          <p className="whitespace-pre-line">{extractedText}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                
                {showResults && evaluationResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Evaluation Results</CardTitle>
                        <CardDescription>AI-powered evaluation of your answer</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Avatar" />
                                <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{user?.name || "Guest"}</h3>
                                <p className="text-sm text-muted-foreground">Geography Assignment</p>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center gap-2">
                              <Badge variant={evaluationResults.marks_obtained >= 75 ? "success" : "warning"}>
                                {evaluationResults.marks_obtained}% Score
                              </Badge>
                              <span className="text-sm text-muted-foreground">Evaluated {new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="rounded-md border bg-muted p-4">
                            <div className="mb-4">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-sm">Similarity to Reference Answer</span>
                                <span className="text-sm font-medium">{(evaluationResults.similarity_score * 100).toFixed(2)}%</span>
                              </div>
                              <Progress value={evaluationResults.similarity_score * 100} className="h-2" />
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Feedback:</h4>
                              <p className="text-sm">
                                {evaluationResults.marks_obtained >= 90
                                  ? "Excellent work! Your answer closely matches the reference answer and demonstrates a thorough understanding of the topic."
                                  : evaluationResults.marks_obtained >= 75
                                  ? "Good job! Your answer covers most of the key points from the reference answer."
                                  : evaluationResults.marks_obtained >= 60
                                  ? "Satisfactory. Your answer includes some important points but could be more comprehensive."
                                  : "Your answer needs improvement. Consider reviewing the topic and providing more detailed information."}
                              </p>
                            </div>
                          </div>
                          
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Reference Answer:</h4>
                            <div className="max-h-40 overflow-y-auto rounded-md border p-3 text-sm">
                              <p className="whitespace-pre-line">{referenceAnswer}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowResults(false)}>
                          Hide Results
                        </Button>
                        <Button variant="outline" onClick={requestRevaluation}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Request Reevaluation
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
                

                 
                <Card>
                  <CardHeader>
                    <CardTitle>Submission History</CardTitle>
                    <CardDescription>Your previous submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                        <div>Assignment</div>
                        <div>Submission Date</div>
                        <div>Status</div>
                        <div>Actions</div>
                      </div>
                      <div className="divide-y">
                        {[
                          { name: "Midterm Exam", date: "Mar 15, 2025", status: "Evaluated" },
                          { name: "Research Paper", date: "Feb 28, 2025", status: "Evaluated" },
                          { name: "Programming Quiz", date: "Feb 15, 2025", status: "Evaluated" },
                        ].map((submission, i) => (
                          <div key={i} className="grid grid-cols-4 gap-4 p-4">
                            <div className="font-medium">{submission.name}</div>
                            <div>{submission.date}</div>
                            <div>
                              <Badge
                                variant={
                                  submission.status === "Evaluated"
                                    ? "success"
                                    : submission.status === "Pending"
                                      ? "warning"
                                      : "secondary"
                                }
                              >
                                {submission.status}
                              </Badge>
                            </div>
                            <div>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Results</CardTitle>
                    <CardDescription>View your evaluation results and feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 gap-4 p-4 font-medium">
                        <div>Assignment</div>
                        <div>Score</div>
                        <div>Feedback</div>
                        <div>Evaluated On</div>
                        <div>Actions</div>
                      </div>
                      <div className="divide-y">
                        {[
                          {
                            name: "Midterm Exam",
                            score: "85/100",
                            feedback: "Good understanding of core concepts, but could improve on application examples.",
                            date: "Mar 16, 2025",
                          },
                          {
                            name: "Research Paper",
                            score: "92/100",
                            feedback:
                              "Excellent analysis and research. Well-structured arguments with strong evidence.",
                            date: "Mar 1, 2025",
                          },
                          {
                            name: "Programming Quiz",
                            score: "78/100",
                            feedback: "Need improvement in algorithm complexity analysis and optimization techniques.",
                            date: "Feb 16, 2025",
                          },
                        ].map((result, i) => (
                          <div key={i} className="grid grid-cols-5 gap-4 p-4">
                            <div className="font-medium">{result.name}</div>
                            <div>{result.score}</div>
                            <div className="truncate text-sm text-muted-foreground">{result.feedback}</div>
                            <div>{result.date}</div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm" onClick={requestRevaluation}>
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Reevaluate
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>Track your performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Overall Performance</h4>
                          <span className="text-sm font-medium">82.5%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div className="h-full bg-primary" style={{ width: "82.5%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Performance by Subject</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Literature</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Programming</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Research Methods</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Critical Thinking</span>
                            <span className="text-sm font-medium">88%</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Improvement Areas</h4>
                        <div className="space-y-2">
                          <div className="rounded-md border p-3">
                            <div className="font-medium">Algorithm Complexity</div>
                            <p className="text-sm text-muted-foreground">
                              Focus on understanding time and space complexity analysis.
                            </p>
                          </div>
                          <div className="rounded-md border p-3">
                            <div className="font-medium">Practical Examples</div>
                            <p className="text-sm text-muted-foreground">
                              Include more real-world examples in your answers.
                            </p>
                          </div>
                          <div className="rounded-md border p-3">
                            <div className="font-medium">Citation Format</div>
                            <p className="text-sm text-muted-foreground">
                              Ensure proper citation format in research papers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Download Performance Report
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reevaluation Requests</CardTitle>
                    <CardDescription>Track your reevaluation requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                        <div>Assignment</div>
                        <div>Request Date</div>
                        <div>Status</div>
                        <div>Result</div>
                      </div>
                      <div className="divide-y">
                        {[
                          {
                            name: "Programming Quiz",
                            date: "Feb 18, 2025",
                            status: "Completed",
                            result: "Score increased by 5%",
                          },
                          {
                            name: "Research Methods Quiz",
                            date: "Jan 25, 2025",
                            status: "Completed",
                            result: "No change",
                          },
                        ].map((request, i) => (
                          <div key={i} className="grid grid-cols-4 gap-4 p-4">
                            <div className="font-medium">{request.name}</div>
                            <div>{request.date}</div>
                            <div>
                              <Badge
                                variant={
                                  request.status === "Completed"
                                    ? "success"
                                    : request.status === "Pending"
                                      ? "warning"
                                      : "secondary"
                                }
                              >
                                {request.status}
                              </Badge>
                            </div>
                            <div className="text-sm">{request.result}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Profile</CardTitle>
                    <CardDescription>View and update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
                          <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 text-center sm:text-left">
                          <h3 className="text-xl font-bold">{user?.name || "Guest"}</h3>
                          <p className="text-sm text-muted-foreground">Student ID: S12345</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge>Computer Science</Badge>
                            <Badge variant="outline">Year 3</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              className="w-full rounded-md border p-2"
                              value={updatedUser.name}
                              onChange={handleProfileChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                              type="email"
                              name="email"
                              className="w-full rounded-md border p-2"
                              value={updatedUser.email}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Major</label>
                            <input
                              type="text"
                              className="w-full rounded-md border p-2"
                              defaultValue="Computer Science"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Year</label>
                            <select className="w-full rounded-md border p-2">
                              <option>Year 1</option>
                              <option>Year 2</option>
                              <option >Year 3</option>
                              <option>Year 4</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bio</label>
                          <textarea
                            className="h-24 w-full rounded-md border p-2"
                            defaultValue="Computer Science student with interests in AI, machine learning, and software development."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handleProfileUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Save Profile"}
                    </Button>
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
                          <p className="font-medium">New Assignment Alerts</p>
                          <p className="text-sm text-muted-foreground">Get notified when new assignments are posted</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="assignment-alerts" defaultChecked />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Evaluation Results</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when your submissions are evaluated
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="evaluation-results" defaultChecked />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Reevaluation Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified about reevaluation request status
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="reevaluation-updates" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Save Preferences</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input
                          type="password"
                          className="w-full rounded-md border p-2"
                          placeholder="Enter current password"
                        />
                      </div>

                      <div className="">
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input
                          type="password"
                          className="w-full rounded-md border p-2"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full rounded-md border p-2"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="two-factor" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Update Security Settings</Button>
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
