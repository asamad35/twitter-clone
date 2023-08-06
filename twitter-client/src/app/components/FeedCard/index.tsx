import Image from 'next/image'
import React from 'react'
import { BiMessageRounded } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiUpload } from 'react-icons/bi'
import { Tweet } from '../../../../gql/graphql'

interface FeedCardProps {
    data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = ({ data }) => {
    return (
        <div className='border border-x-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer '>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-1">
                    {data.author?.profileImageURL &&
                        <Image src={data.author?.profileImageURL} className='rounded-full' alt='user-img' height={50} width={50} />
                    }
                </div>
                <div className="col-span-11">
                    <h5>{data.author?.firstname}  {data.author?.lastname}</h5>
                    <p>{data.content}</p>
                    <div className='flex justify-between text-xl items-center pt-4 w-[90%]'>
                        <div>
                            <BiMessageRounded />
                        </div>
                        <div>
                            <FaRetweet />
                        </div>
                        <div>
                            < AiOutlineHeart />
                        </div>
                        <div>
                            < BiUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedCard