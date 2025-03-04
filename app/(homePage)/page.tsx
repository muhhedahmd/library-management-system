import Link from "next/link"
import Image from "next/image"
import { BookOpen, Users, BarChart, Calendar, Search, BookCopy, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "../_comonents/ThemeToggle"
import { DropdownMenuDemo } from "../_comonents/UserLogDropMenuNav"

export default function LandingPage() {
  return (
    <div className="flex w-full justify-center items-center">

    <div className="flex min-h-screen flex-col w-fit">

      {/* Header/Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LibraryPro</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">

<DropdownMenuDemo/>
            <ThemeToggle/>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 w-full max-w-7xl mx-auto">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Modernize Your Library Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline cataloging, borrowing, and returns with our comprehensive library management system.
                    Designed for libraries of all sizes.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth-form?tab=register">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button size="lg" variant="outline">
                      Watch Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full max-w-[450px] mx-auto overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=700&width=900"
                    alt="Library Management Dashboard"
                    width={900}
                    height={700}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="text-3xl font-bold md:text-4xl">5,000+</div>
                <div className="text-sm font-medium text-muted-foreground md:text-base">Libraries Served</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="text-3xl font-bold md:text-4xl">10M+</div>
                <div className="text-sm font-medium text-muted-foreground md:text-base">Books Managed</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="text-3xl font-bold md:text-4xl">99.9%</div>
                <div className="text-sm font-medium text-muted-foreground md:text-base">Uptime</div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="text-3xl font-bold md:text-4xl">24/7</div>
                <div className="text-sm font-medium text-muted-foreground md:text-base">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Manage Your Library
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive solution provides all the tools you need to efficiently manage your library's
                  resources and patrons.
                </p>
              </div>
            </div>
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 pt-8">
              <Card className="flex flex-col items-center text-center">
                <CardHeader>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <BookCopy className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Catalog Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Easily catalog and organize your entire collection with advanced metadata support and ISBN
                    integration.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center text-center">
                <CardHeader>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Member Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track member information, borrowing history, and preferences with our intuitive user management
                    system.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center text-center">
                <CardHeader>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Circulation Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Manage borrowing, returns, renewals, and reservations with automated due date calculations and
                    reminders.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center text-center">
                <CardHeader>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Advanced Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Powerful search capabilities allow patrons and staff to quickly find resources by title, author,
                    subject, and more.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center text-center">
                <CardHeader>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <BarChart className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Reports & Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Generate comprehensive reports on circulation, collection usage, and member activity to inform
                    decision-making.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center text-center">
                <CardHeader>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Digital Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Manage e-books, audiobooks, and other digital resources alongside your physical collection.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Trusted by Librarians Worldwide
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what library professionals are saying about our management system.
                </p>
              </div>
            </div>
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 pt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Sarah Johnson</CardTitle>
                      <CardDescription>Head Librarian, City Public Library</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    "LibraryPro has transformed how we manage our collection. The time saved on administrative tasks
                    allows us to focus more on serving our community."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Michael Chen</CardTitle>
                      <CardDescription>Director, University Library</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    "The analytics capabilities have given us unprecedented insights into our collection usage, helping
                    us make data-driven acquisition decisions."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Emily Rodriguez</CardTitle>
                      <CardDescription>School Librarian, Lincoln High</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    "Our students love the intuitive search interface, and I appreciate how easy it is to track
                    checkouts and returns. Highly recommended!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary text-secondary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center w-full max-w-4xl mx-auto">
              <div className="space-y-2 bg-secondary">
                <h2 className="text-secondary-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Transform Your Library?
                </h2>
                <p className="max-w-[600px] bg-secondary text-secondary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of libraries that have streamlined their operations with our comprehensive management
                  system.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth-form?tab=register">
                  <Button size="lg" variant="secondary" className="gap-1">
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground  text-primary  hover:bg-primary-foreground hover:text-primary"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">

        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LibraryPro</span>
          </div>
          <nav className="flex flex-wrap gap-4 md:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Contact
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Terms
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">© 2024 LibraryPro. All rights reserved.</div>
        </div>
      </footer>
    </div>
    </div>

  )
}

