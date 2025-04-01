import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { BookOpen, FileText, CheckCircle, Award, HelpCircle, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Help() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b w-full mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 sm:px-8 mx-auto">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
            <BookOpen className="h-6 w-6" />
            <span>EduEval AI</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <nav className="flex gap-4">
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium hover:text-primary transition-colors">
                Register
              </Link>
              <Link href="/help" className="text-sm font-medium hover:text-primary transition-colors">
                Help
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-10 px-4 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">About EduEval AI</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionizing academic assessment with AI-powered semantic evaluation
            </p>
          </div>

          <Tabs defaultValue="overview" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg">
                  EduEval AI is an advanced platform designed to streamline the evaluation process in education.
                  It leverages artificial intelligence to provide accurate, unbiased, and instant feedback on
                  submitted answers, making grading more efficient and fair.
                </p>
                
                <p>
                  Our platform uses state-of-the-art Sentence-BERT (SBERT) technology to understand the semantic meaning
                  of text, allowing it to evaluate student responses based on their conceptual understanding rather than
                  just keyword matching. This approach enables a more nuanced and fair assessment of student knowledge.
                </p>
                
                <h3 className="text-2xl font-semibold mt-8 mb-4">How It Works</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Step 1: Upload
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Educators upload reference answers and student submissions through our intuitive interface.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Step 2: Analyze
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Our SBERT-powered AI analyzes the semantic meaning and conceptual understanding in each response.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Step 3: Evaluate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Detailed feedback and scores are generated based on similarity to reference answers and conceptual accuracy.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Semantic Evaluation</CardTitle>
                    <CardDescription>Beyond simple keyword matching</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our platform uses SBERT to understand the meaning behind student answers, evaluating conceptual
                      understanding rather than just checking for specific words or phrases. This allows for a more
                      comprehensive assessment of student knowledge.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Instant Feedback</CardTitle>
                    <CardDescription>Immediate results and insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Students receive immediate feedback on their submissions, including detailed explanations of
                      strengths and areas for improvement. This rapid feedback loop enhances the learning process
                      and allows for quicker iteration.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Fair and Consistent Grading</CardTitle>
                    <CardDescription>Eliminate subjective bias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our AI evaluates all submissions using the same criteria, ensuring consistency across all
                      assessments. This eliminates the potential for human bias and provides a fair evaluation
                      experience for all students.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Reevaluation Requests</CardTitle>
                    <CardDescription>Appeal and improve</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Students can request reevaluations if they believe their answer was misunderstood. This
                      feature provides an additional layer of fairness and helps improve the AI system over time
                      through continuous learning.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="technology" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>The Power of SBERT</CardTitle>
                  <CardDescription>Understanding our core technology</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Sentence-BERT (SBERT) is a modification of the BERT architecture that uses siamese and triplet networks
                    to derive semantically meaningful sentence embeddings. These embeddings can be compared using cosine similarity
                    to determine how similar two pieces of text are in meaning, not just in vocabulary.
                  </p>
                  
                  <h4 className="font-semibold text-lg mt-4">Key Technical Features:</h4>
                  
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <span className="font-medium">Semantic Understanding:</span> SBERT captures the meaning of text beyond simple keyword matching
                    </li>
                    <li>
                      <span className="font-medium">Contextual Awareness:</span> The model understands words in context, recognizing that the same word can have different meanings
                    </li>
                    <li>
                      <span className="font-medium">Language Flexibility:</span> Works across multiple languages and can understand domain-specific terminology
                    </li>
                    <li>
                      <span className="font-medium">Efficient Computation:</span> Optimized for speed to provide near-instant feedback on submissions
                    </li>
                  </ul>
                  
                  <p className="mt-4">
                    By leveraging SBERT, EduEval AI can understand the conceptual similarity between a student's answer and the reference
                    answer, providing a more nuanced evaluation than traditional automated grading systems.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      How accurate is the AI evaluation?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our SBERT-based evaluation system has been tested to achieve over 85% agreement with human graders
                      across various subjects and question types. The system is particularly strong in evaluating conceptual
                      understanding and can recognize correct answers even when they use different terminology than the reference.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      What subjects can be evaluated?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      EduEval AI can evaluate responses across a wide range of subjects, including humanities, social sciences,
                      natural sciences, and more. The system is particularly effective for questions that require explanations,
                      definitions, or conceptual understanding rather than mathematical calculations or code.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      How can I improve my evaluation results?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Students can improve their results by focusing on clearly expressing concepts related to the question,
                      providing specific examples, and ensuring their answers are well-structured. The system evaluates both
                      the content and the clarity of expression, so well-organized responses typically score higher.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      Is my data secure?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, we take data security seriously. All submissions are encrypted in transit and at rest.
                      We do not use student submissions for training our models without explicit consent, and all
                      personal information is handled in accordance with our privacy policy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to transform your evaluation process?</h2>
            <p className="mb-6 text-muted-foreground">
              Join thousands of educators and students already benefiting from AI-powered semantic evaluation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Get Started
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 mt-auto w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row mx-auto">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduEval AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
