"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, Plus, X, Save, ArrowLeft, BookOpen, FileText, Star, ImageIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
// import { useToast } from "@/hooks/use-toast"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetSingleBookQuery, useUpdateBookMutation } from "@/store/QueriesApi/booksApi"
import { useGetAuthorsQuery } from "@/store/QueriesApi/authorApi"
import { useGetPublisherQuery } from "@/store/QueriesApi/publisherApi"
import { useGetCategoriesQuery } from "@/store/QueriesApi/categoryApi"
import { bookCover } from "@prisma/client"

interface EditBookFormProps {
  bookId: string
}

export default function EditBookForm({ bookId }: EditBookFormProps) {
  const router = useRouter()
  //   const { toast } = useToast()

  // RTK Query hooks
  const { data: book, isLoading, error } = useGetSingleBookQuery({ bookId: bookId })
  const { data: authors } = useGetAuthorsQuery({
    pgnum: 0,
    pgsize: 100

  })
  const { data: publishers } = useGetPublisherQuery({
    pgnum: 0,
    pgsize: 100

  })
  const { data: categories } = useGetCategoriesQuery({
    pgnum: 0,
    pgsize: 100

  })
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation()

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isbn: "",
    authorId: "",
    publisherId: "",
    categoryId: "",
    language: "",
    pages: "",
    fileSize: "",
    fileFormat: "",
    price: 0,
    publishedAt: "",
    available: false,
  })

  // Cover management state
  const [covers, setCovers] = useState<bookCover[]>([])
  const [newCovers, setNewCovers] = useState<{ file: File; type: string }[]>([])
  const [deletedCovers, setDeletedCovers] = useState<string[]>([])
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null)

  // Refs for file inputs
  const coverInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  // Initialize form data when book data is loaded
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        description: book.description || "",
        isbn: book.isbn,
        authorId: book.authorId,
        publisherId: book.publisherId,
        categoryId: book.categoryId,
        language: book.language,
        pages: book.pages || "0",
        fileSize: book.fileSize || "0",
        fileFormat: book.fileFormat,
        price: book.price,
        publishedAt: new Date(book.publishedAt || new Date()).toISOString().split("T")[0],
        available: book.available,
      })

      setCovers(book.bookCovers || [])
    }
  }, [book])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, available: checked }))
  }

  // Handle cover upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setNewCovers((prev) => [...prev, { file, type: "Image" }])

    // Reset input
    if (coverInputRef.current) {
      coverInputRef.current.value = ""
    }
  }

  // Handle PDF upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setNewPdfFile(e.target.files[0])

    // Reset input
    if (pdfInputRef.current) {
      pdfInputRef.current.value = ""
    }
  }

  // Handle removing a cover
  const handleRemoveCover = (index: number) => {
    const cover = covers[index]

    if (cover.id) {
      setDeletedCovers((prev) => [...prev, cover.id!])
    }

    setCovers((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle removing a new cover
  const handleRemoveNewCover = (index: number) => {
    setNewCovers((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle setting a cover as thumbnail
  const handleSetThumbnail = (index: number, isNew = false) => {
    if (isNew) {
      setNewCovers((prev) =>
        prev.map((cover, i) => ({
          ...cover,
          type: i === index ? "THUMBNAIL" : cover.type === "THUMBNAIL" ? "Image" : cover.type,
        })),
      )

      // Make sure existing covers aren't thumbnails
      setCovers((prev) =>
        prev.map((cover) => ({
          ...cover,
          type: cover.type === "THUMBNAIL" ? "Image" : cover.type,
        })),
      )
    } else {
      setCovers((prev) =>
        prev.map((cover, i) => ({
          ...cover,
          type: i === index ? "THUMBNAIL" : cover.type === "THUMBNAIL" ? "Image" : cover.type,
        })),
      )

      // Make sure new covers aren't thumbnails
      setNewCovers((prev) =>
        prev.map((cover) => ({
          ...cover,
          type: cover.type === "THUMBNAIL" ? "Image" : cover.type,
        })),
      )
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const submitFormData = new FormData()

      // Add basic book data
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, String(value))
      })

      // Add PDF file if there's a new one
      if (newPdfFile) {
        submitFormData.append("pdfFile", newPdfFile)
      }

      // Add existing covers data
      submitFormData.append("existingCovers", JSON.stringify(covers))

      // Add deleted covers
      submitFormData.append("deletedCovers", JSON.stringify(deletedCovers))

      // Add new covers
      submitFormData.append("numNewCovers", String(newCovers.length))
      newCovers.forEach((cover, index) => {
        submitFormData.append(`newCover${index}`, cover.file)
        submitFormData.append(`newCoverType${index}`, cover.type)
      })

      // Submit the form using RTK Query
      const result = await updateBook({ id: bookId, formData: submitFormData }).unwrap()

      if (result.success) {
        // toast({
        //   title: "Success",
        //   description: "Book updated successfully",
        // })
        router.push(`/books/${bookId}`)
      } else {
        // throw new Error(result.error || "Failed to update book")
      }
    } catch (error) {
      console.error("Error updating book:", error)
      //   toast({
      //     title: "Error",
      //     description: "Failed to update book",
      //     variant: "destructive",
      //   })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-destructive mb-4">
          <X className="h-16 w-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Error Loading Book</h2>
        <p className="text-muted-foreground mb-6">There was a problem loading the book details. Please try again.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className=" mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Book</h1>
            <p className="text-muted-foreground">Update book details and media</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isUpdating} className="px-6">
          <Save className="h-4 w-4 mr-2" />
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="details" className="text-sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Book Details
            </TabsTrigger>
            <TabsTrigger value="media" className="text-sm">
              <ImageIcon className="h-4 w-4 mr-2" />
              Cover Images
            </TabsTrigger>
            <TabsTrigger value="file" className="text-sm">
              <FileText className="h-4 w-4 mr-2" />
              Book File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="authorId">Author</Label>
                  <Select
                    defaultValue={book?.author.name || ""}

                    value={formData.authorId} onValueChange={(value) => handleSelectChange("authorId", value)}>
                   
                    <SelectTrigger>
                      <SelectValue placeholder={ book?.author.name || "Select author" }/>
                    </SelectTrigger>
                    <SelectContent>
                      {authors?.data?.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publisherId">Publisher</Label>
                  <Select
                    defaultValue={book?.publisher.name || ""}

                    value={formData.publisherId}
                    onValueChange={(value) => handleSelectChange("publisherId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={book?.publisher.name  || "Select publisher"} />
                    </SelectTrigger>
                    <SelectContent>
                      {publishers?.data?.map((publisher) => (
                        <SelectItem key={publisher.id} value={publisher.id}>
                          {publisher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select

                    defaultValue={book?.category.name || ""}
                    value={formData.categoryId}
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={book?.category.name || "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.data?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pages">Pages</Label>
                    <Input
                      id="pages"
                      name="pages"
                      type="number"
                      value={formData.pages}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt">Publication Date</Label>
                    <Input
                      id="publishedAt"
                      name="publishedAt"
                      type="date"
                      value={formData.publishedAt}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex items-end h-full pb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="available" checked={formData.available} onCheckedChange={handleCheckboxChange} />
                      <Label htmlFor="available">Available for purchase</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Book Covers</h2>
                <p className="text-muted-foreground">Manage book cover images and set thumbnail</p>
              </div>
              <Button type="button" onClick={() => coverInputRef.current?.click()} className="px-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Cover
              </Button>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {covers.map((cover, index) => (
                <Card key={`existing-${index}`} className="overflow-hidden group">
                  <div className="relative aspect-[3/4] bg-muted">
                    <Image
                      src={cover.fileUrl || "/placeholder.svg"}
                      alt={`Book cover ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={() => handleRemoveCover(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {cover.type !== "THUMBNAIL" && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => handleSetThumbnail(index)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {cover.type === "THUMBNAIL" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-xs py-1 text-center">
                        Thumbnail
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {newCovers.map((cover, index) => (
                <Card key={`new-${index}`} className="overflow-hidden group">
                  <div className="relative aspect-[3/4] bg-muted">
                    <Image
                      src={URL.createObjectURL(cover.file) || "/placeholder.svg"}
                      alt={`New book cover ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={() => handleRemoveNewCover(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {cover.type !== "THUMBNAIL" && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => handleSetThumbnail(index, true)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {cover.type === "THUMBNAIL" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-xs py-1 text-center">
                        Thumbnail
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {covers.length === 0 && newCovers.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No covers added yet</h3>
                  <p className="text-muted-foreground text-center mb-4">Upload cover images for your book</p>
                  <Button type="button" variant="secondary" onClick={() => coverInputRef.current?.click()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cover Image
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Book File</h2>
              <p className="text-muted-foreground mb-6">Manage the PDF file for this book</p>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {newPdfFile ? newPdfFile.name : book?.fileUrl?.split("/").pop() || "Book PDF"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formData.fileFormat} • {formData.fileSize}
                        </p>
                      </div>
                    </div>

                    <Button type="button" variant="outline" onClick={() => pdfInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace File
                    </Button>
                    <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileFormat">File Format</Label>
                    <Input
                      id="fileFormat"
                      name="fileFormat"
                      value={formData.fileFormat}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fileSize">File Size</Label>
                    <Input id="fileSize" name="fileSize" value={formData.fileSize} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isUpdating}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating} className="px-8">
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
