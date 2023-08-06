import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React, { useCallback } from 'react'
import { AiOutlineUser } from 'react-icons/ai';
import { BiImageAlt, BiSearch, BiSolidHomeCircle } from 'react-icons/bi';
import { BsBell, BsEnvelope, BsPeople, BsTwitter } from 'react-icons/bs';
import { CiCircleMore } from 'react-icons/ci';
import { LuVerified } from 'react-icons/lu';
import { RiFileListLine } from 'react-icons/ri';
import { Tweet } from '../../../../gql/graphql';
import FeedCard from '../FeedCard';
import { useCurrentUser } from '../../../../hooks/user';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { graphqlClient } from '../../../../client/api';
import { verifyUserGoogleTokenQuery } from '../../../../graphql/query/user';
import { useQueryClient } from '@tanstack/react-query';


interface TwitterSidebarButton {
    title: string,
    icon: React.ReactNode
}

const sidebarItems: TwitterSidebarButton[] = [
    {
        title: 'Home',
        icon: <BiSolidHomeCircle />

    },
    {
        title: 'Explore',
        icon: <BiSearch />

    },
    {
        title: 'Notification',
        icon: <BsBell />

    },
    {
        title: 'Messages',
        icon: <BsEnvelope />

    },
    {
        title: 'Lists',
        icon: <RiFileListLine />

    },
    {
        title: 'Communities',
        icon: <BsPeople />

    },
    {
        title: 'Verified',
        icon: <LuVerified />

    },
    {
        title: 'Profile',
        icon: <AiOutlineUser />

    },
    {
        title: 'More',
        icon: <CiCircleMore />

    }

]




const TwitterLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const { user } = useCurrentUser()
    const queryClient = useQueryClient()

    const handleLoginWithGoogle = useCallback(
        async (cred: CredentialResponse) => {
            const googleToken = cred.credential

            if (!googleToken) return toast.error("Google token not found")

            const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken })
            if (verifyGoogleToken) window.localStorage.setItem('twitter_google_token', verifyGoogleToken)
            // refetch data by invalidating
            await queryClient.invalidateQueries(['current-user'])
            toast.success('Verified Success')
        },
        [queryClient],
    )

    return (
        <div className="grid grid-cols-12 max-w-full w-screen h-screen sm:px-32">
            <div className="col-span-2 sm:col-span-3 mt-1 flex sm:justify-end relative">
                <div>
                    <div className="rounded-full w-fit h-fit text-3xl p-3 hover:bg-gray-800 cursor-pointer transition-all">
                        <BsTwitter />
                    </div>
                    <div className="mt-2 text-xl mr-8">
                        <ul className='relative'>
                            {sidebarItems.map((el) =>
                                <li className='flex justify-start items-center mt-2 gap-4 hover:bg-gray-800 transition-all cursor-pointer w-fit rounded-full py-2 px-4' key={el.title}>
                                    <span>{el.icon}</span>
                                    <span className='hidden sm:inline' >{el.title}</span>
                                </li>
                            )}
                        </ul>
                        <button className='hidden sm:block bg-[#0777C3] rounded-full px-4 py-3 mt-4 w-full font-semibold text-lg'>Post</button>
                        <button className='block sm:hidden bg-[#0777C3] rounded-full px-4 py-3 mt-4 w-full font-semibold text-lg'><BsTwitter /></button>
                    </div>
                </div>
                {user &&
                    <div className='absolute bottom-5 flex gap-4 bg-gray-800 items-center py-3 px-4 rounded-xl text-base mr-4'>
                        {user && user.profileImageURL && < Image className='rounded-full' src={user?.profileImageURL} alt={'user image'} height={50} width={50} />}
                        <h4>{user?.firstname} {user?.lastname}</h4>
                    </div>
                }
            </div>
            <div className="col-span-10 sm:col-span-6 border h-screen overflow-y-scroll no-scrollbar border-gray-600">
                {children}
            </div>
            <div className="hidden sm:col-span-3 p-4 ">
                {!user &&
                    <div className="bg-slate-800 p-4 rounded-xl overflow-hidden">
                        <GoogleLogin
                            onSuccess={handleLoginWithGoogle}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </div>
                }
                {user && <p onClick={() => localStorage.removeItem("twitter_google_token")}>Logout</p>}
            </div>
        </div>
    )
}

export default TwitterLayout