"use client"


import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

export function ProgreeProfile({progress :progressProfile} : {
  progress: number
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(progressProfile), 500)
    return () => clearTimeout(timer)
  }, [progressProfile])

  return <Progress value={progress} className="w-[97%]" />
}
