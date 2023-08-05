import { GraphQLClient } from "graphql-request";

// check if this file loading from server or client(browser)
const isClient = typeof window !== "undefined"


export const graphqlClient = new GraphQLClient('http://localhost:8000/graphql', {
    headers: () => ({
        Authorization: `Bearer ${isClient ? window.localStorage.getItem('twitter_google_token') : ""}`

    })
});