import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '../client/api'
import { getCurrentUserQuery } from '../graphql/query/user'

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ['current-user'],
        queryFn: () => {
            return graphqlClient.request(getCurrentUserQuery)
        },
        refetchOnWindowFocus: false,

    })

    return { ...query, user: query.data?.getCurrentUser }
}

