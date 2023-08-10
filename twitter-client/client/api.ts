import { GraphQLClient } from "graphql-request";

// check if this file loading from server or client(browser)
const isClient = typeof window !== "undefined"


export const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL!, {
    headers: () => ({
        Authorization: `Bearer ${isClient ? window.localStorage.getItem('twitter_google_token') : ""}`

    })
});