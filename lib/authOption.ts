import { AuthOptions } from "next-auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "sigin",
      name: "Sign In",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const env = process.env.NEXT_PUBLIC_API!
       
          const response = await axios.post(
            `${env}api/users/Login`,
            credentials,
          );

          if (response.status === 200) {
            // console.log("Response Data:", response.data);
            return response.data;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error : any)  {
          console.log(error)

          // throw new Error(
          //   JSON.stringify({
          //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
          //     errors: error.response.data as unknown as any ,
          //     status: 400,
          //     ok: false,
          //   })
          // )
          //   console.log(error.response.data)

          // return null

        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "signup",
      name: "Sign Up",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        role: { label: "role", type: "text" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: Record<string, any> | undefined) {
        console.log("credentials next auth", credentials);
        if (!credentials) return

        const env = process.env.NEXT_PUBLIC_API!

        try {
          const response = await axios.post(
            `${env}api/users/signup`,
            credentials,
            {
              headers: {
                // "Content-Type": "application/x-www-form-urlencoded", 
              },
            }
          );

          if (response.status === 201) {
            console.log("Response Data:", response.data);
            return response.data;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw new Error(
            JSON.stringify({
              errors: error.response.data,
              status: 400,
              ok: false,
            })
          )
        }

        return null;
      },
    }),
  ],

  jwt: {
    async encode({ secret, token }) {
      return jwt.sign(token!, secret);
    },
    async decode({ secret, token }) {
      const decodedToken = jwt.verify(token!, secret) as JwtPayload;
      // console.log('Decoded token:', decodedToken);
      return decodedToken;
    },

    secret: process.env.JWT_SECRET!,
  },
  callbacks: {
    async jwt({ token, user  ,trigger , session}) {
      // console.log("User Data in JWT:", user, token); // Debug log
     
      if (trigger === "update" && session) {
        // Update the token with new data
        console.log("Session Data in JWT:", {session , token} , session.user);
        return { ...session}
      }

      return { ...token, ...user };
    },
    async session({ session, token, }) {
      // console.log("Session Token:", token, session, user); // Debug log
      session.user = token;
      return session;
    },
    async redirect({ baseUrl }) {
      // console.log(url, baseUrl);
      // Redirect users to the home page after sign in/sign up
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
    newUser: "/signup",
    signOut: "/signout",
    error: "/error",
  },

  secret: process.env.NEXTAUTH_SECRET!,
};
