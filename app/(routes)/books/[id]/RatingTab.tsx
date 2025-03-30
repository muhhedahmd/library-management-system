import { StarRating } from '@/app/(routes)/starRatting/starRatting'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { useAddBookRatingMutation, useBookRatingOfUSerQuery } from '@/store/QueriesApi/booksApi'
import { BooksRes } from '@/Types'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Send, Users, Edit2 } from 'lucide-react'
import React, { useState } from 'react'

const RatingTab = ({
    book
}: {
    book: BooksRes
}) => {
    const {
        data: DataGetRatingForU,
        isLoading: isLoadingGetRatingForU,
        isFetching: isFetchingGetRatingForU
    } = useBookRatingOfUSerQuery({
        bookId: book.id
    })

    const [AddBookRating, {
        isLoading: isLoadingAddBookRating,
        // isFetching: isFetchingAddBookRating
    }] = useAddBookRatingMutation()

    const [review, setReview] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editedReview, setEditedReview] = useState("")
    const [editedRating, setEditedRating] = useState(0)

    console.log(DataGetRatingForU)
    const changeRating = (rating: number) => {
        setEditedRating(rating)
    }

    const handleSubmitRating = async () => {
        try {
            await AddBookRating({
                bookId: book.id,
                rating: editedRating,
                review: review
            }).unwrap()
            setReview("")
        } catch (error) {
            console.error("Failed to add rating:", error)
        }
    }

    const handleEditRating = async () => {
        try {
            await AddBookRating({
                bookId: book.id,
                rating: editedRating,
                review: editedReview
            }).unwrap()
            setIsEditing(false)
        } catch (error) {
            console.error("Failed to update rating:", error)
        }
    }

    return (
        <TabsContent value='ratings'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-xl font-semibold mb-2">Rating and Reviews</h2>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className='flex items-center mb-2 gap-2 justify-start'>
                        <p className="font-semibold">Total Rating</p>
                        <Badge className='flex items-center gap-2'>
                            <p>{book.averageRating}</p>
                            <Users className='h-4 w-4' />
                        </Badge>
                    </div>

                    {isLoadingGetRatingForU || isFetchingGetRatingForU && <RatingForULoader />}
                    {(!isLoadingGetRatingForU || !isFetchingGetRatingForU) && DataGetRatingForU?.rating ? (
                        isEditing ? (
                            <div className='flex flex-col gap-4'>
                                <div className='relative w-3/4'>
                                    <Input
                                        value={editedReview}
                                        onChange={(e) => setEditedReview(e.target.value)}
                                        placeholder='Edit your review'
                                        defaultValue={DataGetRatingForU.review}
                                    />
                                </div>
                                <StarRating
                                    onChange={changeRating}
                                    initialRating={DataGetRatingForU.rating}
                                    size={25}
                                />
                                <div className='flex gap-2'>
                                    <Button onClick={handleEditRating} disabled={isLoadingAddBookRating}>
                                        Save Changes
                                    </Button>
                                    <Button variant='outline' onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center justify-between'>

                                    <div className='flex items-center gap-2'>
                                        <Avatar
                                            className='w-10 h-10'
                                        >
                                            <AvatarImage src={DataGetRatingForU.user.profile.profilePictures[0].secureUrl || ""} />
                                            <AvatarFallback>
                                                {DataGetRatingForU.user.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='flex flex-col '>
                                            <div className='flex items-center gap-2'>
                                                <p className='text-sm font-semibold'>{DataGetRatingForU.user.name}</p>
                                                <Badge variant='outline'>
                                                    {DataGetRatingForU.user.role}
                                                </Badge>
                                                <Badge>
                                                    {"You"}
                                                </Badge>
                                            </div>
                                            <div
                                                className='flex items-center gap-2'
                                            >

                                                <p className='text-sm '>{DataGetRatingForU.review}</p>

                                                <div className='flex items-center gap-2'>

                                                    <StarRating
                                                        readonly
                                                        initialRating={DataGetRatingForU.rating}
                                                        size={15}
                                                    />

                                                </div>
                                                <span className="text-sm"> {new Date(DataGetRatingForU.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                    </div>

                                    <Button variant='ghost' onClick={() => {
                                        setIsEditing(true)
                                        setEditedReview(DataGetRatingForU.review)
                                        setEditedRating(DataGetRatingForU.rating)
                                    }}>
                                        <Edit2 className='h-4 w-4 mr-2' />
                                        Edit
                                    </Button>
                                </div>
                                <Separator />
                            </div>
                        )
                    ) : (
                        <div className='flex items-center gap-2'>
                            <div className='relative w-3/4'>
                                <Input
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder='Add a review'
                                />
                                <Button
                                    variant='outline'
                                    className='absolute right-0 top-0'
                                    onClick={handleSubmitRating}
                                    disabled={isLoadingAddBookRating}
                                >
                                    <Send className='h-4 w-4' />
                                </Button>
                            </div>
                            <StarRating
                                onChange={changeRating}
                                initialRating={0}
                                size={25}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default RatingTab

const RatingForULoader = () => {
    return <div>
        {/* Add loading spinner or skeleton here */}
    </div>
}