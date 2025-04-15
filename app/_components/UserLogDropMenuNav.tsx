"use client"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isLoading, userResponse } from "@/store/Reducers/MainUserSlice"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { CircleUser, LoaderCircle, LogOut,  UserCircle } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useSelector } from "react-redux"
export function DropdownMenuDemo() {
  const CachedUser = useSelector(userResponse)
  const IsLoading = useSelector(isLoading)
  if (IsLoading) {
    return <div className="flex justify-center p-4 bg-primary items-center">
      <LoaderCircle
        className="w-4 h-4 animate-spin"
      />
    </div>
  }
  if (!CachedUser) {
    return <div>

      <Link href={"/auth/signin"}>
        Log in
      </Link>
    </div>
  }

  return (
    <div className="flex justify-start items-center ">

      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <button className=" min-w-max min-h-max hover:bg-secondary p-2  pt-2 pb-2  rounded-lg transition-all border-none outline-none  border-white  " >
            <Avatar>
              <AvatarImage
              src={CachedUser.profile.profilePictures[0].secureUrl || ""}
              />
              <AvatarFallback>
            <CircleUser className="w-6 h-6 font-normal" />

              </AvatarFallback>
            </Avatar>
            
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
              <DropdownMenuShortcut><UserCircle className="w-4 h-4" /></DropdownMenuShortcut>
            </DropdownMenuItem>

          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem

            onClick={() => signOut()}
            className="w-full hover:bg-secondary transition-all"

          >
            <Button
            size={"sm"}
              className="hover:bg-none p-0"
              variant={"ghost"}
            >


              Log out
            </Button>
            <DropdownMenuShortcut>
              <LogOut />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

  )
}
