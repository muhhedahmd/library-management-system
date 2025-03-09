"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { FileUpload } from "@/app/_comonents/FileUploade"
import { AuthorDialog } from "./Dialog/AuthorCreation"
import { PublisherDialog } from "./Dialog/PublisherCreation"
import { CategoryDialog } from "./Dialog/CategoryDialog"
import InfiniteScrollSelect from "@/app/_comonents/InfintyScrollerSelect"
import { useGetCategoriesQuery } from "@/store/QueriesApi/categoryApi"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setPostsPagination } from "@/store/Slices/paggnitionSlice"
import { useGetAuthorsQuery } from "@/store/QueriesApi/authorApi"
import { useGetPublisherQuery } from "@/store/QueriesApi/publisherApi"


// Define the form schema
const bookFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  isbn: z.string().min(1, { message: "ISBN is required" }),
  authorId: z.string().min(1, { message: "Author is required" }),
  publisherId: z.string().min(1, { message: "Publisher is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  pdfFile: typeof window !== "undefined" ? z
    .instanceof(File, {
      message: "Profile picture must be a valid file",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Profile picture must be an image file",
    })
    .nullable().optional()
    : z.any().nullable().optional(),
  fileSize: z.coerce.number().optional(),
  fileFormat: z.string().default("PDF"),
  // thumbnailUrl: z.string().min(1, { message: "Thumbnail URL is required" }),
  language: z.string().default("English"),
  pages: z.coerce.number().optional(),
  publishedAt: z.date().optional(),
  available: z.boolean().default(true),
})

type BookFormValues = z.infer<typeof bookFormSchema>

interface BookFormProps {
  authors: { id: string; name: string }[]
  publishers: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  initialData?: BookFormValues & { id: string }
}

export default function BookForm({
  authors: initialAuthors,
  publishers: initialPublishers,
  // categories: initialCategories,
  initialData,
}: BookFormProps) {

  const router = useRouter()
  // const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // State for dialog visibility
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false)
  const [publisherDialogOpen, setPublisherDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)

  // State for dynamic options

  // const [categories, setCategories] = useState(initialCategories)

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      isbn: "",
      authorId: "",
      publisherId: "",
      categoryId: "",
      pdfFile: "",
      fileSize: undefined,
      // fileFormat: "PDF",
      // thumbnailUrl: "",
      language: "English",
      // pages: undefined,
      publishedAt: undefined,
      available: true,
    },
  })

  async function onSubmit(data: BookFormValues) {
    setIsLoading(true)

    try {
      console.log(data)
      // const url = initialData ? `/api/books/${initialData.id}` : "/api/books"

      // const method = initialData ? "PATCH" : "POST"

      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to save book")
      // }

      // const book = await response.json()

      // toast({
      //   title: initialData ? "Book updated" : "Book created",
      //   description: initialData
      //     ? "The book has been updated successfully."
      //     : "The book has been created successfully.",
      // })

      // router.push(`/books/${book.id}`)
      // router.refresh()

    } catch (error) {
      console.error(error)
      // toast({
      //   title: "Error",
      //   description: "An error occurred while saving the book.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }


  const dispatch = useDispatch()
  const limit = 10; // Number of items to load per page

  // categories query 
  const { page: catePage, hasMore: CateHasMore } = useSelector((state: RootState) => state.pagination.PaginationCategory);
  const { data: categories, isLoading: isLoadingCategories, isFetching: isFetchingCate } = useGetCategoriesQuery({ pgnum: catePage, pgsize: limit });
  const loadMoreCate = () => {

    if (!isFetchingCate && categories.hasMore) {
      dispatch(setPostsPagination({ page: catePage + 1, hasMore: CateHasMore }));
    }
  }


  // author query 
  const { page: AuthorPages, hasMore: AuthorHasMore } = useSelector((state: RootState) => state.pagination.PaginationCategory);
  const { data: Authors, isLoading: isLoadingAuthor, isFetching: isFetchingAuthor } = useGetAuthorsQuery({ pgnum: AuthorPages, pgsize: limit });
  const loadMoreAuthor = () => {
    if (!isFetchingAuthor && Authors.hasMore) {
      dispatch(setPostsPagination({ page: AuthorPages + 1, hasMore: AuthorHasMore }));
    }
  }

  // publisher query 
  const { page: publisherPages, hasMore: publisherHasMore } = useSelector((state: RootState) => state.pagination.PaginationCategory);
  const { data: publisher, isLoading: isLoadingpublisher, isFetching: isFetchingpublisher } = useGetPublisherQuery({ pgnum: publisherPages, pgsize: limit });
  const loadMorePublisher = () => {
    if (!isFetchingpublisher && publisher.hasMore) {
      dispatch(setPostsPagination({ page: publisherPages + 1, hasMore: publisherHasMore }));
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} disabled={isLoading} className="min-h-32 res" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className=" cursor-not-allowed flex gap-1 -mt-1 justify-start flex-col items-start w-full">
                  <span className="text-xs">
                    Pages
                  </span>
                  <div className="text-muted-foreground w-full  border-muted-foreground rounded-md pl-3 border-1 p-1 mt-1">
                    {
                      form.getValues("pages")
                    }
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Publication Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" cursor-not-allowed flex gap-1 -mt-1 justify-start flex-col items-start w-full">
                <span className="text-xs">
                  File Format
                </span>
                <div className="text-primary-foreground w-full  border-muted-foreground bg-muted-foreground  rounded-md pl-3 border-1 p-1 mt-1">
                  pdf
                </div>
              </div>

              {/* Thumbnail Upload */}
              {/* <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Cover</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept="image/jpeg,image/png,image/gif"
                        maxSize={5 * 1024 * 1024} // 5MB
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>Upload a cover image for the book (JPG, PNG or GIF, max 5MB)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="space-y-6">
              <div className="w-full flex justify-start items-end gap-2">
                <InfiniteScrollSelect
                label="Author"
                  control={form.control}
                  name="authorId"
                  isLoading={isLoadingAuthor}
                  categories={Authors?.data || []}
                  loadMore={loadMoreAuthor}
                  hasMore={Authors?.hasMore}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setAuthorDialogOpen(true)}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-full flex justify-start items-end gap-2">
              <InfiniteScrollSelect
                  label="Publisher"
                  control={form.control}
                  name="publisherId"
                  isLoading={isLoadingpublisher}
                  categories={publisher?.data || []}
                  loadMore={loadMorePublisher}
                  hasMore={publisher?.hasMore}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setPublisherDialogOpen(true)}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-full flex justify-start items-end gap-2">
                {/* <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Category</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <InfiniteScrollSelect
                label="Category"
                  control={form.control}
                  name="categoryId"
                  isLoading={isLoadingCategories}
                  categories={categories?.data || []}
                  loadMore={loadMoreCate}
                  hasMore={categories?.hasMore}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setCategoryDialogOpen(true)}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* PDF File Upload */}
              <FormField
                control={form.control}
                name="pdfFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book File</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept="application/pdf"
                        maxSize={50 * 1024 * 1024} // 50MB
                        value={field.value}
                        onChange={field.onChange}
                        onSizeChange={(size) => form.setValue("fileSize", size)}
                        onPagesChange={(pages) => form.setValue("pages", pages)}
                        disabled={isLoading}
                        isPdf={true}
                      />
                    </FormControl>
                    <FormDescription>Upload the PDF file of the book (max 50MB)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="fileFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Format</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="EPUB">EPUB</SelectItem>
                        <SelectItem value="MOBI">MOBI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Available</FormLabel>
                      <FormDescription>Mark this book as available in the library</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Book" : "Create Book"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialogs for creating new entities */}
      <AuthorDialog 
      open={authorDialogOpen}
       onOpenChange={setAuthorDialogOpen}
        // onAuthorCreated={handleAuthorCreated}
         />

      <PublisherDialog
        open={publisherDialogOpen}
        onOpenChange={setPublisherDialogOpen}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      // onCategoryCreated={handleCategoryCreated}
      />
    </>
  )
}