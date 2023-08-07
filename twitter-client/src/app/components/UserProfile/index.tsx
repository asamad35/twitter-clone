import React from 'react'
import TwitterLayout from '../Layout/TwitterLayout'
import ServerSideProfile from './ServerSideProfile'

const UserProfile = ({ id }: { id: string }) => {
    return (
        <TwitterLayout>
            <ServerSideProfile id={id} />
        </TwitterLayout>

    )
}

export default UserProfile