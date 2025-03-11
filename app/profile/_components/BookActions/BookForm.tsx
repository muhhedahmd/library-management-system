"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn, formatCurrency, languages } from "@/lib/utils"
import { FileUpload } from "@/app/_comonents/FileUploade"
import { AuthorDialog } from "./Dialog/AuthorCreation"
import { PublisherDialog } from "./Dialog/PublisherCreation"
import { CategoryDialog } from "./Dialog/CategoryDialog"
import InfiniteScrollSelect from "@/app/_comonents/InfintyScrollerSelect"
import { useGetCategoriesQuery } from "@/store/QueriesApi/categoryApi"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { setPostsPagination } from "@/store/Slices/paggnitionSlice"
import { useGetAuthorsQuery } from "@/store/QueriesApi/authorApi"
import { useGetPublisherQuery } from "@/store/QueriesApi/publisherApi"

import * as pdfjsLib from "pdfjs-dist"
import { createCanvas } from "canvas"
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

// Define the form schema
const bookFormSchema = z.object({
  // Required fields
  title: z.string().min(1, { message: "Title is required" }),
  isbn: z.string().min(1, { message: "ISBN is required" }),
  authorId: z.string().min(1, { message: "Author is required" }),
  publisherId: z.string().min(1, { message: "Publisher is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),

  // Optional fields
  description: z.string().optional(),
  language: z.string().default("English"),
  publishedAt: z.date().optional(),

  // File-related fields
  pdfFile: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "File must be a valid PDF",
    })
    .optional(),
  fileSize: z.coerce.number().min(1, { message: "File size must be at least 1 byte" }),
  fileFormat: z.string().min(1, { message: "File format is required" }),

  // Numeric fields
  pages: z.coerce.number().min(1, { message: "Pages must be at least 1" }),
  price: z.coerce
    .number({ message: "Price is required" })
    .min(1, { message: "Price must be at least $1" }),

  // Boolean field with default value
  available: z.boolean().default(true),
});


type BookFormValues = z.infer<typeof bookFormSchema>

interface BookFormProps {
  authors: { id: string; name: string }[]
  publishers: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  initialData?: BookFormValues & { id: string }
}

export default function BookForm({
  // categories: initialCategories,
  initialData,
}: BookFormProps) {
  const router = useRouter()
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isbn: "",
      authorId: "",
      publisherId: "",
      categoryId: "",
      pdfFile: null,
      fileSize: 20,
      pages: 200,
      fileFormat: "pdf",
      price: 0,
      language: "English",
      publishedAt: undefined,
      available: true,
    },
  })
  // const { toast } = useToast()
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [publisherDialogOpen, setPublisherDialogOpen] = useState(false)

  const [preview, setPreviw] = useState("")
  // State for dialog visibility

  const dataURLToBlob = (dataURL: string): Blob => {
    // Convert base64/URLEncoded data component to raw binary data
    const byteString = atob(dataURL.split(",")[1])
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0]

    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  const generatePdfThumbnail = useCallback(async (pdf: Buffer) => {


    const fileBuffer = pdf

    // Create a PDF document from the buffer
    try {
      const loadingTask = pdfjsLib.getDocument({ data: fileBuffer })
      const pdfDocument = await loadingTask.promise

      // Get the first page of the PDF
      const page = await pdfDocument.getPage(1)

      // Set up the canvas context for rendering
      const canvas = createCanvas(200, 200)
      const context = canvas.getContext("2d")
      const viewport = page.getViewport({ scale: 1.5 }) // Set the scale for rendering

      // Set the canvas dimensions
      canvas.width = viewport.width
      canvas.height = viewport.height

      // Render the page into the canvas context
      const renderContext = {
        canvasContext: context! as unknown as CanvasRenderingContext2D,
        viewport: viewport,
      }

      await page.render(renderContext).promise

      const dataURL = canvas.toDataURL("image/png")
      const pdfThumbnailBlob = dataURLToBlob(dataURL)

      // Create a blob URL
      const blobUrl = URL.createObjectURL(pdfThumbnailBlob)
      return { pdfThumbnailBlob, blobUrl }
    } catch (error) {
      console.error("Error rendering PDF:", error)
    }
  }, [])

  const calculatePdfPages = useCallback(async (file: File): Promise<number> => {
    try {
      const fileBuffer = await file.arrayBuffer()
      const pdfBuffer = Buffer.from(fileBuffer)

      const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer })
      const pdfDocument = await loadingTask.promise

      // Get the total number of pages
      const pageCount = pdfDocument.numPages
      return pageCount
    } catch (error) {
      console.error("Error calculating PDF pages:", error)
      return 0
    }
  }, [])

  useEffect(() => {
    const pdfFile = form.getValues("pdfFile") as File
    if (!pdfFile) return

    let blobUrl: string | null = null;
    console.log("Downloading")
     const AddPreviw = async () => {


        try {
          const fileBuffer = await pdfFile.arrayBuffer()
          const pdfBuffer = Buffer.from(fileBuffer)
          const getThumbnail = await generatePdfThumbnail(pdfBuffer)
          console.log(getThumbnail)
          if(getThumbnail.blobUrl) {
            blobUrl = getThumbnail.blobUrl
            setPreviw(getThumbnail.blobUrl)
          }
        } catch (error) {
          console.error("Error generating thumbnail:", error)
        }
      }
      AddPreviw()
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl) // Clean up the Blob URL
      }
    }
  }, [form, generatePdfThumbnail])

  // State for dynamic options

  // const [categories, setCategories] = useState(initialCategories)

  async function onSubmit(data: BookFormValues) {
  // const fields = [
  //   "title",
  //   "description",
  //   "isbn",
  //   "authorId",
  //   "publisherId",
  //   "categoryId",
  //   "language",
  //   "pages",
  //   "fileSize",
  //   "fileFormat",
  //   "price",
  //   "available",
  //   "publishedAt",
  //   "pdfFile",
  // ];

  // fields.forEach((field) => {
  //   const fieldState = form.getFieldState(field );
  //   console.log(`Field: ${field}`, {
  //     isDirty: fieldState.isDirty,
  //     isTouched: fieldState.isTouched,
  //     error: fieldState.error,
  //   });
  // });

  // Log all validation errors
  console.log("Form validation errors:", form.formState.errors);

  // Log all dirty fields
  console.log("Dirty fields:", form.formState.dirtyFields);


    if (!(await form.trigger())) return

    const formData = new FormData()

    // Append all form fields to FormData
    formData.append("title", data.title)
    formData.append("description", data.description || "")
    formData.append("isbn", data.isbn)
    formData.append("authorId", data.authorId)
    formData.append("publisherId", data.publisherId)
    formData.append("categoryId", data.categoryId)
    formData.append("language", data.language)
    formData.append("pages", data.pages.toString())
    formData.append("fileSize", data.fileSize.toString())
    formData.append("fileFormat", data.fileFormat)
    formData.append("price",  formatCurrency(+data.price.toString()))
    formData.append("available", data.available.toString())

    if (data.publishedAt) {
      formData.append("publishedAt", data.publishedAt.toISOString())
    }

    try {
      const fileData = data.pdfFile as File
      if (fileData && fileData.type === "application/pdf") {
        console.log("Processing PDF file:", fileData.name)
        formData.append("pdfFile", fileData)

        const fileBuffer = await fileData.arrayBuffer()
        const pdfBuffer = Buffer.from(fileBuffer)

        // Generate the PDF thumbnail
        const pdfThumbnail = await generatePdfThumbnail(pdfBuffer)

        if (pdfThumbnail?.pdfThumbnailBlob) {
          // Convert the Blob to a File object
          const thumbnailFile = new File([pdfThumbnail.pdfThumbnailBlob], `${fileData.name}-thumbnail.png`, {
            type: "image/png",
          })
        

          // Append the thumbnail file to FormData
          formData.append("thumbnail", thumbnailFile)

        }
      }

      // Log the FormData for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`)
      }

  

      console.log("Form submitted successfully")
    } catch (error) {
      console.error("Error processing PDF or submitting form:", error)
      // Handle the error (e.g., show a toast notification)
    }
  }

  const dispatch = useDispatch()
  const limit = 10 // Number of items to load per page

  // categories query
  const { page: catePage, hasMore: CateHasMore } = useSelector(
    (state: RootState) => state.pagination.PaginationCategory,
  )
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isFetching: isFetchingCate,
  } = useGetCategoriesQuery({ pgnum: catePage, pgsize: limit })
  const loadMoreCate = () => {
    if (!isFetchingCate && categories.hasMore) {
      dispatch(setPostsPagination({ page: catePage + 1, hasMore: CateHasMore }))
    }
  }

  // author query
  const { page: AuthorPages, hasMore: AuthorHasMore } = useSelector(
    (state: RootState) => state.pagination.PaginationCategory,
  )
  const {
    data: Authors,
    isLoading: isLoadingAuthor,
    isFetching: isFetchingAuthor,
  } = useGetAuthorsQuery({ pgnum: AuthorPages, pgsize: limit })
  const loadMoreAuthor = () => {
    if (!isFetchingAuthor && Authors.hasMore) {
      dispatch(setPostsPagination({ page: AuthorPages + 1, hasMore: AuthorHasMore }))
    }
  }

  // publisher query
  const { page: publisherPages, hasMore: publisherHasMore } = useSelector(
    (state: RootState) => state.pagination.PaginationCategory,
  )
  const {
    data: publisher,
    isLoading: isLoadingpublisher,
    isFetching: isFetchingpublisher,
  } = useGetPublisherQuery({ pgnum: publisherPages, pgsize: limit })
  const loadMorePublisher = () => {
    if (!isFetchingpublisher && publisher.hasMore) {
      dispatch(setPostsPagination({ page: publisherPages + 1, hasMore: publisherHasMore }))
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} value={field.value || ""} className="min-h-32 res" />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InfiniteScrollSelect
                  label="language"
                  control={form.control}
                  name="language"
                  isLoading={isLoadingAuthor}
                  categories={languages || []}
                  loadMore={loadMoreAuthor}
                  hasMore={Authors?.hasMore}
                  country={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className=" cursor-not-allowed flex gap-1 -mt-1 justify-start flex-col items-start w-full">
                  <span className="text-xs">Pages</span>
                  <div className="text-muted-foreground w-full  border-muted-foreground rounded-md pl-3 border-1 p-1 mt-1">
                    {form.getValues("pages")}
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
                <span className="text-xs">File Format</span>
                <div className="text-primary-foreground w-full  border-muted-foreground bg-muted-foreground  rounded-md pl-3 border-1 p-1 mt-1">
                  pdf
                </div>
              </div>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const price = e.target.value
                          field.onChange(Math.max(0, +price))
                          // field.onChange(Math.max(0, field.value))
                        }}
                        value={field.value || 0} // Ensure the value is always defined
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

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
                <Button type="button" size="icon" variant="outline" onClick={() => setAuthorDialogOpen(true)}>
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
                <Button type="button" size="icon" variant="outline" onClick={() => setPublisherDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-full flex justify-start items-end gap-2">
                <InfiniteScrollSelect
                  label="Category"
                  control={form.control}
                  name="categoryId"
                  isLoading={isLoadingCategories}
                  categories={categories?.data || []}
                  loadMore={loadMoreCate}
                  hasMore={categories?.hasMore}
                />
                <Button type="button" size="icon" variant="outline" onClick={() => setCategoryDialogOpen(true)}>
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
                        previewThumbnail={preview}
                        onChange={async (file) => {
                          field.onChange(file)
                          if (file && file.type === "application/pdf") {
                            const pageCount = await calculatePdfPages(file)
                            form.setValue("pages", pageCount)
                          }
                        }}
                        onSizeChange={(size) => {
                          // Convert bytes to MB and round to 2 decimal places
                          const sizeInMB = Math.round((size / (1024 * 1024)) * 100) / 100
                          form.setValue("fileSize", sizeInMB)
                        }}
                        onPagesChange={(pages) => form.setValue("pages", pages)}
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => onSubmit(form.getValues())}>
              {/* {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
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

      <PublisherDialog open={publisherDialogOpen} onOpenChange={setPublisherDialogOpen} />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      // onCategoryCreated={handleCategoryCreated}
      />
    </>
  )
}

