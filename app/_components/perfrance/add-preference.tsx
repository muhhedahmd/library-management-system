"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
// import { useToast } from "@/components/ui/use-toast"
import { Plus, Search, BookOpen, User, BookIcon as BookAndPencil, ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Entity {
    id: string
    name: string
}

export default function AddPreference({ onPreferenceAdded }: {
    onPreferenceAdded: () => void
}) {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("category")

    // Category state
    const [categorySearchQuery, setCategorySearchQuery] = useState("")
    const [categorySearchResults, setCategorySearchResults] = useState<Entity[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Entity | null>(null)
    const [categoryWeight, setCategoryWeight] = useState(5)

    // Author state
    const [authorSearchQuery, setAuthorSearchQuery] = useState("")
    const [authorWeight, setAuthorWeight] = useState(5)
    const [authorSearchResults, setAuthorSearchResults] = useState<Entity[]>([])
    const [selectedAuthor, setSelectedAuthor] = useState<Entity | null>(null)

    // collpases 
    const [CollapseAuthors, setCollapseAuthors] = useState(false)
    const [CollapseCategory, setCollapseCategory] = useState(false)
    const [BothWeight, setBothWeight] = useState(5)


    const handleCollapseAuthors = () => {
        setCollapseAuthors((prev) => !prev)

    }
    const handleCollapseCategory = () => {
        setCollapseCategory((prev) => !prev)

    }



    // Shared state
    const [isLoading, setIsLoading] = useState(false)
    //   const { toast } = useToast()

    const handleCategorySearch = async () => {
        if (!categorySearchQuery.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/categories/search?q=${encodeURIComponent(categorySearchQuery)}`)

            if (response.ok) {
                const data = await response.json()
                setCategorySearchResults(data.categories)
            } else {
                throw new Error("Failed to search categories")
            }
        } catch (error) {
            console.error("Search error:", error)
            //   toast({
            //     title: "Category search failed",
            //     description: "Failed to search categories. Please try again.",
            //     variant: "destructive",
            //   })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAuthorSearch = async () => {
        if (!authorSearchQuery.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/authors/search?q=${encodeURIComponent(authorSearchQuery)}`)

            if (response.ok) {
                const data = await response.json()
                setAuthorSearchResults(data.authors)
            } else {
                throw new Error("Failed to search authors")
            }
        } catch (error) {
            console.error("Search error:", error)
            //   toast({
            //     title: "Author search failed",
            //     description: "Failed to search authors. Please try again.",
            //     variant: "destructive",
            //   })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddPreference = async () => {
        // Validate based on active tab
        if (activeTab === "category" && !selectedCategory) return
        if (activeTab === "author" && !selectedAuthor) return
        if (activeTab === "both" && !selectedCategory && !selectedAuthor) return

        setIsLoading(true)
        try {
            if (activeTab === "category") {
                const response = await fetch(process.env.NEXT_PUBLIC_API + "/api/users/preferances", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "category",
                        categoryId: selectedCategory?.id,
                        authorId: null,
                        weight: categoryWeight,
                    }),
                })
                if (response.ok) {
                    onPreferenceAdded()
                }
                else {
                    console.log(response)
                    console.error("Failed to add preference")
                }
            }
            if (activeTab === "author") {
                const response = await fetch(process.env.NEXT_PUBLIC_API + "/api/users/preferances", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "author",
                        categoryId: null,
                        authorId: selectedAuthor?.id,
                        userPreferenceId: null,
                        weight: authorWeight,
                    }),
                })
                if (response.ok) {
                    onPreferenceAdded()
                }
            }
            if (activeTab === "both") {
                const response = await fetch(process.env.NEXT_PUBLIC_API + "/api/users/preferances", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "comp",
                        categoryId: selectedCategory?.id,
                        authorId: selectedAuthor?.id,
                        weight: BothWeight,
                    }),
                })
                console.log(response)
                if (response) {
                    onPreferenceAdded()
                }
            }




        } catch (error) {
            console.error("Add preference error:", error)
            //   toast({
            //     title: "Error",
            //     description: "Failed to add preference. Please try again.",
            //     variant: "destructive",
            //   })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setCategorySearchQuery("")
        setAuthorSearchQuery("")
        setCategoryWeight(5)
        setAuthorWeight(5)
        setCategorySearchResults([])
        setAuthorSearchResults([])
        setSelectedCategory(null)
        setSelectedAuthor(null)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (!isOpen) resetForm()
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Preference
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Preference</DialogTitle>
                    <DialogDescription>
                        Add preferences for categories, authors, or both to improve your recommendations.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="category" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="category" className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Category
                        </TabsTrigger>
                        <TabsTrigger value="author" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            Author
                        </TabsTrigger>
                        <TabsTrigger value="both" className="flex items-center">
                            <BookAndPencil className="mr-2 h-4 w-4" />
                            Both
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-4 space-y-4">
                        {/* Category Section - Show in Category tab and Both tab */}
                        {(activeTab === "category" || activeTab === "both") && (
                            <div className="space-y-4">
                                {activeTab === "both" && (
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        <h3 className="font-medium">Category Preference</h3>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search categories..."
                                            className="pl-8"
                                            value={categorySearchQuery}
                                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleCategorySearch()
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button onClick={handleCategorySearch} disabled={isLoading || !categorySearchQuery.trim()}>
                                        {isLoading ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                            "Search"
                                        )}
                                    </Button>
                                    <Button variant={"outline"}
                                        disabled={categorySearchResults?.length === 0}
                                        onClick={handleCollapseCategory} >

                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </div>

                                {categorySearchResults.length > 0 && (
                                    <ScrollArea className={cn(" overflow-hidden transition-all duration-300 h-[150px] border rounded-md p-2",
                                        CollapseCategory && "h-0 p-1"

                                    )
                                    }>
                                        <div className="space-y-1">
                                            {categorySearchResults.map((entity) => (
                                                <Button
                                                    key={entity.id}
                                                    variant={selectedCategory?.id === entity.id ? "secondary" : "ghost"}
                                                    className="w-full justify-start"
                                                    onClick={() => {
                                                        setCollapseCategory(true)
                                                        setCategorySearchQuery(entity.name)
                                                        setSelectedCategory(entity)
                                                    }}
                                                >
                                                    {entity.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}

                                {selectedCategory && activeTab !== "both" && (
                                    <div className="space-y-2 border rounded-md p-3">
                                        <div className="flex justify-between items-center">
                                            <div className="font-medium">{selectedCategory.name}</div>
                                            <Badge variant="outline">Category</Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>Preference Weight</span>
                                                <span className="font-medium">{categoryWeight}</span>
                                            </div>
                                            <Slider
                                                value={[categoryWeight]}
                                                min={1}
                                                max={10}
                                                step={1}
                                                onValueChange={(value) => setCategoryWeight(value[0])}
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Low</span>
                                                <span>High</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Separator for Both tab */}
                        {activeTab === "both" && <Separator className="my-4" />}

                        {/* Author Section - Show in Author tab and Both tab */}
                        {(activeTab === "author" || activeTab === "both") && (
                            <div className="space-y-4">
                                {activeTab === "both" && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <h3 className="font-medium">Author Preference</h3>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search authors..."
                                            className="pl-8"
                                            value={authorSearchQuery}
                                            onChange={(e) => setAuthorSearchQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleAuthorSearch()
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button onClick={handleAuthorSearch} disabled={isLoading || !authorSearchQuery.trim()}>
                                        {isLoading ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                            "Search"
                                        )}
                                    </Button>
                                    <Button variant={"outline"}
                                        disabled={authorSearchResults?.length === 0}
                                        onClick={handleCollapseAuthors} >

                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </div>

                                {authorSearchResults.length > 0 && (

                                    <ScrollArea className={cn(" overflow-hidden transition-all duration-300 h-[150px] border rounded-md p-2",
                                        CollapseAuthors && "h-0 p-1"

                                    )
                                    }>
                                        <div className="space-y-1">
                                            {authorSearchResults.map((entity) => (
                                                <Button
                                                    key={entity.id}
                                                    variant={selectedAuthor?.id === entity.id ? "secondary" : "ghost"}
                                                    className="w-full justify-start"
                                                    onClick={() => {
                                                        setCollapseAuthors(true)
                                                        setAuthorSearchQuery(entity.name)
                                                        setSelectedAuthor(entity)
                                                    }}
                                                >
                                                    {entity.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}

                                {selectedAuthor && activeTab !== "both" && (

                                    <div className="space-y-2 border rounded-md p-3">
                                        <div className="flex justify-between items-center">
                                            <div className="font-medium">{selectedAuthor.name}</div>
                                            <Badge variant="secondary">Author</Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>Preference Weight</span>
                                                <span className="font-medium">{authorWeight}</span>
                                            </div>
                                            <Slider
                                                value={[authorWeight]}
                                                min={1}
                                                max={10}
                                                step={1}
                                                onValueChange={(value) => setAuthorWeight(value[0])}
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Low</span>
                                                <span>High</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedCategory && selectedAuthor && activeTab === "both" && (

                                    <div className="space-y-2 border rounded-md p-3">
                                        <div className="flex justify-between items-start flex-col">
                                            <div className="flex justify-start items-center gap-3 ">

                                                <div className="font-medium">{selectedAuthor.name}</div>
                                                <Badge variant="secondary">Author</Badge>
                                            </div>
                                            <div className="flex justify-start items-center gap-3">

                                                <div className="font-medium">{selectedCategory.name}</div>
                                                <Badge variant="secondary">Category</Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>Preference Weight</span>
                                                <span className="font-medium">{BothWeight}</span>
                                            </div>
                                            <Slider
                                                value={[BothWeight]}
                                                min={1}
                                                max={10}
                                                step={1}
                                                onValueChange={(value) => setBothWeight(value[0])}
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Low</span>
                                                <span>High</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddPreference}
                        disabled={
                            isLoading ||
                            (activeTab === "category" && !selectedCategory) ||
                            (activeTab === "author" && !selectedAuthor) ||
                            (activeTab === "both" && !selectedCategory && !selectedAuthor)
                        }
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        ) : null}
                        Add Preference{activeTab === "both" && "s"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
