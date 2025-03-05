import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {  BookOpen} from "lucide-react";
import Link from "next/link"


export default function MemberContent({ books }: { books: { title: string; author: string; returnDate: string }[] }) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Currently Borrowed Books</CardTitle>
            <CardDescription >Books you currently have checked out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books.map((book, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{book.title}</p>
                      <p className="text-xs text-muted-foreground">by {book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Due {book.returnDate}</Badge>
                    <Button variant="ghost" size="sm" className="mt-1">
                      Renew
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Borrowing History
            </Button>
          </CardFooter>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle>Reading Preferences</CardTitle>
            <CardDescription>Your favorite genres and authors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Science Fiction</Badge>
                  <Badge>Mystery</Badge>
                  <Badge>Biography</Badge>
                  <Badge>Non-fiction</Badge>
                  <Badge>Fantasy</Badge>
                </div>
              </div>
  
              <div>
                <h3 className="text-sm font-medium mb-2">Favorite Authors</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Andy Weir</Badge>
                  <Badge variant="outline">Agatha Christie</Badge>
                  <Badge variant="outline">James Clear</Badge>
                  <Badge variant="outline">J.K. Rowling</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Update Preferences
            </Button>
          </CardFooter>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
            <CardDescription>Based on your reading history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Recommended Book #{i}</p>
                    <p className="text-xs text-muted-foreground">Author Name</p>
                    <div className="mt-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        Reserve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    )
  }
  