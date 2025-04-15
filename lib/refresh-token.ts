// "use server"

// import { JWT } from "next-auth/jwt";

// import { UserData } from "@/Types"
// import { cookies } from "next/headers"

// // Function to refresh token on the server
// export async function refreshUserToken(userId: string) {
//   try {
//     // Call your authentication API to get a new token
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users/${userId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     })

//     if (!response.ok) {
//       throw new Error("Failed to refresh token")
//     }

//     const { token } = await response.json() as UserData

//     // Set the new token in a cookie
    
//     (await cookies()).set("next-auth.session-token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//     })

//     return token
//   } catch (error) {
//     console.error("Error refreshing token:", error)
//     throw error
//   }
// }


// const refreshAccessToken = async (token: JWT) => {
//     try {
//         const url = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT + "/oauth/refresh_token";
//       const res = await fetch(url, {
//         method: "POST",
//         credentials: "include",
//         headers: { "x-refetch-token": String(token.refreshToken) },
//       });
  
//       const data = await res.json();
//       if (!res.ok) throw data;
  
//       return {
//         ...token,
//         accessToken: data.accessToken?.token,
//         refreshToken: data.refreshToken?.token ?? token.refreshToken,
//         exp: (data.accessToken?.expirationDate || 0) / 1000,
//       };
//     } catch (error) {
//         console.error("Error refreshing token:", error)
//       return { ...token, error: "RefreshAccessTokenError" };
//     }
//   };
  