import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../client/api'
import { getAllTweetsQuery } from '../graphql/query/tweet'
import { CreateTweetData } from '../gql/graphql'
import { createTweetMutation } from '../graphql/mutation/tweet'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export const useGetAllTweets = () => {

    const query = useQuery({
        queryKey: ['all-tweets'],
        queryFn: () => graphqlClient.request(getAllTweetsQuery)
    })

    return { ...query, tweets: query.data?.getAllTweets }
}

export const useCreateTweet = () => {
    // const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) => graphqlClient.request(createTweetMutation, { payload }),
        onMutate: () => {
            toast.loading("Creating tweet", { id: '1' });
        },
        onSuccess: () => {
            // router.refresh()

            queryClient.invalidateQueries(['all-tweets'])

            toast.success("Created Succesfully", { id: '1' })

        }
    })


    return mutation
}