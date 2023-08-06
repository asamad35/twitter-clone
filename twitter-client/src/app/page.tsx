'use client'
import React, { useCallback, useState } from 'react';
import { BsTwitter } from 'react-icons/bs'
import { BiSolidHomeCircle, BiSearch, BiImageAlt } from 'react-icons/bi'
import { BsBell, BsEnvelope, BsPeople } from 'react-icons/bs'
import { RiFileListLine } from 'react-icons/ri'
import { AiOutlineUser } from 'react-icons/ai'
import { LuVerified } from 'react-icons/lu'
import { CiCircleMore } from 'react-icons/ci'
import FeedCard from './components/FeedCard';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { graphqlClient } from '../../client/api';
import { verifyUserGoogleTokenQuery } from '../../graphql/query/user';
import { useCurrentUser } from '../../hooks/user';
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image';
import { useCreateTweet, useGetAllTweets } from '../../hooks/tweet';
import { Tweet } from '../../gql/graphql';

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



export default function Home() {
  const { user } = useCurrentUser()
  const { tweets = [] } = useGetAllTweets()
  const queryClient = useQueryClient()
  const { mutate } = useCreateTweet()

  const [content, setContent] = useState("")

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
  const handleCreateTweet = useCallback(
    () => {
      mutate({
        content
      })
    },
    [content, mutate],
  )

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.click();
  }, []);

  return (
    <div >

      <div className="grid grid-cols-12 max-w-full w-screen h-screen pl-32 pr-32">
        <div className="col-span-3 mt-1 justify-start">
          <div className="rounded-full w-fit h-fit text-3xl p-3 hover:bg-gray-800 cursor-pointer transition-all">
            <BsTwitter />
          </div>
          <div className="mt-2
          
          
          text-xl mr-8">
            <ul className='relative'>
              {sidebarItems.map((el) =>
                <li className='flex justify-start items-center mt-2 gap-4 hover:bg-gray-800 transition-all cursor-pointer w-fit rounded-full py-2 px-4' key={el.title}>
                  <span>{el.icon}</span>
                  <span >{el.title}</span>
                </li>
              )}
            </ul>
            <button className='bg-[#0777C3] rounded-full px-4 py-3 mt-4 w-full font-semibold text-lg'>Post</button>
            <div className='absolute bottom-5 flex gap-4 bg-gray-800 items-center py-3 px-4 rounded-xl text-lg'>
              {user && user.profileImageURL && < Image className='rounded-full' src={user?.profileImageURL} alt={'user image'} height={50} width={50} />}
              <h4>{user?.firstname} {user?.lastname}</h4>
            </div>
          </div>
        </div>
        <div className="col-span-6 border h-screen overflow-y-scroll no-scrollbar border-gray-600">

          <div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                  {user?.profileImageURL && (
                    <Image
                      className="rounded-full"
                      src={user?.profileImageURL}
                      alt="user-image"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
                <div className="col-span-11">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent text-xl px-3 border-b border-slate-700 focus:outline-none"
                    placeholder="What's happening?"
                    rows={3}
                  ></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                    <button
                      onClick={handleCreateTweet}
                      className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full"
                    >
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {tweets?.map((tweet) => tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null)}
        </div>
        <div className="col-span-3 p-4 ">
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
    </div>
  )
}
