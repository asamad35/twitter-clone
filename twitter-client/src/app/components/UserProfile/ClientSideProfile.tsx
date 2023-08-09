'use client'
import React, { useCallback, useMemo } from 'react'
import { useCurrentUser } from '../../../../hooks/user'
import { Tweet, User } from '../../../../gql/graphql'
import { BsArrowLeftShort } from 'react-icons/bs'
import Image from 'next/image'
import FeedCard from '../FeedCard'
import { graphql } from '../../../../gql'
import { graphqlClient } from '../../../../client/api'
import { followUserMutation, unfollowUserMutation } from '../../../../graphql/mutation/user'
import { useQueryClient } from '@tanstack/react-query'

const ClientSideProfile = ({ userInfo }: { userInfo: User }) => {
    const { user: currentUser } = useCurrentUser()
    const queryClient = useQueryClient()

    const amIFollowing = useMemo(() => {
        return ((currentUser?.followings?.findIndex((el) => el?.id === userInfo?.id)) ?? -1 < 0 ? false : true)
    }, [currentUser?.followings, userInfo?.id])

    const handleFollowUser = useCallback(async () => {
        if (!userInfo?.id) return
        await graphqlClient.request(followUserMutation, { to: userInfo.id })
        await queryClient.invalidateQueries(["current-user"])

    }, [queryClient, userInfo.id])

    const handleIUnfollowUser = useCallback(async () => {
        if (!userInfo?.id) return
        await graphqlClient.request(unfollowUserMutation, { to: userInfo.id })
        await queryClient.invalidateQueries(["current-user"])
    }, [queryClient, userInfo.id])

    console.log({ amIFollowing })
    return (
        <div>
            <div>
                <nav className='border flex items-center gap-3 px-3'>
                    <BsArrowLeftShort className="text-4xl" />
                    <div>
                        <h1 className="text-xl font-bold">{userInfo.firstname} {userInfo.lastname}</h1>
                        <h1 className="text-md font-bold text-slate-500">{userInfo.tweets?.length} Tweets</h1>
                    </div>
                </nav>
                <div className='p-4 border-b border-slate-800'>
                    {userInfo?.profileImageURL && <Image src={userInfo?.profileImageURL} className='rounded-full' height={100} width={100} alt='user-iamge' />}
                    <h1 className="text-xl font-bold mt-5">{userInfo.firstname} {userInfo.lastname}</h1>
                    <div className="flex justify-between items-center">
                        <div className='flex text-sm mt-2 gap-4 text-gray-400'>
                            <span>{userInfo.followers?.length} followers</span>
                            <span>{userInfo.followings?.length} following</span>
                        </div>
                        {currentUser?.id !== userInfo.id &&
                            <>
                                {amIFollowing ?
                                    <button className="bg-white text-black text-sm font-semibold px-3 py-1 rounded-full"
                                        onClick={handleIUnfollowUser}
                                    >Unfollow</button>
                                    :
                                    <button className="bg-white text-black text-sm font-semibold px-3 py-1 rounded-full"
                                        onClick={handleFollowUser}
                                    >Follow</button>
                                }

                            </>
                        }
                    </div>
                </div>
                <div>
                    {userInfo?.tweets?.map((tweet) => tweet ? <FeedCard data={tweet as Tweet} key={tweet.id} /> : null)}
                </div>
            </div>
        </div>
    )
}

export default ClientSideProfile