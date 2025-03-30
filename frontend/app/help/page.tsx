import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Help() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b w-full mb-4">
        <div className="container flex h-16 items-center px-4 sm:px-8 mx-auto">
          <Link href="/" className="text-xl font-bold hover:underline">
            EduEval AI
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <nav className="flex gap-4">
              <Link href="/login" className="text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium">
                Register
              </Link>
              <Link href="/help" className="text-sm font-medium">
                Help
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">About EduEval AI</h1>
        <p className="text-lg text-muted-foreground mb-4">
          EduEval AI is an advanced platform designed to streamline the evaluation process in education.
          It leverages artificial intelligence to provide accurate, unbiased, and instant feedback on
          submitted answers, making grading more efficient and fair.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-6">
          <li>AI-powered answer evaluation for educators.</li>
          <li>Instant feedback and reevaluation requests for students.</li>
          <li>Fair and consistent grading with detailed feedback.</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <p className="text-lg text-muted-foreground">
          Educators can upload answer scripts and set reference answers. The AI evaluates the submissions
          and provides detailed feedback. Students can view their results, request reevaluations, and
          improve their learning experience.
        </p>
      </main>
      <footer className="border-t py-6 mt-auto w-full">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row mx-auto">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduEval AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
