import React from 'react'
import { graphqlClient } from '../../../../client/api'
import { getAllTweetsQuery } from '../../../../graphql/query/tweet'
import FeedCard from '../FeedCard'
import { Tweet } from '../../../../gql/graphql'

const AllTweets = async () => {
    const tweets = await graphqlClient.request(getAllTweetsQuery)
    console.log({ tweets },'dwdwdwdwdwdwaaa')
    return (
        <>
            {tweets.getAllTweets?.map((tweet) => tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null)}
        </>
    )
}

export default AllTweets