"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ThemeToggle } from "@/components/theme-toggle"

function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    class: "", // Added field
    rollNo: "", // Added field
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    class: "", // Added field
    rollNo: "", // Added field
  })
  const [serverError, setServerError] = useState("")

  // Validation logic remains the same
  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      class: "", // Added field
      rollNo: "", // Added field
    }

    if (!formData.name) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    if (formData.role === "student") {
      if (!formData.class) {
        newErrors.class = "Class is required"
        isValid = false
      }
      if (!formData.rollNo) {
        newErrors.rollNo = "Roll Number is required"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Replace the timeout with actual API call to your backend
      const response = await axios.post('http://localhost:8000/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        class: formData.class, // Added field
        rollNo: formData.rollNo, // Added field
      });

      if (response.data.success) {
        // Redirect to login page after successful registration
        router.push("/login");
      } else {
        setServerError(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setServerError(error.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // UI remains mostly the same
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        {/* Header content remains the same */}
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">EduEval AI</h1>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
              {serverError && (
                <div className="mb-4 p-3 text-sm text-white bg-destructive rounded">
                  {serverError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields remain the same */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Other form fields remain the same */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={handleRoleChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="cursor-pointer">
                        Student
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="educator" id="educator" />
                      <Label htmlFor="educator" className="cursor-pointer">
                        Educator
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.role === "student" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Input
                        id="class"
                        name="class"
                        placeholder="Enter your class"
                        className={`pl-10 ${errors.class ? "border-destructive" : ""}`}
                        value={formData.class}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.class && <p className="text-sm text-destructive">{errors.class}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNo">Roll Number</Label>
                      <Input
                        id="rollNo"
                        name="rollNo"
                        placeholder="Enter your roll number"
                        className={`pl-10 ${errors.rollNo ? "border-destructive" : ""}`}
                        value={formData.rollNo}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.rollNo && <p className="text-sm text-destructive">{errors.rollNo}</p>}
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <div className="text-center w-full text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default RegisterPage;