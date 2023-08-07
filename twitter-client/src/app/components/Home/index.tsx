import React from 'react'
import HomeClient from './HomeClient'
import AllTweets from '../AllTweets'

const Home = () => {
    return (
        <HomeClient>
            <AllTweets />
        </HomeClient>
    )
}

export default Home