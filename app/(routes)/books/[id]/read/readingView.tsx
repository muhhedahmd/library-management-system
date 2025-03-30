"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Book, ReadingHistory } from "@prisma/client"
// import { Document, Page  , } from "@react-pdf/renderer"

import { Document, Outline, Page, pdfjs, } from "react-pdf"
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Bookmark,
  Settings,
  Home,
  Moon,
  Sun,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  X,
  SplitIcon as LayoutSplit,
  LayoutTemplateIcon as LayoutSingle,

  Clock,
  Info,
  BarcodeIcon,

} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PDFDocumentProxy } from "pdfjs-dist"
import { useUpdateReadingTimeMutation } from "@/store/QueriesApi/booksApi"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LibrarySidebar from "@/app/_components/library/library-side-bar"
// import { Toast } from "@/hooks/use-toast"
// import { useToast } from "use-toast"

// Set up the PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

interface PDFReaderProps {
  book: Book & {
    author: { name: string }
    category: { name: string }
    bookCovers: Array<{
      id: string
      fileUrl: string
      type: string
    }>
    readingHistory: ReadingHistory[]
  }
  readingHistory: ReadingHistory | null
  pdfUrl: string
}


export default function PDFReader({ book, readingHistory, pdfUrl }: PDFReaderProps) {
  const router = useRouter()
  //   const toast  = Toast
  const [numPages, setNumPages] = useState<number | null>(0)
  const [currentPage, setCurrentPage] = useState<number>(readingHistory?.pagesRead || 1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [scale, setScale] = useState(1.0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [readingTime, setReadingTime] = useState(0)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [isDoublePage, setIsDoublePage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate progress percentage
  const progressPercentage = numPages ? (currentPage / numPages) * 100 : 0

  // Function to handle successful document loading

  // const outlines = useOutlineContext()
  function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy) {

    setNumPages(numPages)
    setIsLoading(false)


    // Store the document reference
    // if (documentRef.current) {


    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   documentRef.current.getOutline().then((outline: any) => {
    //     if (outline) {
    //       setOutlines(outline)
    //     }
    //   })
    // }

    // Fetch bookmarks for this book
    // fetchBookmarks()
  }

  const [updateReadTime,
    {
      isLoading: isLoadingUpdate
    }
  ] = useUpdateReadingTimeMutation()


  // Fetch bookmarks for this book
  // const fetchBookmarks = async () => {
  //   try {
  //     const response = await fetch(`/api/books/bookmarks?bookId=${book.id}`)
  //     if (response.ok) {
  //       const data = await response.json()
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       setBookmarks(data.bookmarks.map((bookmark: any) => bookmark.pageNumber))
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bookmarks:", error)
  //   }
  // }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }
  // const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = window.addEventListener("resize", () => {
      console.log("resize", window.innerWidth)
      if (window.innerWidth < 768) {
        setIsDoublePage(false)
      } else {
        setIsDoublePage(true)
      }

    })
    return () => {
      window.removeEventListener("resize", () => handleResize)
    }
  }, [])


  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Toggle double page mode
  const togglePageMode = () => {
    setIsDoublePage(!isDoublePage)
  }

  // Change zoom level
  const changeZoom = (newScale: number) => {
    setScale(Math.max(0.5, Math.min(2.0, newScale)))
  }

  // Navigate to previous page
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      const newPage = isDoublePage ? Math.max(1, currentPage - 2) : currentPage - 1
      setCurrentPage(newPage)
    }
  }, [currentPage, isDoublePage])

  // Navigate to next page
  const goToNextPage = useCallback(() => {
    if (numPages && currentPage < numPages) {
      const newPage = isDoublePage ? Math.min(numPages, currentPage + 2) : currentPage + 1
      setCurrentPage(newPage)
    }
  }, [currentPage, isDoublePage, numPages])

  // Jump to specific page
  const jumpToPage = (page: number) => {
    if (numPages && page >= 1 && page <= numPages) {
      setCurrentPage(page)
    }
  }

  // Toggle bookmark for current page
  const toggleBookmark = async () => {
    try {
      if (bookmarks.includes(currentPage)) {
        // Remove bookmark
        const response = await fetch(`/api/books/bookmarks/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId: book.id,
            pageNumber: currentPage,
          }),
        })

        if (response.ok) {
          setBookmarks(bookmarks.filter((page) => page !== currentPage))
          //   toast({
          //     title: "Bookmark removed",
          //     description: `Removed bookmark from page ${currentPage}`,
          //   })
        }
      } else {
        // Add bookmark
        const response = await fetch(`/api/books/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId: book.id,
            pageNumber: currentPage,
          }),
        })

        if (response.ok) {
          setBookmarks([...bookmarks, currentPage])
          //   toast({
          //     title: "Bookmark added",
          //     description: `Added bookmark to page ${currentPage}`,
          //   })
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      //   toast({
      //     title: "Error",
      //     description: "Failed to update bookmark",
      //     variant: "destructive",
      //   })
    }
  }

  // Update reading progress in the database


  // Handle keyboard navigation
  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPreviousPage()
      } else if (e.key === "ArrowRight") {
        goToNextPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [goToNextPage, goToPreviousPage])

  // Track reading time
  useEffect(() => {

    timerRef.current = setInterval(() => {
      setReadingTime((prev) => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])


  const [loadedProgressStatus, setLoaddedProgressStatus] = useState<

    | "loading"
    | "idle"
    | "success"
    | "error"
  >("idle")
  const updateReadingProgress = useCallback(async () => {



    try {
      await updateReadTime({
        bookId: book.id,
        pagesRead: currentPage,
        readingTimeMinutes: Math.floor(readingTime / 60),
        completed: numPages ? currentPage >= numPages : false,
      })
        .unwrap()
        .then(() => {
          if (numPages && currentPage >= numPages) {
            setLoaddedProgressStatus("success")
            toast.success("Congratulations!", {
              description: "You've completed this book!",
            })
          } else {
            setLoaddedProgressStatus("success")
          }
        }).catch(() => {

          setLoaddedProgressStatus("error")
        })
    } catch (error) {
      setLoaddedProgressStatus("error")
      toast.warning("Error!", {
        description: "Failed to update reading progress!",
      })
      console.error("Error updating reading progress:", error)
    } finally {
      setLoaddedProgressStatus("idle")

    }
  }, [book.id, currentPage, numPages, readingTime, updateReadTime])

  // Track if we need to update progress
  const [needsUpdate, setNeedsUpdate] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const prevCurrentPage = useRef(currentPage)
  const prevReadingTime = useRef(readingTime)

  // Check for changes that require an update
  useEffect(() => {
    if (readingHistory?.completed) return
    if (currentPage !== prevCurrentPage.current || readingTime !== prevReadingTime.current) {
      setNeedsUpdate(true)
      prevCurrentPage.current = currentPage
      prevReadingTime.current = readingTime
    }
  }, [currentPage, readingTime, readingHistory])

  // Set up the interval to periodically save progress
  useEffect(() => {
    if (readingHistory?.completed) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up a new interval
    if (intervalRef ) {
      intervalRef.current = setInterval(async () => {

      if (needsUpdate) {
        console.log("Saving reading progress...", { currentPage, readingTime })
        await updateReadingProgress()
        setNeedsUpdate(false)
      }
          
    }, 10000)
  }
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentPage, needsUpdate, readingHistory, readingTime, updateReadingProgress])

  const [ProgressLoading, seProgressLoading] = useState(0)




  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [])

  const averageReadingTime =
    book?.readingHistory?.length > 0
      ? book?.readingHistory.reduce((sum, history) => sum + (history.readingTimeMinutes || 0), 0) /
      book?.readingHistory?.length
      : 0

  return (
    <div
      className={`min-h-screen flex flex-col  bg-secondary w-full `}
    >
      {/* Top navigation bar */}
      <header className={`sticky top-0 z-10 bg-secondary border-b shadow-sm`}>
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className=" block lg:hidden ">

            <Sheet >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <BarcodeIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className=" h-screen" side="left">
                <SheetTitle>

                </SheetTitle>
                <LibrarySidebar sheet   />
              </SheetContent>
            </Sheet>
            </div>
            {/* <BarcodeIco className="h-5 w-5" /> */}
            {/* </Button> */}
            <Button variant="ghost" size="icon" onClick={() => router.push(`/books/${book.id}`)}>
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium truncate max-w-[200px] md:max-w-md">{book.title}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button

              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
              className={bookmarks.includes(currentPage) ? "text-yellow-500" : ""}
            >
              <Bookmark className="h-5 w-5" />
            </Button>

            <Popover>
              <PopoverTrigger>

                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={
                    isLoadingUpdate ? " text-yellow-500"
                      : loadedProgressStatus === "success" ? "text-green-500"
                        : loadedProgressStatus === "error" ? "text-red-500"
                          : "text-gray-400"
                  }
                >
                  <Info className="h-5 w-5" />
                </Button>

              </PopoverTrigger>
              <PopoverContent className=" ">


                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Completion Rate</span>
                      {/* <span className="text-sm font-medium">{completionRate.toFixed(0)}%</span> */}
                    </div>
                    <div className="flex  justify-center items-center gap-3">

                      <Progress color="#0f00f" value={

                        Math.round((readingHistory?.pagesRead || 0 / + (numPages || 0)) * 100)
                      } className="h-2" />

                      <p className="text-sm font-bold">
                        {Math.round((readingHistory?.pagesRead || 0 / + (numPages || 0)) * 100)}%
                      </p>
                    </div>

                  </div>



                  <div className="flex items-center justify-between">

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Reading Time</span>
                    </div>
                    <span className="font-medium">{Math.round(averageReadingTime)} min</span>
                  </div>




                </div>

              </PopoverContent>


            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleDarkMode}>
                  {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="mr-2 h-4 w-4" /> : <Maximize className="mr-2 h-4 w-4" />}
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={togglePageMode}>
                  {isDoublePage ? <LayoutSingle className="mr-2 h-4 w-4" /> : <LayoutSplit className="mr-2 h-4 w-4" />}
                  {isDoublePage ? "Single Page" : "Double Page"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeZoom(scale - 0.1)}>
                  <ZoomOut className="mr-2 h-4 w-4" />
                  Zoom Out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeZoom(scale + 0.1)}>
                  <ZoomIn className="mr-2 h-4 w-4" />
                  Zoom In
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Table of Contents</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    {/* {outlines.length > 0 ? (
                      <div>
                        <h3 className="font-medium mb-2">Chapters</h3>
                        <ul className="space-y-2">
                          {outlines.map((item, index) => (
                            <li key={index}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                onClick={() => {
                                  if (item.dest) {
                                    // Handle PDF destination
                                    const pageNumber =
                                      typeof item.dest === "object"
                                        ? item.dest[0].num
                                        : typeof item.dest === "string"
                                          ? Number.parseInt(item.dest)
                                          : 1

                                    jumpToPage(pageNumber)
                                    setIsMenuOpen(false)
                                  }
                                }}
                              >
                                {item.title}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No table of contents available</p>
                    )} */}

                    {bookmarks.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Bookmarks</h3>
                        <ul className="space-y-2">
                          {bookmarks
                            .sort((a, b) => a - b)
                            .map((page) => (
                              <li key={page}>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    jumpToPage(page)
                                    setIsMenuOpen(false)
                                  }}
                                >
                                  <Bookmark className="mr-2 h-4 w-4 text-yellow-500" />
                                  Page {page}
                                </Button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Reading progress bar */}
        <Progress value={progressPercentage} className="h-1" />
      </header>

      {/* Main content area */}
      <main ref={contentRef} className={`overflow-y-auto bg-secondary`}>
        <div className="container mx-auto px-4 py-2 flex justify-center">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading PDF...

                {ProgressLoading}
              </p>
            </div>
          ) : (

            <Document



              onError={(err) => {
                console.log(err)
              }}
              onLoadError={(errr) => {
                console.log({ errr })
              }}
              file={pdfUrl}
              onLoad={(progressLoading) => {
                seProgressLoading(progressLoading)

              }}
              onLoadSuccess={(doc) => onDocumentLoadSuccess(doc)}
              loading={
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Loading PDF from URL...</p>
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center h-64">
                  <X className="h-12 w-12 text-destructive mb-4" />
                  <p className="text-destructive">Failed to load PDF</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    The PDF could not be loaded from the URL. Please check the URL and try again.
                  </p>
                </div>
              }
              className="flex justify-center"
            // inputRef={documentRef}
            // options={{
            //   cMapUrl: "https://unpkg.com/pdfjs-dist@3.4.120/cmaps/",
            //   cMapPacked: true,
            //   standardFontDataUrl: "https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/",
            // }}
            >

              <Sheet
                open={isMenuOpen} onOpenChange={setIsMenuOpen}>

                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Table of Contents</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <div className="space-y-4 px-6">
                      <h2 className="text-xl">
                        Out lines
                      </h2>
                      <Outline


                        className={" p-3 rounded-md space-y-2  border-2   "}
                        onItemClick={({ pageNumber: itemPageNumber }) => {
                          jumpToPage(itemPageNumber);
                          setIsMenuOpen(false)

                        }}
                      // onClick={(pageNumber) => {
                      //   // console.log(pageNumber)
                      // }}
                      />
                      {bookmarks.length > 0 && (

                        <div>
                          <h3 className="font-medium mb-2">Bookmarks</h3>
                          <ul className="space-y-2">
                            {bookmarks
                              .sort((a, b) => a - b)
                              .map((page) => (
                                <li key={page}>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      jumpToPage(page)
                                      setIsMenuOpen(false)
                                    }}
                                  >
                                    <Bookmark className="mr-2 h-4 w-4 text-yellow-500" />
                                    Page {page}
                                  </Button>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className={`flex ${isDoublePage ? "space-x-2" : " "} w-full`}>

                <Page

                  loading={
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                      <p className="text-muted-foreground">Loading PDF...</p>
                    </div>
                  }
                  pageNumber={currentPage}
                  scale={1.3}
                  _className=""
                  renderTextLayer={false}
                  devicePixelRatio={3}
                  renderAnnotationLayer={true}
                  className={`text-3xl shadow-lg`}
                // _className=""

                />

                {isDoublePage && currentPage < (numPages || 0) && (
                  <Page
                    loading={
                      <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-muted-foreground">Loading PDF...</p>
                      </div>
                    }
                    pageNumber={currentPage + 1}
                    scale={1.3}
                    devicePixelRatio={3}
                    renderTextLayer={false}
                    renderAnnotationLayer={true}
                    className={`shadow-lg bg-secondary`}
                  />
                )}
              </div>
            </Document>
          )}
        </div>
      </main>

      {/* Bottom navigation controls */}
      <footer className={`sticky bottom-0 z-10 bg-secondary  border-t shadow-sm`}>
        <div className="container mx-auto px-4 py-2">

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={goToPreviousPage} disabled={currentPage <= 1}>
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm">
                {isDoublePage
                  ? `Pages ${currentPage}-${Math.min(currentPage + 1, numPages || 0)} of ${numPages}`
                  : `Page ${currentPage} of ${numPages}`}
              </span>
              <div className="w-32 bg-primary rounded-2xl hidden md:block">
                <Slider
                  className="bg-primary/100 rounded-2xl"
                  value={[currentPage]}
                  min={1}
                  max={numPages || 1}
                  step={1}
                  onValueChange={(value) => jumpToPage(value[0])}
                />
              </div>
            </div>

            <Button variant="ghost" onClick={goToNextPage} disabled={!numPages || currentPage >= numPages}>
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </div>

      </footer>

    </div>
  )
}

