'use client'
import React from 'react';
import { BsTwitter } from 'react-icons/bs'
import { BiSolidHomeCircle, BiSearch } from 'react-icons/bi'
import { BsBell, BsEnvelope, BsPeople } from 'react-icons/bs'
import { RiFileListLine } from 'react-icons/ri'
import { AiOutlineUser } from 'react-icons/ai'
import { LuVerified } from 'react-icons/lu'
import { CiCircleMore } from 'react-icons/ci'
import FeedCard from './components/FeedCard';
import { GoogleLogin } from '@react-oauth/google';


export default function Home() {
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
  return (
    <div >
      <div className="grid grid-cols-12 max-w-full w-screen h-screen pl-32 pr-32">
        <div className="col-span-3 mt-1 justify-start">
          <div className="rounded-full w-fit h-fit text-3xl p-3 hover:bg-gray-800 cursor-pointer transition-all">
            <BsTwitter />
          </div>
          <div className="mt-2
          
          
          text-xl mr-8">
            <ul>
              {sidebarItems.map((el) =>
                <li className='flex justify-start items-center mt-2 gap-4 hover:bg-gray-800 transition-all cursor-pointer w-fit rounded-full py-2 px-4' key={el.title}>
                  <span>{el.icon}</span>
                  <span >{el.title}</span>
                </li>
              )}
            </ul>
            <button className='bg-[#0777C3] rounded-full px-4 py-3 mt-4 w-full font-semibold text-lg'>Post</button>
          </div>
        </div>
        <div className="col-span-6 border h-screen overflow-y-scroll no-scrollbar border-gray-600">
          {<FeedCard />}
          {<FeedCard />}
          {<FeedCard />}
          {<FeedCard />}
          {<FeedCard />}
        </div>
        <div className="col-span-3 p-4">
          <div className="bg-slate-800 p-4 rounded-xl overflow-hidden">
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
