"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, FileText, Home, LogOut, Plus, Settings, Upload, Users } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import axios from "axios"; // Import axios for API calls

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

export default function EducatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadedAnswerScripts, setUploadedAnswerScripts] = useState<string[]>([])
  const [uploadedReferenceAnswers, setUploadedReferenceAnswers] = useState<string[]>([])
  const [evaluationResults, setEvaluationResults] = useState<string | null>(null);

  const handleAnswerScriptUpload = (files: File[]) => {
    const newFiles = files.map((file) => file.name)
    setUploadedAnswerScripts((prev) => [...prev, ...newFiles])
  }

  const handleReferenceAnswerUpload = (files: File[]) => {
    const newFiles = files.map((file) => file.name)
    setUploadedReferenceAnswers((prev) => [...prev, ...newFiles])
  }

  const handleEvaluateScripts = async () => {
    try {
      const response = await axios.post("/api/evaluate", {
        answerScripts: uploadedAnswerScripts,
        referenceAnswers: uploadedReferenceAnswers,
      });
      setEvaluationResults(JSON.stringify(response.data.results, null, 2));
    } catch (error) {
      console.error("Error evaluating scripts:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setEvaluationResults("API endpoint not found. Please contact support.");
        } else if (error.response?.status === 400) {
          setEvaluationResults("Invalid data sent to the server. Please check your inputs.");
        } else {
          setEvaluationResults("Failed to evaluate scripts. Please try again.");
        }
      } else {
        setEvaluationResults("An unexpected error occurred. Please try again.");
      }
    }
  };

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
                <div className="grid gap-4 md:grid-cols-2 space-y-4">
                  <Card className="space-y-4">
                    <CardHeader className="space-y-4" >
                      <CardTitle>Upload Answer Scripts</CardTitle>
                      <CardDescription className="space-y-4">Upload student answer scripts for evaluation</CardDescription>
                      <div className="space-y-4">
                        <Input type="text" placeholder="Student Name" className="w-full" />
                        <Input type="text" placeholder="Class" className="w-full" />
                        <Input type="text" placeholder="Roll Number" className="w-full" />
                      </div>
                    </CardHeader>
                    <CardContent>
                     
                      <FileUploader
                        onFilesAdded={handleAnswerScriptUpload}
                        maxFiles={10}
                        maxSize={10485760} // 10MB
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />

                      {uploadedAnswerScripts.length > 0 && (
                        <div className="mt-4">
                          <h4 className="mb-2 text-sm font-medium">Uploaded Files:</h4>
                          <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                            {uploadedAnswerScripts.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 py-1">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Process Answer Scripts
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Reference Answers</CardTitle>
                      <CardDescription>Upload reference answers for AI evaluation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUploader
                        onFilesAdded={handleReferenceAnswerUpload}
                        maxFiles={10}
                        maxSize={10485760} // 10MB
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.jpg"
                      />

                      {uploadedReferenceAnswers.length > 0 && (
                        <div className="mt-4">
                          <h4 className="mb-2 text-sm font-medium">Uploaded Files:</h4>
                          <div className="max-h-40 overflow-y-auto rounded-md border p-2">
                            {uploadedReferenceAnswers.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 py-1">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Process Reference Answers
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluate Answer Scripts</CardTitle>
                    <CardDescription>
                      Perform semantic analysis and calculate scores.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={handleEvaluateScripts}
                      disabled={
                        uploadedAnswerScripts.length === 0 ||
                        uploadedReferenceAnswers.length === 0
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Evaluate Scripts
                    </Button>
                    {evaluationResults && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium">Evaluation Results:</h4>
                        <div className="mt-2 rounded-md border p-2">
                          <pre className="text-sm">{evaluationResults}</pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
