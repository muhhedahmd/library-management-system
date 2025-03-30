import prisma from "@/lib/prisma";
import {
    CloudinaryUploadResponse,
    deleteCloudinaryAsset,
    generateBlurhash,
    Upload_coludnairy,
} from "@/lib/Cloudinary";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { CustomSession, ProfileWithPic } from "@/Types";

export const PUT = async (
    req: Request,

) => {

    const session = (await getServerSession(authOptions)) as CustomSession;
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();

    // Extract form data
    const bio = formData.get("bio") as string;
    const birthdate = formData.get("birthdate") as string;
    const phoneNumber = formData.get("PhoneNumber")?.toString() || null ;
    const profile_picture = formData.get("profile_picture") as File;
    const websiteValue = formData.get("website") as string;
    const title = formData.get("title") as string;

    // Find user and profile in parallel
    const [selectUser, findUserProfile] = await Promise.all([
        prisma.user.findFirst({ where: { id: userId } }),
        prisma.profile.findUnique({ where: { userId: userId } }),
    ]);

    // Check if user exists
    if (!selectUser) {
        return NextResponse.json(
            { message: "This user does not exist" },
            { status: 400 }
        );
    }

    const uploadImage = async (file: File, username: string) => {
        if (!file) return { status: 200, data: null };
        try {
            const data = await Upload_coludnairy(file, username);
            return { status: 200, data: data as CloudinaryUploadResponse };
        } catch (error) {
            console.error("Image upload failed:", error);
            return { status: 500, data: null };
        }
    };

    // Check for existing profile pictures
    const existingProfilePic = await prisma.profilePicture.findFirst({
        where: {
            profile: {
                userId: userId,
            },
        },
    });

    // Prepare variables for new URLs

    let profilePictureRes;

    // Update cover picture if it exists and a new one is provided



    if (existingProfilePic && profile_picture) {
        await deleteCloudinaryAsset(existingProfilePic.profileId);
        profilePictureRes = await uploadImage(
            profile_picture,
            selectUser.email
        );
    } else {
        profilePictureRes = await uploadImage(profile_picture, selectUser.email + "Profile");
    }



    try {
        // Prepare profile data
        const profileData = {
            bio: bio || findUserProfile?.bio || "",
            birthdate: birthdate
                ? new Date(birthdate).toISOString()
                : findUserProfile?.birthdate || "",

            userId: userId,

            phoneNumber: phoneNumber &&phoneNumber   || findUserProfile?.phoneNumber || "",

            website: websiteValue
                ? JSON.parse(websiteValue)
                : findUserProfile?.website || {},
            title: title || findUserProfile?.title || "",
        };

        // Upsert profile data
        const updateProfile = await prisma.profile.upsert({
            where: { userId: userId },
            update: { ...profileData   },
            include: {
                profilePictures: true
            },
            create: { ...profileData },
        }) as ProfileWithPic

        // Function to save profile pictures
        const saveProfilePicture = async (
            imageRes: CloudinaryUploadResponse,
            updateProfileId: string
        ) => {
            const blurhash = await generateBlurhash(
                imageRes.eager[0].url,
                imageRes.eager[0].width,
                imageRes.eager[0].height
            );

            // Check if the profile picture already exists
            const existingProfilePicture = await prisma.profilePicture.findFirst({
                where: {
                    profile: {
                        id: updateProfileId
                    }

                    // profileId: updateProfileId,


                },
            });

            const data = {
                profileId: updateProfileId,
                format: imageRes.type,
                secureUrl: imageRes.secure_url,
                publicId: imageRes.public_id,
                displayName: imageRes.display_name,
                assetFolder: imageRes.asset_folder,
                // secure_url: imageRes.secure_url,
                tags: imageRes.tags,
                assetId: imageRes.public_id,
                height: imageRes.height,
                width: imageRes.width,
                url: imageRes.secure_url,
                HashBlur: blurhash,
            };

            if (existingProfilePicture) {
                // Update existing profile picture
                await prisma.profilePicture.update({
                    where: {
                        id: existingProfilePicture.id,
                    },
                    data,
                });
            } else {
                // Create a new profile picture
                await prisma.profilePicture.create({
                    data: {
                        profileId: updateProfileId,
                        format: imageRes.type,
                        secureUrl: imageRes.secure_url,
                        publicId: imageRes.public_id,
                        displayName: imageRes.display_name,
                        assetFolder: imageRes.asset_folder,
                        // secure_url: imageRes.secure_url,
                        tags: imageRes.tags,
                        assetId: imageRes.public_id,
                        height: imageRes.height,
                        width: imageRes.width,
                        url: imageRes.secure_url,
                        hashBlur: blurhash,
                        publicUrl: imageRes.secure_url
                    },
                });
            }
        };

        if (profilePictureRes?.data && updateProfile) {
            await Promise.all([
                profile_picture
                    ? saveProfilePicture(
                        profilePictureRes?.data,
                        updateProfile.id
                    )
                    : Promise.resolve(),

            ]);
        }
        return NextResponse.json(
            updateProfile,
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json(
            { message: "Failed to update profile", formData },
            { status: 500 }
        );
    }
};
