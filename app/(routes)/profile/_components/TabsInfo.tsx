
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ProfilePicture } from "@prisma/client"
import MainInfoEdit from "./EditProfileComp"
import { ProfileWithPic } from "@/Types"

              
export function TabsInfo( {
    blurProfile ,
  profileData   
}  :{
        profileData: ProfileWithPic | null
    
    blurProfile : ProfilePicture | null
}) {
    return (
        <Tabs defaultValue="mainInfo" className="w-[100%]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger className="" value="mainInfo">Main info</TabsTrigger>
                {/* <TabsTrigger value="contactInfo">Contact info </TabsTrigger> */}
                <TabsTrigger value="securityInfo">Security info</TabsTrigger>
            </TabsList>
            <TabsContent  value="mainInfo" className="p-2 h-full mt-3">
              
                <MainInfoEdit
                profileData={profileData}

                // editStatus={false}
                blurProfile={blurProfile}
                />

          

            </TabsContent>
            <TabsContent value="securityInfo">



{/* <BookForm
  authors={mockAuthors}
  publishers={mockPublishers}
  categories={mockCategories}
  initialData={mockInitialData} // Optional, remove for create form
/> */}
           
            </TabsContent>
        </Tabs>
    )
}
