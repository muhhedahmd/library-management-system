import type { Metadata } from "next"
import RecommendationSection from "../../_components/recommendation/recommendationSection"

export const metadata: Metadata = {
  title: "Book Recommendations",
  description: "Personalized book recommendations based on your preferences and reading history",
}

export default function RecommendationsPage() {
  return (
    <div className=" mx-auto  mt-2">
 

      <RecommendationSection />
    </div>
  )
}

