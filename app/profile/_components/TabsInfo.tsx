
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ProfilePicture } from "@prisma/client"
import MainInfoEdit from "./EditProfileComp"
import { ProfileWithPic } from "@/Types"
import BookForm from "./BookActions/BookForm"
import BooksPage from "./BookActions/BookManage"

            // Mock data for BookForm component
            const mockAuthors = [
                { id: "author1", name: "J.K. Rowling" },
                { id: "author2", name: "George R.R. Martin" },
                { id: "author3", name: "Stephen King" },
                { id: "author4", name: "Jane Austen" },
                { id: "author5", name: "Ernest Hemingway" },
              ];
              
              const mockPublishers = [
                { id: "pub1", name: "Penguin Random House" },
                { id: "pub2", name: "HarperCollins" },
                { id: "pub3", name: "Simon & Schuster" },
                { id: "pub4", name: "Macmillan Publishers" },
                { id: "pub5", name: "Oxford University Press" },
              ];
              
              const mockCategories = [
                { id: "cat1", name: "Fiction" },
                { id: "cat2", name: "Science Fiction" },
                { id: "cat3", name: "Mystery" },
                { id: "cat4", name: "Biography" },
                { id: "cat5", name: "History" },
                { id: "cat6", name: "Self-Help" },
              ];
              
              // Optional mock initial data (for edit form)
              const mockInitialData = {
                id: "book123",
                title: "The Great Gatsby",
                description: "A novel by F. Scott Fitzgerald. It follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
                isbn: "9780743273565",
                authorId: "author5", // Ernest Hemingway
                publisherId: "pub1", // Penguin Random House
                categoryId: "cat1", // Fiction
                fileUrl: "https://example.com/books/great-gatsby.pdf",
                fileSize: 3500000, // 3.5 MB
                fileFormat: "PDF",
                thumbnailUrl: "https://example.com/covers/great-gatsby.jpg",
                language: "English",
                pages: 180,
                publishedAt: new Date("1925-04-10"),
                available: true,
              };
              
export function TabsInfo( {
    blurProfile ,
  profileData   
}  :{
        profileData: ProfileWithPic | undefined
    
    blurProfile : ProfilePicture | null
}) {
    return (
        <Tabs defaultValue="mainInfo" className="w-[100%]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger className="" value="mainInfo">Main info</TabsTrigger>
                {/* <TabsTrigger value="contactInfo">Contact info </TabsTrigger> */}
                <TabsTrigger value="securityInfo">Security info</TabsTrigger>
            </TabsList>
            <TabsContent  value="mainInfo" className="h-full mt-3">
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
