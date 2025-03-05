import { GENDER, UserRole } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

type ProfilePicture = {
    id: string;
    url: string;
    publicId: string;
    assetId: string;
    width: number;
    height: number;
    format: string;
    createdAt: Date;
    updatedAt: Date;
    secureUrl: string;
    publicUrl: string;
    assetFolder: string;
    displayName: string;
    tags: string[];
    hashBlur: string;
    profileId: string;
    website: JsonValue;
}

export type ProfileWithPic = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string | null;
    userId: string;
    bio: string | null;
    phoneNumber: string | null;
    isVerified: boolean;
    birthdate: Date | null;
    profilePictures : ProfilePicture[]
    website: JsonValue;
    user :{
        id :string
    }
}

export interface CustomSession {
    user: {
        createdAt:Date ,
        updatedAt :Date,
        id: string;
        name?: string | null;
        email?: string | null;
        Role :UserRole ,
        Gender :GENDER
        Profile : ProfileWithPic[]
       
    };
}
export type UserData =  {
    createdAt:Date ,
    updatedAt :Date,
    id: string;
    name?: string | null;
    email?: string | null;
    Role :UserRole ,
    Gender :GENDER
    Profile : ProfileWithPic[],
    user :{
        id :string
    }

}