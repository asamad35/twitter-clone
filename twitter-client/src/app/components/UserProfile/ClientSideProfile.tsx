'use client'
import React from 'react'
import { useCurrentUser } from '../../../../hooks/user'
import { Tweet, User } from '../../../../gql/graphql'
import { BsArrowLeftShort } from 'react-icons/bs'
import Image from 'next/image'
import FeedCard from '../FeedCard'

const ClientSideProfile = ({ userInfo }: { userInfo: User }) => {
    const { user: currentUser } = useCurrentUser()
    return (
        <div>
            <div>
                <nav className='border flex items-center gap-3 px-3'>
                    <BsArrowLeftShort className="text-4xl" />
                    <div>
                        <h1 className="text-xl font-bold">Abdus Samad</h1>
                        <h1 className="text-md font-bold text-slate-500">100 Tweets</h1>
                    </div>
                </nav>
                <div className='p-4 border-b border-slate-800'>
                    {userInfo?.profileImageURL && <Image src={userInfo?.profileImageURL} className='rounded-full' height={100} width={100} alt='user-iamge' />}
                    <h1 className="text-xl font-bold mt-5">Abdus Samad</h1>
                </div>
                <div>
                    {userInfo?.tweets?.map((tweet) => tweet ? <FeedCard data={tweet as Tweet} key={tweet.id} /> : null)}
                </div>
            </div>
        </div>
    )
}

export default ClientSideProfile