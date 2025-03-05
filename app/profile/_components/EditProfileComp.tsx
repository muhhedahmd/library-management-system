import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfilePicture } from '@prisma/client';
import { Briefcase, Calendar, Earth, Edit, FileText, Loader2, Pencil, Phone, PlusCircle, Trash, User2, UserCircle2, UserPenIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm, FormProvider } from 'react-hook-form'; // Import FormProvider
import { useSelector } from 'react-redux';
import { ProfileWithPic } from '@/Types';
import useImageFile from '@/hooks/useImageData';
import EditableField from '@/app/_comonents/EditableField';
import { ProfileSchema } from '@/app/_comonents/ZodScheams';
import { userResponse } from '@/store/Reducers/MainUserSlice';
import CropperModal from '@/app/_comonents/cropSingle';
import PhotoViewrComp from '@/app/_comonents/PhotoViewr';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AutocompleteMultiValue from '@/app/_comonents/AutoCompleteMulti';
import { useUpdateProfileMutation } from '@/store/QueriesApi/ProfileQuery';
import { toast } from 'sonner';

const MainInfoEdit = ({
    blurProfile,
    profileData,
}: {
    profileData: ProfileWithPic | undefined;
    blurProfile: ProfilePicture | null;
}) => {
    
    const CachedUser = useSelector(userResponse)!;

    const methods = useForm<typeof ProfileSchema._type>({
        defaultValues: {
            bio: profileData?.title || "",
            profile_picture: null,
            name: CachedUser?.name || "",
            PhoneNumber: profileData?.phoneNumber || "",
            title: profileData?.title || "",
            removeProfilePic: "keep",
            birthdate: profileData?.birthdate ? new Date(profileData.birthdate) : new Date(),
            website: profileData?.website as object || {} || undefined,
        },
        resolver: zodResolver(ProfileSchema), // Add Zod resolver for validation
    });

    const {  formState: { }, control, setValue, getValues, trigger } = methods;
    const [editProfile, {
        isLoading: editStatus,
    }] = useUpdateProfileMutation()
    const [blurProfileToUpdate, setBlurProfileToUpdate] = useState<ProfilePicture | null>(null);
    const [openDilogCropProfile, SetopenDilogCropProfile] = useState<boolean>(false);
    const [croppedImageProfile, setCroppedImageProfile] = useState<File | null>(null);

    useEffect(() => {
        setBlurProfileToUpdate(blurProfile || null);
    }, [blurProfile]);

    const { dimensions: CoverDimantionNew, isLoading: isLoadingProfile, url: urlProfilenew, blurHash: blurHashProfileNew } = useImageFile(getValues("profile_picture"));

    const ProfilePicInputRef = useRef<HTMLInputElement>(null);

    const ProfileButtonClick = () => {
        ProfilePicInputRef.current?.click();
    };

    const onSubmit = async () => {
        const data = getValues()
        if (await trigger()) {
            try {
                const formData = new FormData();

                Object.keys(data).forEach((key) => {
                    const value = data[key as keyof typeof data];
                    if (typeof value === "object" && key !== "profile_picture" && key !== "birthdate") {
                        formData.append(key, JSON.stringify(value));
                    } else if (value instanceof File) {
                        console.log(value)
                        formData.append(key, value);
                    } else if (value !== null && value !== undefined) {
                        formData.append(key, String(value));
                    }
                });


                editProfile(formData).then((res) => {
                    console.log({ res })
                    toast("Profile Updated" ,{
                    style :{
                        background : ""
                    },
                    className:"bg-emerald-500",
                    //   title: ,
                      description: "Your profile has been updated successfully.",
                    //   variant: "success",

                    })

                }
                ).catch(() => {
                    toast( "Error",{
                      description: "There was an error updating your profile.",
                        className : "bg-destructive"
                    })
                })
                //   Router.push("/maintimeline")

                //   console.log(status);

            } catch (error) {
                console.log(error)

            }
        }

    };


    return (
        <FormProvider {...methods}>

            <form onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}>
                <div className=" grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col w-full justify-start items-start gap-2 md:gap-1">

                        <div className="flex justify-start font-medium items-center gap-2">
                            <UserCircle2 size={18} className="" />
                            <p className="text-sm font-[500] flex items-center gap-2">Profile picture</p>
                        </div>
                        <div className="relative w-full flex justify-start items-center gap-4">
                            {getValues("profile_picture") ? (
                                isLoadingProfile ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                    <PhotoViewrComp
                                        className="w-20 rounded-full shadow-md h-20 bg-gray-400"
                                        height={CoverDimantionNew?.height || 80}
                                        imageUrl={urlProfilenew || "/placeholder.svg"}
                                        width={CoverDimantionNew?.width || 80}
                                        alt="Profile Picture"
                                        blurhash={blurHashProfileNew || ""}
                                    />
                                )
                            ) : blurProfileToUpdate ? (
                                <PhotoViewrComp
                                    className="w-20 rounded-full shadow-md h-20 bg-primary"
                                    height={blurProfileToUpdate?.height || 80}
                                    imageUrl={blurProfileToUpdate?.secureUrl || "/placeholder.svg"}
                                    width={blurProfileToUpdate?.width || 80}
                                    alt="Profile Picture"
                                    blurhash={blurProfileToUpdate?.hashBlur || ""}
                                />
                            ) : (
                                <div className="w-20 h-20 flex justify-center items-center shadow-sm border-2 border-gray-300 bg-primary rounded-full">
                                    <User2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}

                            <Input
                                type="file"
                                className="hidden"
                                id="profilePic"
                                ref={ProfilePicInputRef}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setValue("profile_picture", file);
                                        SetopenDilogCropProfile(true);
                                    }
                                }}
                            />
                            <Button size="icon" variant="outline" onClick={ProfileButtonClick}>
                                {blurProfileToUpdate ? (
                                    <Pencil className="w-5 h-5 text-green-600" />
                                ) : (
                                    <PlusCircle className="w-6 h-6 text-blue-600" />
                                )}
                            </Button>

                            {getValues("profile_picture") && (
                                <Button onClick={() => SetopenDilogCropProfile(true)} variant={"outline"}>
                                    <Edit className="w-6 h-6 text-amber-600" />
                                </Button>
                            )}

                            <Button
                                size="icon"
                                onClick={() => {
                                    setValue("profile_picture", null);
                                    setValue("removeProfilePic", "remove");
                                    setBlurProfileToUpdate(null);
                                }}
                                variant="outline"
                            >
                                <Trash className="w-5 h-5 text-red-700" />
                            </Button>
                        </div>
                    </div>

                    <EditableField editStatus={editStatus} control={control} name="name" icon={<UserPenIcon size={18} />} label="Name" placeholder={CachedUser.name || ""} />

                    <FormField
                        control={control}
                        disabled={editStatus}
                        name="website"
                        render={({  }) => (
                            <FormItem className="w-full">
                                <div className="flex justify-start items-center gap-2">
                                    <Earth size={18} />
                                    <FormLabel>Websites</FormLabel>
                                </div>
                                <FormControl>
                                    <Controller
                                        disabled={editStatus}
                                        name="website"
                                        control={control}
                                        render={({ field }) => (
                                            <AutocompleteMultiValue
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <EditableField editStatus={editStatus} control={control} name="title" icon={<Briefcase size={18} />} label="Title" placeholder={profileData?.title || ""} />
                    <EditableField editStatus={editStatus} control={control} type='text' name="PhoneNumber" icon={<Phone size={18} />} label="Phone Number" placeholder={profileData?.phoneNumber?.toString() || ""} />
                    <EditableField editStatus={editStatus} control={control} name="birthdate" icon={<Calendar size={18} />} label="Birthday" type="date" placeholder={""} />

                    <CropperModal
                        imageFile={ProfilePicInputRef.current?.files?.[0] || null}
                        profile={true}
                        openDialog={openDilogCropProfile}
                        setOpenDialog={SetopenDilogCropProfile}
                        croppedImage={croppedImageProfile}
                        setCroppedImage={setCroppedImageProfile}
                        onCropComplete={(file) => {
                            setValue("profile_picture", file);
                        }}
                    />
                </div>

                <EditableField
                    editStatus={editStatus}
                    control={control}
                    className={"mt-4"}
                    name="bio"
                    icon={<FileText size={18} />}
                    label="Bio"
                    type="textarea"
                    placeholder={profileData?.bio || ""}
                />

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                    <Button type="submit" className='cursor-pointer' onClick={() => onSubmit()} disabled={editStatus}>
                     
                     {
                        editStatus ? 
                        <Loader2 className='animate-spin w-4 h-4'/>
                     :
                        "Save Changes"
                    }
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default MainInfoEdit;