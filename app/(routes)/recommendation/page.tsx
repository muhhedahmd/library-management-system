import type { Metadata } from "next"
import RecommendationSection from "../../_components/recommendation/recommendationSection"

export const metadata: Metadata = {
  title: "Book Recommendations",
  description: "Personalized book recommendations based on your preferences and reading history",
}

export default function RecommendationsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Personalized Recommendations</h1>
      <p className="text-muted-foreground mb-8">
        Discover books tailored to your interests, reading history, and what similar readers enjoy.
      </p>

      <RecommendationSection />
    </div>
  )
}

