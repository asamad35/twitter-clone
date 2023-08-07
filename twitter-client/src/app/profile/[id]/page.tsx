import UserProfile from '@/app/components/UserProfile'

const UserProfilePage = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <UserProfile id={params.id} />
        </div>
    )
}
export default UserProfilePage