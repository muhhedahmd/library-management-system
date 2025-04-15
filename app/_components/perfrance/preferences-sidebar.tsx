"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, User, Settings, ZapIcon, ChevronLeft } from "lucide-react"
import PreferenceItem from "./preference-item"
import AddPreference from "./add-preference"
import { useGetUserPreferencesQuery } from "@/store/QueriesApi/ProfileQuery"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"




export default function PreferencesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("categories")



  const {
    data  : preferences, 
    isLoading ,
    refetch
  } = useGetUserPreferencesQuery()


  return (
    <div className=" w-full mx-auto py-6 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 justify-start">
          <Button size={"icon"}
          onClick={() => router.push("/profile/cm7z3uthi0000vn40cwvwjr7b")}
          className="flex justify-center items-center">
            <ChevronLeft className=" h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Settings className="h-6 w-6 mr-2" />
            Preferences
          </h1>
        </div>

        {/* Add Preference Section */}
        <div className="w-full md:max-w-md">
          <AddPreference
           onPreferenceAdded={refetch}  />
        </div>

        {/* Tabs and Content */}
        <div className="w-full">
          <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
          <div className=" flex justify-start gap-3 items-center">

            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="categories" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="authors" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Authors
              </TabsTrigger>
              <TabsTrigger value="Combination" className="flex items-center">
                <ZapIcon className="mr-2 h-4 w-4" />
                Combination
              </TabsTrigger>
        
            </TabsList>

          </div>
            {isLoading || !preferences ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <TabsContent value="categories" className="mt-0">

                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {preferences && preferences.preferences?.categories?.length === 0 ? (
                      <div className="col-span-full bg-muted/30 rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">
                          No category preferences yet.
                          <br />
                          Add some to improve your recommendations.
                        </p>
                      </div>
                    ) : (
                        preferences && preferences.preferences?.categories?.map((pref) => (

                        <PreferenceItem

                        isComp={
                            
                            preferences?.preferences?.Combination?.filter((comp)=>comp.id  === pref.id)
                            ?.find((comp)=>comp.categoryId !==null) 
                        }
                          key={pref.id}
                          id={pref.id}
                          name={pref.category?.name || "Unknown Category"}
                          type="category"
                          weight={pref.weight}
                          entityId={pref.categoryId || ""}
                          onUpdate={refetch}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="authors" className="mt-0">

                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {preferences && preferences?.preferences?.authors?.length === 0 ? (
                      <div className="col-span-full bg-muted/30 rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">
                          No author preferences yet.
                          <br />
                          Add some to improve your recommendations.
                        </p>
                      </div>
                    ) : (
                        preferences && preferences?.preferences?.authors?.map((pref) => (
                        <PreferenceItem
                        isComp={
                         preferences?.preferences?.Combination?.filter((comp)=>comp.id  === pref.id)
                            ?.find((comp)=>comp.categoryId !==null) 
                        }
                          key={pref.id}
                          id={pref.id}
                          name={pref.author?.name || "Unknown Author"}
                          type="author"
                          weight={pref.weight}
                          entityId={pref.authorId || ""}
                          onUpdate={refetch}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="Combination" className="mt-0">
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {
                       preferences && preferences?.preferences?.Combination?.map((comp) => (
                        <PreferenceItem

                         isComp={comp}

                          key={comp.id}
                          id={comp.id}
                          author={comp.author }
                          category={comp.category}
                          type="comp"

                          weight={comp.weight}
                          authorId={comp.authorId }
                          categoryId={comp.authorId }
                          onUpdate={refetch}
                        />
                      ))
                  }
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
