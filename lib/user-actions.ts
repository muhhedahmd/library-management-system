"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOption"
import { revalidatePath } from "next/cache"
import { CustomSession, UserData } from "@/Types"

export async function updateUser(userData: {
  id: string
  name?: string
  email?: string
  // other fields
}) {
  try {
    // Get the current session to verify the user
    const session = await getServerSession(authOptions) as CustomSession

    if (!session || session.user.id !== userData.id) {
      throw new Error("Unauthorized")
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/${userData.id}`, {
      method: "PUT",
   
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error("Failed to update user")
    }

    const updatedUser = await response.json() as UserData


    // Revalidate any paths that show user data
    revalidatePath("/profile")
    revalidatePath("/dashboard")

    return updatedUser
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

