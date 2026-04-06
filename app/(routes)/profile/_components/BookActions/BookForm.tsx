"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import FileUploadMultiImages from "@/app/_components/FileUploadMultiImages"
import NesteedinfintyScrollerSelect from "@/app/_components/nesteedinfintyScrollerSelect"
import { useCreateBookMutation } from "@/store/QueriesApi/booksApi"
import { toast } from "sonner"
import { encode } from "blurhash"
import * as pdfjsLib from "pdfjs-dist"
import type { Author, Publisher } from "@prisma/client"
import type { categoryWithchildren } from "@/Types"

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

// ── Schema ──────────────────────────────────────────────────────────────────

const bookFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  isbn: z.string().min(1, { message: "ISBN is required" }),
  authorId: z.string().min(1, { message: "Author is required" }),
  publisherId: z.string().min(1, { message: "Publisher is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  language: z.string().default("English"),
  publishedAt: z.date().optional(),
  pdfFile: z
    .instanceof(File)
    .refine((f) => f.type === "application/pdf", { message: "Must be a PDF" })
    .optional(),
  fileSize: z.coerce.number().min(1, { message: "File size required" }),
  fileFormat: z.string().min(1, { message: "File format required" }),
  pages: z.coerce.number().min(1, { message: "Pages must be at least 1" }),
  price: z.coerce.number({ message: "Price is required" }).min(1, { message: "Price must be at least $1" }),
  available: z.boolean().default(true),
  coverImages: z
    .array(z.instanceof(File).refine((f) => f.type.startsWith("image/"), { message: "Must be an image" }))
    .optional(),
})

type BookFormValues = z.infer<typeof bookFormSchema>

// ── Props ────────────────────────────────────────────────────────────────────

interface BookFormProps {
  isLoadingAuthor: boolean
  Authors: { hasMore: boolean; data: Author[] } | undefined
  loadMoreAuthor: () => void
  isLoadingpublisher: boolean
  publisher: { hasMore: boolean; data: Publisher[] } | undefined
  loadMorePublisher: () => void
  isLoadingCategories: boolean
  categories: { hasMore: boolean; data: categoryWithchildren[] } | undefined
  loadMoreCate: () => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function calculatePdfPages(file: File): Promise<number> {
  try {
    const buffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
    return pdf.numPages
  } catch {
    return 0
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const byteStr = atob(dataUrl.split(",")[1])
  const mime = dataUrl.split(",")[0].split(":")[1].split(";")[0]
  const ab = new ArrayBuffer(byteStr.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i)
  return new Blob([ab], { type: mime })
}

async function generatePdfThumbnail(file: File): Promise<{ blob: Blob; url: string } | null> {
  try {
    const buffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 1.5 })

    const canvas = document.createElement("canvas")
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext("2d")!

    await page.render({ canvasContext: ctx, viewport }).promise

    const dataUrl = canvas.toDataURL("image/png")
    const blob = dataUrlToBlob(dataUrl)
    return { blob, url: URL.createObjectURL(blob) }
  } catch {
    return null
  }
}

async function encodeImageBlurHash(image: File): Promise<{ hash: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    const url = URL.createObjectURL(image)
    img.src = url

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)
      const { data } = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
      const hash = encode(data, img.naturalWidth, img.naturalHeight, 4, 4)
      resolve({ hash, width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
  })
}

// ── Component ────────────────────────────────────────────────────────────────

export default function BookForm({
  Authors,
  categories,
  isLoadingAuthor,
  isLoadingCategories,
  isLoadingpublisher,
  loadMoreAuthor,
  loadMoreCate,
  publisher,
  loadMorePublisher,
}: BookFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [authorDialogOpen, setAuthorDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [publisherDialogOpen, setPublisherDialogOpen] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("")
  const previewUrlRef = useRef<string | null>(null)

  const [createBook] = useCreateBookMutation()

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
      coverImages: [],
    },
  })

  // Clean up blob url on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const handlePdfChange = useCallback(
    async (file: File | null) => {
      form.setValue("pdfFile", file ?? undefined)

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
        setPdfPreviewUrl("")
      }

      if (!file) return

      const [pages, thumb] = await Promise.all([
        calculatePdfPages(file),
        generatePdfThumbnail(file),
      ])

      if (pages) form.setValue("pages", pages)
      if (thumb) {
        previewUrlRef.current = thumb.url
        setPdfPreviewUrl(thumb.url)
      }
    },
    [form]
  )

  async function onSubmit(data: BookFormValues) {
    const valid = await form.trigger()
    if (!valid) return

    startTransition(async () => {
      try {
        const fd = new FormData()

        // Scalar fields
        fd.append("title", data.title)
        fd.append("description", data.description ?? "")
        fd.append("isbn", data.isbn)
        fd.append("authorId", data.authorId)
        fd.append("publisherId", data.publisherId)
        fd.append("categoryId", data.categoryId)
        fd.append("language", data.language)
        fd.append("pages", data.pages.toString())
        fd.append("fileSize", data.fileSize.toString())
        fd.append("fileFormat", data.fileFormat)
        fd.append("price", formatCurrency(+data.price))
        fd.append("available", data.available ? "1" : "0")
        fd.append("num-book-covers", (data.coverImages?.length ?? 0).toString())
        if (data.publishedAt) fd.append("publishedAt", data.publishedAt.toISOString())

        // PDF + thumbnail
        if (data.pdfFile) {
          fd.append("pdfFile", data.pdfFile)
          const thumb = await generatePdfThumbnail(data.pdfFile)
          if (thumb?.blob) {
            fd.append(
              "thumbnail",
              new File([thumb.blob], `${data.pdfFile.name}-thumbnail.png`, { type: "image/png" })
            )
          }
        }

        // Cover images + blurhash (all concurrent)
        if (data.coverImages?.length) {
          await Promise.all(
            data.coverImages.map(async (img, i) => {
              fd.append(`cover-images-${i}`, img)
              const { hash, width, height } = await encodeImageBlurHash(img)
              fd.append(`cover-images-hash-${i}`, hash)
              fd.append(`cover-images-info-${i}`, JSON.stringify({ width, height }))
            })
          )
        }

        const result = await createBook({
          formData: fd,
        }).unwrap()

        toast.success("Book created!", {
          description: `"${data.title}" has been added to the library.`,
        })

        // ── Redirect to the new book's page ──────────────────────────────────
        router.push(`/books/${result.id}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong"
        toast.error("Failed to create book", { description: msg })
      }
    })
  }

  const isSubmitting = isPending

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ── Column 1: Text fields ── */}
            <div className="space-y-6">
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value ?? ""} className="min-h-32" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <InfiniteScrollSelect
                  label="Language"
                  control={form.control}
                  name="language"
                  isLoading={false}
                  categories={languages ?? []}
                  loadMore={() => { }}
                  hasMore={false}
                  country
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Pages — read-only, auto-calculated from PDF */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium">Pages</span>
                  <div className="text-muted-foreground border border-muted-foreground rounded-md px-3 py-1.5 mt-1 text-sm">
                    {form.watch("pages")}
                  </div>
                </div>

                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Publication Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                            disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File format — static, always PDF */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium">File Format</span>
                <div className="bg-muted text-muted-foreground rounded-md px-3 py-1.5 mt-1 text-sm">pdf</div>
              </div>

              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Math.max(0, +e.target.value))}
                        value={field.value ?? 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── Column 2: File uploads + availability ── */}
            <div className="space-y-6">
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="coverImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Images</FormLabel>
                    <FormControl>
                      <FileUploadMultiImages
                        value={field.value}
                        accept="image/*"
                        maxSize={5 * 1024 * 1024}
                        multiple
                        onChange={(files) => form.setValue("coverImages", files)}
                      />
                    </FormControl>
                    <FormDescription>JPG, PNG or GIF — max 5MB each</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="pdfFile"
                render={({ }) => (
                  <FormItem>
                    <FormLabel>Book File (PDF)</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept="application/pdf"
                        maxSize={50 * 1024 * 1024}
                        previewThumbnail={pdfPreviewUrl}
                        onChange={handlePdfChange}
                        onSizeChange={(size) => form.setValue("fileSize", Math.round((size / (1024 * 1024)) * 100) / 100)}
                        onPagesChange={(pages) => form.setValue("pages", pages)}
                        isPdf
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Max 50MB — page count is auto-detected</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isSubmitting}
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

            {/* ── Column 3: Author / Publisher / Category selects ── */}
            <div className="space-y-6">
              <div className="flex w-full items-end gap-2">
                <InfiniteScrollSelect
                  label="Author"
                  control={form.control}
                  name="authorId"
                  isLoading={isLoadingAuthor}
                  categories={Authors?.data ?? []}
                  loadMore={loadMoreAuthor}
                  hasMore={Authors?.hasMore ?? false}
                />
                <Button type="button" size="icon" variant="outline" onClick={() => setAuthorDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex w-full items-end gap-2">
                <InfiniteScrollSelect
                  label="Publisher"
                  control={form.control}
                  name="publisherId"
                  isLoading={isLoadingpublisher}
                  categories={publisher?.data ?? []}
                  loadMore={loadMorePublisher}
                  hasMore={publisher?.hasMore ?? false}
                />
                <Button type="button" size="icon" variant="outline" onClick={() => setPublisherDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex w-full items-end gap-2">
                <NesteedinfintyScrollerSelect
                  label="Category"
                  control={form.control}
                  name="categoryId"
                  isLoading={isLoadingCategories}
                  categories={categories?.data ?? []}
                  loadMore={loadMoreCate}
                  hasMore={categories?.hasMore ?? false}
                />
                <Button type="button" size="icon" variant="outline" onClick={() => setCategoryDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Book"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <AuthorDialog open={authorDialogOpen} onOpenChange={setAuthorDialogOpen} />
      <PublisherDialog open={publisherDialogOpen} onOpenChange={setPublisherDialogOpen} />
      <CategoryDialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen} />
    </>
  )
}