"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  /** The maximum number of stars to display */
  maxStars?: number
  /** The initial rating value */
  initialRating?: number
  /** Whether the rating can be changed by the user */
  readonly?: boolean
  /** The size of the stars in pixels */
  size?: number
  /** The color of the filled stars */
  activeColor?: string
  /** The color of the empty stars */
  inactiveColor?: string
  /** Callback function when rating changes */
  onChange?: (rating: number) => void
  /** Whether to allow half-star ratings */
  allowHalf?: boolean
  /** Additional CSS classes */
  className?: string
}

export function StarRating({
  maxStars = 5,
  initialRating = 0,
  readonly = false,
  size = 24,
  activeColor = "text-yellow-400",
  inactiveColor = "text-gray-300",
  onChange,
  allowHalf = false,
  className,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  const handleClick = (index: number) => {
    if (readonly) return

    const newRating = allowHalf && hoverRating === index - 0.5 ? index - 0.5 : index
    setRating(newRating)
    onChange?.(newRating)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readonly) return

    if (allowHalf) {
      const rect = event.currentTarget.getBoundingClientRect()
      const halfPoint = rect.left + rect.width / 2
      const isHalf = event.clientX < halfPoint
      setHoverRating(isHalf ? index - 0.5 : index)
    } else {
      setHoverRating(index)
    }
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const renderStar = (index: number) => {
    const activeRating = hoverRating || rating
    const isActiveHalf = allowHalf && activeRating === index - 0.5
    const isActiveFull = activeRating >= index
    const isActive = isActiveHalf || isActiveFull

    return (
      <div
        key={index}
        className={cn(
          "relative cursor-pointer transition-transform duration-100",
          !readonly && "hover:scale-110",
          readonly && "cursor-default",
        )}
        onClick={() => handleClick(index)}
        onMouseMove={(e) => handleMouseMove(e, index)}
        style={{ width: size, height: size }}
        role={readonly ? "presentation" : "button"}
        aria-label={readonly ? `${rating} out of ${maxStars} stars` : `Rate ${index} out of ${maxStars} stars`}
      >
        <Star
          size={size}
          className={cn("transition-colors", isActive ? activeColor : inactiveColor)}
          fill={isActive ? "currentColor" : "none"}
        />

        {isActiveHalf && (
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={size} className={activeColor} fill="currentColor" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={handleMouseLeave}
      role="group"
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }, (_, i) => renderStar(i + 1))}

      {!readonly && (
        <span className="ml-2 text-sm text-gray-500">
          {hoverRating || rating || 0}/{maxStars}
        </span>
      )}
    </div>
  )
}

