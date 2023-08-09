import TwitterLayout from '@/app/components/Layout/TwitterLayout';
import ClientSideProfile from '@/app/components/UserProfile/ClientSideProfile';
import { graphqlClient } from '../../../../client/api';
import { User } from '../../../../gql/graphql';
import { getUserByIdQuery } from '../../../../graphql/query/user';

const UserProfilePage = async ({ params }: { params: { id: string } }) => {
    const userInfo = await graphqlClient.request(getUserByIdQuery, { id: params.id });

    return (
        <TwitterLayout>
            {userInfo.getUserById && <ClientSideProfile userInfo={userInfo.getUserById as User} />}
        </TwitterLayout>
    )
}
export default UserProfilePage