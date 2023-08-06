'use client'
import React, { useCallback, useState } from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { graphqlClient } from '../../client/api';
import { verifyUserGoogleTokenQuery } from '../../graphql/query/user';
import { useQueryClient } from '@tanstack/react-query'
import { useCreateTweet, useGetAllTweets } from '../../hooks/tweet';
import { Tweet } from '../../gql/graphql';
import TwitterLayout from './components/Layout/TwitterLayout';
import { useCurrentUser } from '../../hooks/user';
import Image from 'next/image';
import { BiImageAlt } from 'react-icons/bi';
import FeedCard from './components/FeedCard';


export default function Home() {
  const { user } = useCurrentUser()
  const { tweets = [] } = useGetAllTweets()
  const { mutate } = useCreateTweet()

  const [content, setContent] = useState("")


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
      <TwitterLayout>
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
      </TwitterLayout>

    </div>
  )
}
