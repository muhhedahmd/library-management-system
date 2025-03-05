"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isLoading, userResponse } from "@/store/Reducers/MainUserSlice"
import { CircleUser, LoaderCircle, LogOut, Settings, UserCircle } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useSelector } from "react-redux"
export function DropdownMenuDemo() {
  const CachedUser = useSelector(userResponse)
  const IsLoading = useSelector(isLoading)
  if(IsLoading ){
    return<div className="flex justify-center p-4 bg-primary items-center">
      <LoaderCircle
      className="w-4 h-4 animate-spin"
      />
    </div>
  }
  if(!CachedUser){
    return<div>

      <Button>
        <Link href={"auth/signin"}>
        Log in
        </Link>
      </Button>
    </div>
  }

  return (
    <div className="flex justify-start items-center ">
   {
    CachedUser &&
      <p>

      Hello ,{CachedUser.name}
      </ p>
      }
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <button   className=" min-w-max min-h-max hover:bg-secondary p-2  pt-2 pb-2  rounded-lg transition-all border-none outline-none  border-white  " >
            <CircleUser className="w-6 h-6 font-normal"  />
        </button>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem >

            <Link className="w-full" href={`/profile/${CachedUser.id}`}>
            Profile
            </Link>
            <DropdownMenuShortcut><UserCircle className="w-4 h-4"/></DropdownMenuShortcut>
          </DropdownMenuItem>
   
          <DropdownMenuItem>
            <Link className="w-full" href={"/profile?=Settings"}>
            Settings
            </Link>
            <DropdownMenuShortcut><Settings className="w-4 h-4"/></DropdownMenuShortcut>
          </DropdownMenuItem>
       
        </DropdownMenuGroup> 
        <DropdownMenuSeparator />
  
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        {/* <DropdownMenuItem disabled>API</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem

                    onClick={()=>signOut()}
                    className="w-full hover:bg-secondary transition-all"

        >
            <Button

            className="hover:bg-primary"
            variant={"ghost"}
            >

         
          Log out
            </Button>
          <DropdownMenuShortcut>
            <LogOut/>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
 
  )
}
