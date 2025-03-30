import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, BookOpen, Calendar, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useGetReadersOfBookQuery, useReadingTimeOfBookQuery } from "@/store/QueriesApi/booksApi"
import { useSelector } from "react-redux"
import { isLoading, userResponse } from "@/store/Reducers/MainUserSlice"
import { BooksRes, ReadingHistoryForBook } from "@/Types"
import Link from "next/link"


export default function ReadingHistoryCard({
  book
}: {
  book: BooksRes
}) {
  const { data: readingHistorys  , 
    isLoading: isReadingHistoryLoading
  } = useGetReadersOfBookQuery({
    bookId: book?.id,
  })
  const { data: readingHistory,
    isLoading: isReadingTimeLoading
  } = useReadingTimeOfBookQuery({
    bookId: book?.id,
  })

  const user = useSelector(userResponse)
  const IsLoading = useSelector(isLoading)

  if (isReadingTimeLoading
    || IsLoading || isReadingHistoryLoading) {

    return <div className="flex items-center justify-center h-full">
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>

  }

  // Get user profile picture if available
  const profilePicture = user.profile?.profilePictures?.[0]?.url

  // Calculate initials for avatar fallback
  const initials = user?.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  console.log({ readingHistorys })

  return (
    <Card>
      <CardContent className="p-4">

        {
          book?.purchase?.[0] && readingHistory ?
            <div className="flex items-start gap-4">

              <Avatar>
                <AvatarImage src={profilePicture} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <a href={`/users/${user.id}`} className="font-medium hover:underline">
                    {user.name}
                  </a>
                  <span className="text-xs text-muted-foreground">
                    {readingHistory.lastReadAt && formatDistanceToNow(new Date(readingHistory.lastReadAt), { addSuffix: true })}
                  </span>
                </div>

                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Started {readingHistory.startedAt && new Date(readingHistory.startedAt).toLocaleDateString()}</span>
                  </div>

                  {readingHistory.completed ? (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Completed {readingHistory.finishedAt && new Date(readingHistory.finishedAt).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Reading progress</span>
                        <span className="font-medium">In progress</span>
                      </div>
                      <Progress value={readingHistory.pagesRead / (+ book?.pages || 1) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{readingHistory.pagesRead} pages read</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{readingHistory.readingTimeMinutes} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">You are not purchased this book yet.</p>
            </div>
        }

      </CardContent>
      {/*  mow previow the book readers */}


      <div className="flex flex-col gap-4">
        {readingHistorys && readingHistorys?.map((history_reader) => (
        <ReadingHistoryCardReaders key={history_reader.id} book={book}   history_reader={history_reader}/>
        ))}
      </div>

    </Card>
  )
}


const ReadingHistoryCardReaders = ({
  history_reader ,
  book
}: {
  history_reader: ReadingHistoryForBook,
  book: BooksRes
}) => {

  return     <CardContent className="p-4">
        
        {
           history_reader ?
            <div className="flex items-start gap-4">

              <Avatar>
                <AvatarImage src={history_reader.user.profile?.profilePictures?.[0]?.url} alt={history_reader.user.name} />
                <AvatarFallback>{history_reader.user.name?.split(" ")?.[0]?.[0]?.toUpperCase() + history_reader.user.name?.split(" ")?.[1]?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Link href={`/users/${history_reader.user.id}`} className="font-medium hover:underline">
                      {history_reader.user.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {history_reader.lastReadAt && formatDistanceToNow(new Date(history_reader.lastReadAt), { addSuffix: true })}
                  </span>
                </div>

                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Started {history_reader.startedAt && new Date(history_reader.startedAt).toLocaleDateString()}</span>
                  </div>

                  {history_reader.completed ? (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Completed {history_reader.finishedAt && new Date(history_reader.finishedAt).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Reading progress</span>
                        <span className="font-medium">In progress</span>
                      </div>
                      <Progress value={history_reader.pagesRead / (+ book?.pages || 1) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{history_reader.pagesRead} pages read</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{history_reader.readingTimeMinutes} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">You are not purchased this book yet.</p>
            </div>
        }

      </CardContent>
}

