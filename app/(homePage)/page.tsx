import Link from "next/link"
import type { Metadata } from "next"
import {
  BookOpen,
  Users,
  BarChart,
  Calendar,
  Search,
  BookCopy,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "LibraryPro — Modern Library Management System",
  description:
    "Streamline your library with catalog management, member tracking, circulation control, and analytics. Trusted by 5,000+ libraries worldwide.",
}

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto select-none">
      <div className="rounded-xl overflow-hidden shadow-2xl border border-border bg-background">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-3 bg-background rounded-md h-5 text-[10px] text-muted-foreground flex items-center px-2 border">
            app.librarypro.com/dashboard
          </div>
        </div>
        <div className="flex h-64 bg-background">
          <div className="w-14 bg-primary/5 border-r border-border flex flex-col items-center gap-3 py-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart className="w-4 h-4 text-primary" />
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <BookCopy className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-foreground">Dashboard Overview</span>
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground bg-muted rounded px-2 py-0.5">
                <Search className="w-2.5 h-2.5" /> Search books...
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Books", value: "12,841", color: "text-blue-600" },
                { label: "Members", value: "1,203", color: "text-green-600" },
                { label: "Due Today", value: "47", color: "text-orange-500" },
              ].map((s) => (
                <div key={s.label} className="bg-muted/50 rounded-lg p-2 border border-border">
                  <div className={`text-[13px] font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[9px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-muted/30 rounded-lg p-2 border border-border flex-1">
              <div className="text-[9px] font-medium text-muted-foreground mb-1.5">Recent Activity</div>
              {[
                { title: "The Great Gatsby", action: "Borrowed", color: "bg-blue-500" },
                { title: "Atomic Habits", action: "Returned", color: "bg-green-500" },
                { title: "Dune", action: "Reserved", color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-2 py-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.color}`} />
                  <span className="text-[9px] text-foreground truncate flex-1">{item.title}</span>
                  <span className="text-[8px] text-muted-foreground">{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
        ✓ Live
      </div>
      <div className="absolute -bottom-3 -left-3 bg-background border border-border shadow-lg rounded-lg px-3 py-1.5 text-[10px] font-medium">
        📚 47 books due today
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex min-h-screen flex-col w-full">
        <main className="flex-1">

          {/* Hero */}
          <section className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-b from-background to-muted">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-7xl mx-auto">
                <div className="flex flex-col justify-center space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium w-fit">
                    <BookOpen className="h-4 w-4" /> Library Management, Simplified
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none">
                    The smarter way to run your library
                  </h1>
                  <p className="max-w-[560px] text-muted-foreground text-lg leading-relaxed">
                    Catalog books, manage members, track borrowing, and get insights — all in one clean dashboard. Built for school, public, and university libraries.
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {["Free to start", "No credit card", "Setup in minutes"].map((t) => (
                      <span key={t} className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" /> {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/auth/signin?tab=register">
                      <Button size="lg" className="gap-2 w-full sm:w-auto">
                        Get Started Free <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/books">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Browse Catalog
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center py-8">
                  <DashboardMockup />
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="w-full py-12 md:py-20 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center max-w-4xl mx-auto">
                {[
                  { value: "5,000+", label: "Libraries Served" },
                  { value: "10M+", label: "Books Managed" },
                  { value: "99.9%", label: "Uptime SLA" },
                  { value: "24/7", label: "Support" },
                ].map((s) => (
                  <div key={s.label} className="space-y-1">
                    <div className="text-3xl font-bold md:text-4xl">{s.value}</div>
                    <div className="text-sm text-primary-foreground/70">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="w-full py-16 md:py-28">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="text-center space-y-3 mb-12">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Features</div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything your library needs</h2>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
                  A complete toolkit for modern library operations, from catalog to analytics.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {[
                  { icon: BookCopy, title: "Catalog Management", desc: "Organize your collection with advanced metadata, ISBN integration, and bulk imports." },
                  { icon: Users, title: "Member Management", desc: "Track member info, borrowing history, and reading preferences in unified profiles." },
                  { icon: Calendar, title: "Circulation Control", desc: "Handle borrowing, returns, renewals, and holds with automated due-date reminders." },
                  { icon: Search, title: "Advanced Search", desc: "Powerful filters let staff and patrons find resources by title, author, genre, and more." },
                  { icon: BarChart, title: "Reports & Analytics", desc: "Gain insights into collection usage, member activity, and circulation trends." },
                  { icon: BookOpen, title: "Digital Resources", desc: "Manage e-books, audiobooks, and digital assets alongside your physical collection." },
                ].map(({ icon: Icon, title, desc }) => (
                  <Card key={title} className="flex flex-col items-center text-center">
                    <CardHeader>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="mt-3">{title}</CardTitle>
                    </CardHeader>
                    <CardContent><CardDescription>{desc}</CardDescription></CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="w-full py-16 md:py-28 bg-muted">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="text-center space-y-3 mb-12">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Trusted by librarians worldwide</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {[
                  { name: "Sarah Johnson", role: "Head Librarian, City Public Library", quote: "LibraryPro transformed how we manage our collection. Administrative time is down 60% and our team can focus on patrons.", stars: 5 },
                  { name: "Michael Chen", role: "Director, University Library", quote: "The analytics capabilities gave us unprecedented insights into collection usage, helping us make smarter acquisition decisions.", stars: 5 },
                  { name: "Emily Rodriguez", role: "School Librarian, Lincoln High", quote: "Students love the intuitive search, and I appreciate how easy it is to track checkouts and returns. Highly recommended!", stars: 5 },
                ].map(({ name, role, quote, stars }) => (
                  <Card key={name}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {name[0]}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{name}</CardTitle>
                          <CardDescription className="text-xs">{role}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: stars }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{quote}</p></CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="w-full py-16 md:py-28 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6 mx-auto text-center max-w-3xl space-y-6">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to modernize your library?</h2>
              <p className="text-primary-foreground/80 md:text-lg">
                Join thousands of libraries that have streamlined their operations. Get started free — no credit card required.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <Link href="/auth/signin?tab=register">
                  <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/books">
                  <Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto">
                    Browse the Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </section>

        </main>

        <footer className="border-t bg-background">
          <div className="container px-4 md:px-6 mx-auto flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between md:py-10">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">LibraryPro</span>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {["About", "Features", "Pricing", "Contact", "Privacy", "Terms"].map((item) => (
                <Link key={item} href="#" className="hover:text-foreground transition-colors">{item}</Link>
              ))}
            </nav>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} LibraryPro. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
