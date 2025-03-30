"use client"

import type React from "react"
import { useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Control } from "react-hook-form"
import { Loader2, ChevronRight } from "lucide-react"
import type { categoryWithchildren } from "@/Types"

interface InfiniteScrollSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  isLoading?: boolean
  categories: categoryWithchildren[]
  loadMore: () => void
  country?: boolean
  hasMore: boolean
  label: string
  placeholder?: string
}

const NestedInfinityScrollerSelect: React.FC<InfiniteScrollSelectProps> = ({
  control,
  name,
  country,
  categories,
  loadMore,
  hasMore,
  label,
  placeholder = "Select an option",
}) => {
  const [, setIsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <FormField
      control={control}
      name={name as unknown as never}
      render={({ field }) => (
        <FormItem className="min-w-[200px]">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
              onOpenChange={(open) => setIsOpen(open)}
            >
              <SelectTrigger className="min-w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <InfiniteScroll
                  pageStart={0}
                  loadMore={loadMore}
                  hasMore={hasMore}
                  loader={
                    <div className="p-2 text-center w-full flex justify-center items-center" key="loader">
                      <Loader2 className="animate-spin w-4 h-4" />
                    </div>
                  }
                  useWindow={false}
                >
                  <div className="space-y-1 p-1">
                    {categories.map((category) => (
                      
                      <div key={category.id} className="space-y-1">
                        {/* Parent category */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            className="p-1 rounded-sm hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                            aria-expanded={expandedCategories[category.id]}
                          >
                            <ChevronRight
                              className={`h-4 w-4 text-muted-foreground transition-transform ${
                                expandedCategories[category.id] ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          <SelectItem value={country ? category.name : category.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">
                              {category.name.length > 25 ? `${category.name.substring(0, 25)}...` : category.name}
                            </span>
                          </SelectItem>
                        </div>

                        {/* Children categories */}
                        {expandedCategories[category.id] && category.children.length > 0 && (
                          <div className="ml-6 pl-2 border-l border-muted space-y-1">
                            {category.children.map((child) => (
                              <SelectItem
                                key={`${category.id}-${child.id}`} // Unique key combining parent and child IDs
                                value={country ? child.name : child.id}
                                className="py-1 text-sm"
                              >
                                {child.name}
                              </SelectItem>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default NestedInfinityScrollerSelect