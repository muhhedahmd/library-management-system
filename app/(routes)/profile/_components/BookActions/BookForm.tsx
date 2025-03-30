"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn, formatCurrency, languages } from "@/lib/utils"
import { FileUpload } from "@/app/_components/FileUploade"
import { AuthorDialog } from "./Dialog/AuthorCreation"
import { PublisherDialog } from "./Dialog/PublisherCreation"
import { CategoryDialog } from "./Dialog/CategoryDialog"
import InfiniteScrollSelect from "@/app/_components/InfintyScrollerSelect"

import * as pdfjsLib from "pdfjs-dist"
import { createCanvas } from "canvas"
import FileUploadMultiImages from "@/app/_components/FileUploadMultiImages"
import { encode } from "blurhash"
import { useCreateBookMutation } from "@/store/QueriesApi/booksApi"
import NesteedinfintyScrollerSelect from "@/app/_components/nesteedinfintyScrollerSelect"
import { Author, Publisher } from "@prisma/client"
import { categoryWithchildren } from "@/Types"
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
  coverImages: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), {
          message: "File must be a valid image",
        })
    )
    .optional(),
});


type BookFormValues = z.infer<typeof bookFormSchema>

interface BookFormProps {

  
isLoadingAuthor  : boolean
Authors :  {
  hasMore : boolean ,
  data : Author[]
} | undefined
loadMoreAuthor : () =>void
isLoadingpublisher : boolean
publisher :  {
  hasMore : boolean ,
  data : Publisher[]
} | undefined
isLoadingCategories : boolean
categories :  {
  hasMore : boolean ,
  data : categoryWithchildren[]
} | undefined
loadMoreCate : ()=>void ,
loadMorePublisher : ()=>void
}

export default function BookForm({
  Authors ,
  categories ,
  isLoadingAuthor, 
  isLoadingCategories ,
  isLoadingpublisher, 
  loadMoreAuthor ,
  loadMoreCate ,
  publisher ,
  loadMorePublisher

  // categories: initialCategories,

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
      pdfFile: undefined,
      fileSize: 20,
      pages: 200,
      fileFormat: "pdf",
      price: 0,
      language: "English",
      publishedAt: undefined,
      available: true,
      coverImages: []
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

  const [, setPreviewImages] = useState<string[]>([]) // State for image previews

  // Handle image upload and preview
  const handleImageUpload = (files: File[]) => {
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    form.setValue("coverImages", files);
  };

  // Remove an image from the preview and form data


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
        if (!getThumbnail) {
          console.error("Failed to generate thumbnail")
          return
        }
        console.log(getThumbnail)
        if (getThumbnail.blobUrl) {
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
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  // State for dynamic options

  // const [categories, setCategories] = useState(initialCategories)

  const [CreateBooks, {  }] = useCreateBookMutation();

  async function onSubmit(data: BookFormValues) {
    if (!(await form.trigger())) {
      return;
    }
  
    // Log all validation errors
    console.log("Form validation errors:", form.formState.errors);
  
    // Log all dirty fields
    console.log("Dirty fields:", form.formState.dirtyFields);
  
    try {
      setIsLoadingSubmit(true);
  
      const formData = new FormData();
  
      // Append all form fields to FormData
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("isbn", data.isbn);
      formData.append("authorId", data.authorId);
      formData.append("publisherId", data.publisherId);
      formData.append("categoryId", data.categoryId);
      formData.append("language", data.language);
      formData.append("pages", data.pages.toString());
      formData.append("fileSize", data.fileSize.toString());
      formData.append("fileFormat", data.fileFormat);
      formData.append("price", formatCurrency(+data.price.toString()));
      formData.append("available", data.available ? "1" : "0" );
      formData.append("num-book-covers", data.coverImages?.length.toString() || "0");
  
      if (data.publishedAt) {
        formData.append("publishedAt", data.publishedAt.toISOString());
      }
  
      if (data.coverImages) {
        data.coverImages.forEach((file, index) => {
          formData.append(`coverImages[${index}]`, file);
        });
      }
  
      const fileData = data.pdfFile as File;
      if (fileData && fileData.type === "application/pdf") {
        console.log("Processing PDF file:", fileData.name);
        formData.append("pdfFile", fileData);
  
        const fileBuffer = await fileData.arrayBuffer();
        const pdfBuffer = Buffer.from(fileBuffer);
  
        // Generate the PDF thumbnail
        const pdfThumbnail = await generatePdfThumbnail(pdfBuffer);
  
        if (pdfThumbnail?.pdfThumbnailBlob) {
          // Convert the Blob to a File object
          const thumbnailFile = new File([pdfThumbnail.pdfThumbnailBlob], `${fileData.name}-thumbnail.png`, {
            type: "image/png",
          });
  
          // Append the thumbnail file to FormData
          formData.append("thumbnail", thumbnailFile);
        }
      }
      
      // Process cover images concurrently using Promise.all
      const coverImagePromises = data?.coverImages?.map(async (image, i) => {
        formData.append(`cover-images-${i}`, image);

        return new Promise<void>((resolve, reject) => {

          const img = new Image();
          img.crossOrigin = "anonymous";
          const blob = new Blob([image], { type: image.type });
          img.src = URL.createObjectURL(blob);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          img.onload = () => {
            if (!ctx) {
              reject(new Error("Canvas context is not available"));
              return;
            }
  
            // Set dimensions
            const { naturalWidth: width, naturalHeight: height } = img;
  
            // Draw image to canvas
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
  
            // Get image data and generate BlurHash
            const imageData = ctx.getImageData(0, 0, width, height);
            const hash = encode(imageData.data, imageData.width, imageData.height, 4, 4);
  
            formData.append(`cover-images-hash-${i}`, hash);
            formData.append(`cover-images-info-${i}`, JSON.stringify({ width, height }));
  
            resolve();
          };
  
          img.onerror = () => {
            reject(new Error("Failed to load image"));
          };
        });
      });
  
      // Wait for all cover images to be processed
      await Promise.all(coverImagePromises || []);
  
      // Log the FormData for debugging
      for (const [key, value] of Array.from(formData.entries())) {
        console.log(key, value);
      }
  
      // Call the CreateBooks mutation
await CreateBooks(formData).unwrap()
      .then((res)=>{  
        console.log(res)
        // Handle the response (e.g., show a toast notification or redirect to the book details page)
      }).catch((err)=>{
        console.error("err"
        , err
          // Handle the error (e.g., show a toast notification)
        )

        // Handle the error (e.g., show a toast notification)
      })
  
      setIsLoadingSubmit(false);
    } catch (error) {
      setIsLoadingSubmit(false);
      console.error("Error processing PDF or submitting form:", error);
      // Handle the error (e.g., show a toast notification)
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">

              <FormField
                disabled={isLoadingSubmit}
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
                disabled={isLoadingSubmit}
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
                  disabled={isLoadingSubmit}
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
                  hasMore={Authors?.hasMore || false}
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
                  disabled={isLoadingSubmit}
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
                disabled={isLoadingSubmit}
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

             
            </div>
            <div className="space-y-6">

              <FormField
                disabled={isLoadingSubmit}
                control={form.control}
                name="coverImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Cover Images</FormLabel>
                    <FormControl>
                      <FileUploadMultiImages
                        value={field.value}
                        accept="image/*"
                        maxSize={5 * 1024 * 1024} // 5MB
                        multiple // Allow multiple files
                        onChange={(files) => handleImageUpload(files)}

                      />
                    </FormControl>
                    <FormDescription>Upload cover images for the book (JPG, PNG, or GIF, max 5MB each)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                      <FormField
                disabled={isLoadingSubmit}
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



              <FormField
                disabled={isLoadingSubmit}
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


            <div className="space-y-6">
              
              <div className="w-full flex justify-start items-end gap-2">
                <InfiniteScrollSelect
                  label="Author"
                  control={form.control}
                  name="authorId"
                  isLoading={isLoadingAuthor}
                  categories={Authors?.data || []}
                  loadMore={loadMoreAuthor}
                  hasMore={Authors?.hasMore || false}
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
                  hasMore={publisher?.hasMore || false}
                />
                <Button type="button" size="icon" variant="outline" onClick={() => setPublisherDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-full flex justify-start items-end gap-2">
                <NesteedinfintyScrollerSelect
                  label="Category"
                  control={form.control}
                  name="categoryId"
                  isLoading={isLoadingCategories}
                  categories={categories?.data || []}
                  loadMore={loadMoreCate}
                  hasMore={categories?.hasMore || false }
                />
                <Button type="button" size="icon" variant="outline" onClick={() => setCategoryDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* PDF File Upload */}
      
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => onSubmit(form.getValues())}>
              {isLoadingSubmit ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Book"}

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

