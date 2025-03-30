import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookPageLoading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover and Actions */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center">
            <Skeleton className="w-full max-w-[300px] aspect-[2/3] rounded-lg mb-6" />

            <div className="flex flex-wrap gap-2 justify-center w-full mb-6">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>

            <Skeleton className="w-full h-12 mb-4" />

            <Card className="w-full">
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-40 mb-4" />

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>

                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2">
          <div className="flex flex-col space-y-6">
            {/* Breadcrumbs */}
            <Skeleton className="h-4 w-64 mb-2" />

            {/* Title and Author */}
            <div>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            {/* Rating and Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20" />
            </div>

            {/* Categories and Keywords */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>

            {/* Description */}
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Book Details Tabs */}
            <Tabs defaultValue="details" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="readers">Readers</TabsTrigger>
                <TabsTrigger value="related">Related Books</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-16">
        <Skeleton className="h-px w-full mb-8" />
        <Skeleton className="h-8 w-64 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[2/3] w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3 mb-2" />
                <Skeleton className="h-4 w-12 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

