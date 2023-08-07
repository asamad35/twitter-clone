import React from 'react'
import { getUserByIdQuery } from '../../../../graphql/query/user';
import { graphqlClient } from '../../../../client/api';
import ClientSideProfile from './ClientSideProfile';
import { User } from '../../../../gql/graphql';

const ServerSideProfile = async ({ id }: { id: string }) => {
    const userInfo = await graphqlClient.request(getUserByIdQuery, { id });
    console.log({ userInfo })
    return (
        <div>
            <div>ServerSideProfile</div>
            <div>{userInfo.getUserById?.firstname}</div>
            {userInfo.getUserById && <ClientSideProfile userInfo={userInfo.getUserById as User} />}

        </div>
    )
}

export default ServerSideProfile