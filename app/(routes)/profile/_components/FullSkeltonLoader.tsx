import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FullSkeletonLoader = () => (
  
    <div className="flex flex-col relative md:flex-row justify-between items-start gap-6">
      {/* Left Column - Profile Info Skeleton */}
      <Card className="w-full static md:sticky top-[1rem] md:w-1/3">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          {/* Avatar Skeleton */}
          <div className="animate-wave bg-muted/50 h-24 w-24 rounded-full mb-4" />
          {/* Name Skeleton */}
          <div className="animate-wave rounded-xl bg-muted/50 h-6 w-48 mb-2" />
          {/* Role Skeleton */}
          <div className="animate-wave rounded-xl bg-muted/50 h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contact Info Skeleton */}
          <div className="space-y-2">
            <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64" />
            <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64" />
            <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64" />
          </div>
          <Separator />
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-1">
                <div className="animate-wave rounded-xl bg-muted/50 h-4 w-20" />
                <div className="animate-wave rounded-xl bg-muted/50 h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {/* Buttons Skeleton */}
          <div className="animate-wave rounded-xl bg-muted/50 h-6 w-full" />
          <div className="animate-wave rounded-xl bg-muted/50 h-6 w-full" />
        </CardFooter>
      </Card>
  
      {/* Right Column - Role-Specific Content Skeleton */}
      <div className="w-full md:w-2/3 space-y-6">
        {/* Currently Borrowed Books Skeleton */}
        <Card>
          <CardHeader>
            <div className="animate-wave rounded-xl bg-muted/50 h-4 w-48" />
            <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-wave bg-muted/50 h-8 w-8 rounded-full" />
                    <div>
                      <div className="animate-wave rounded-xl bg-muted/50 h-4 w-32" />
                      <div className="animate-wave rounded-xl bg-muted/50 h-3 w-48 mt-1" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="animate-wave rounded-xl bg-muted/50 h-4 w-20" />
                    <div className="animate-wave rounded-xl bg-muted/50 h-4 w-16 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="animate-wave rounded-xl bg-muted/50 h-6 w-full" />
          </CardFooter>
        </Card>
  
        {/* Reading Preferences Skeleton */}
        <Card>
  
          <CardHeader>
            <div className="animate-wave rounded-xl bg-muted/50 h-6 w-48" />
            <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="animate-wave rounded-xl bg-muted/50 h-4 w-32 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="animate-wave rounded-xl bg-muted/50 h-4 w-16" />
                  ))}
                </div>
              </div>
              <div>
                <div className="animate-wave rounded-xl bg-muted/50 h-4 w-32 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-wave rounded-xl bg-muted/50 h-4 w-16" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="animate-wave rounded-xl bg-muted/50 h-9 w-full" />
          </CardFooter>
        </Card>
  
        {/* Recommended For You Skeleton */}
        <Card>
  
          <CardHeader>
            <div className="animate-wave rounded-xl bg-muted/50 h-6 w-48" />
            <div className="animate-wave rounded-xl bg-muted/50 h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="animate-wave rounded-md bg-muted/50 h-16 w-16 " />
                  <div>
                    <div className="animate-wave rounded-xl bg-muted/50 h-4 w-32" />
                    <div className="animate-wave rounded-xl bg-muted/50 h-3 w-48 mt-1" />
                    <div className="animate-wave rounded-xl bg-muted/50 h-4 w-16 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  export default FullSkeletonLoader