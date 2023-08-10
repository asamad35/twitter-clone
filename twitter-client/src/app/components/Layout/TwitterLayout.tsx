"use client"
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React, { useCallback, useMemo } from 'react'
import { AiOutlineUser } from 'react-icons/ai';
import { BiSearch, BiSolidHomeCircle } from 'react-icons/bi';
import { BsBell, BsEnvelope, BsPeople, BsTwitter } from 'react-icons/bs';
import { CiCircleMore } from 'react-icons/ci';
import { LuVerified } from 'react-icons/lu';
import { RiFileListLine } from 'react-icons/ri';
import { useCurrentUser } from '../../../../hooks/user';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { graphqlClient } from '../../../../client/api';
import { verifyUserGoogleTokenQuery } from '../../../../graphql/query/user';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';


interface TwitterSidebarButton {
    title: string,
    icon: React.ReactNode,
    link: string
}


const TwitterLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {

    const queryClient = useQueryClient()
    const { user } = useCurrentUser()

    const sidebarItems: TwitterSidebarButton[] = useMemo(() => [
        {
            title: 'Home',
            icon: <BiSolidHomeCircle />,
            link: '/'

        },
        {
            title: 'Explore',
            icon: <BiSearch />,
            link: '/'

        },
        {
            title: 'Notification',
            icon: <BsBell />,
            link: '/'

        },
        {
            title: 'Messages',
            icon: <BsEnvelope />,
            link: '/'

        },
        {
            title: 'Lists',
            icon: <RiFileListLine />,
            link: '/'

        },
        {
            title: 'Communities',
            icon: <BsPeople />,
            link: '/'

        },
        {
            title: 'Verified',
            icon: <LuVerified />,
            link: '/'

        },
        {
            title: 'Profile',
            icon: <AiOutlineUser />,
            link: `/profile/${user?.id}`

        },
        {
            title: 'More',
            icon: <CiCircleMore />,
            link: '/'

        }

    ]

        , [user?.id])

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
                                <li className=' mt-2 hover:bg-gray-800 transition-all cursor-pointer w-fit rounded-full py-2 px-4' key={el.title}>
                                    <Link className=' gap-4 flex justify-start items-center' href={el.link}>
                                        <span>{el.icon}</span>
                                        <span className='hidden sm:inline' >{el.title}</span>
                                    </Link>
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
            <div className=" sm:col-span-3 p-4 ">
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
                <div className="px-4 py-3 bg-slate-800 rounded-lg">
                    <h1 className="my-2 text-2xl mb-5">Users you may know</h1>
                    {user?.recommendedUsers?.map((el) => (
                        <div className="flex items-center gap-3 mt-2" key={el?.id}>
                            {el?.profileImageURL && (
                                <Image
                                    src={el?.profileImageURL}
                                    alt="user-image"
                                    className="rounded-full"
                                    width={60}
                                    height={60}
                                />
                            )}
                            <div>
                                <div className="text-lg">
                                    {el?.firstname} {el?.lastname}
                                </div>
                                <Link
                                    href={`/${el?.id}`}
                                    className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TwitterLayout