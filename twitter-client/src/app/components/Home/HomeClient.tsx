"use client"

import { useState, useCallback } from "react"
import { BiImageAlt } from "react-icons/bi"
import { useCreateTweet } from "../../../../hooks/tweet"
import { useCurrentUser } from "../../../../hooks/user"
import TwitterLayout from "../Layout/TwitterLayout"
import Image from 'next/image';


const HomeClient = ({ children }: { children: React.ReactNode }) => {

    const { user } = useCurrentUser()
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
                {children}
            </TwitterLayout>

        </div>
    )
}

export default HomeClient