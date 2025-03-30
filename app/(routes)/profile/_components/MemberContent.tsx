import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {  BookOpen} from "lucide-react";
import UserPreferences from "./memberContentComp/UserPreferences";


export default function MemberContent({ userId , mainUser}: { 
  books?: { title: string; author: string; returnDate: string }[]
  ,userId:string   , 
  mainUser:boolean
}) {


  
  
  return (
      <>
        {/* <Card>

          <CardContent>
            <div className="space-y-4">
              {books?.map((book, index) => (

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
   */}
        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
            <CardDescription>Your favorite genres and authors</CardDescription>
          </CardHeader>
          <CardContent>
          <UserPreferences userId={userId}/>
 
          </CardContent>
          <CardFooter>
            <Button disabled variant="outline" className="w-full">
              Update Preferences
            </Button>
          </CardFooter>
        </Card>
        {mainUser 
        ?
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
        :
        null
       
        }
</>
    )
  }
  