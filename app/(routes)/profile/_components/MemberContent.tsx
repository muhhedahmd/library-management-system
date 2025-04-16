import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import UserPreferences from "./memberContentComp/UserPreferences";
import { useRouter } from "next/navigation";
import MemberDashboard from "./MemberDashboard";


export default function MemberContent({ userId , mainUser}: { 
  books?: { title: string; author: string; returnDate: string }[]
  ,userId:string   , 
  mainUser:boolean
}) {

  const router= useRouter()

  
  
  return (
      <>
       
       {
        mainUser
        &&<MemberDashboard userId={userId}/>
       }
        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
            <CardDescription>Your favorite genres and authors</CardDescription>
          </CardHeader>
          <CardContent>
          <UserPreferences userId={userId}/>
 
          </CardContent>
          
          <CardFooter>
          {
            mainUser &&
            <Button
            onClick={()=>router.push(`/profile/${userId}/perferances`)}
            variant="outline" className="w-full">
              Update Preferences
            </Button>
            }
          </CardFooter>
        </Card>

</>
    )
  }
  

