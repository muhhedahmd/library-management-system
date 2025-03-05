import { z } from "zod";

export const ProfileSchema =  z.object({
    name: z
    .string()
    .min(4, "First name is required")
    .optional(),
 
    bio: z.string().optional(),
    removeProfilePic : z.enum(["keep" , "update"  ,"remove"]).optional(), 
    // location : z.string().optional(),
    profile_picture:  typeof window !== "undefined" ? z
      .instanceof(File, {
        message: "Profile picture must be a valid file",
      })
      .refine((file) => file.type.startsWith("image/"), {
        message: "Profile picture must be an image file",
      })
      .nullable()
      .optional() : z.any().nullable().optional(),  
    birthdate: z.preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val);
      }
    }, z.date({ message: "Invalid birthdate" })),
    PhoneNumber: z
      .string()
      // .min(11, { message: "the phone number must be 11" })
      .optional()
      ,
    title: z
      .string()
     
      .optional(),
    website: z
      .record(z.string(), z.string().url("Website must be a valid URL"))
      .optional(),
  });
  