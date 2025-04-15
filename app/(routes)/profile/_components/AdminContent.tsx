
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import Dashboard from "./AdminDashboard";
import UserPreferences from "./memberContentComp/UserPreferences";
import { useRouter } from "next/navigation";

export default function AdminContent({
  userId,
  
}: {
  userId: string,
  setOpenManageBooks?: React.Dispatch<React.SetStateAction<boolean>>
}) {

  const  router = useRouter()
  return (
    <>
        <Dashboard
      />
    <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
            <CardDescription>Your favorite genres and authors</CardDescription>
          </CardHeader>
          <CardContent>
          <UserPreferences userId={userId}/>
 
          </CardContent>
          <CardFooter>
            <Button 
            onClick={()=>router.push(`/profile/${userId}/perferances`)}
            variant="outline" className="w-full">
              Update Preferences
            </Button>
          </CardFooter>
        </Card>
        <Card>
          
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage library resources and members</CardDescription>
          </CardHeader>
          <CardContent>
    
          </CardContent>
        </Card>
  


    </>
  )
}
