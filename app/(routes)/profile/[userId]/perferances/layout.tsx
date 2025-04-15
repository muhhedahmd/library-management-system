



import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOption"
import type { Metadata } from "next"
import PreferencesSidebar from "@/app/_components/perfrance/preferences-sidebar"

export const metadata: Metadata = {
  title: "Your Preferences | Language Education Library",
  description: "Manage your preferences for categories and authors",
}

export default async function PreferencesPage({
    children
} :{
    children : React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/preferences")
  }

  return (
    <div className="flex w-full  flex-col ">
      {/* <div className="flex-1 p-8 transition">
        <h1 className="text-3xl font-bold mb-6">Your Preferences</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Manage your preferences to get better recommendations tailored to your interests.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">How Preferences Work</h2>
            <p className="text-muted-foreground">
              Your preferences help us understand what you like. Higher weights (1-10) indicate stronger preferences.
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
              <li>Set preferences for your favorite categories and authors</li>
              <li>Adjust weights to fine-tune your recommendations</li>
              <li>Remove preferences you no longer want</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Recommendation Impact</h2>
            <p className="text-muted-foreground">
              Your preferences directly influence the books we recommend to you in these ways:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
              <li>Higher weighted categories appear more often in recommendations</li>
              <li>Author preferences help us suggest similar writers</li>
              <li>Preferences combine with your reading history for better results</li>
            </ul>
          </div>
        </div>
      </div> */}
      <PreferencesSidebar />

      {children}
    </div>
  )
}
