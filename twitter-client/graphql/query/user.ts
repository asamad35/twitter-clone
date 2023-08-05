import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`#graphql
    query VerifyUserGoogleToken($token: String!){
        verifyGoogleToken(token:$token)
    } 
`)

export const getCurrentUserQuery = graphql(`#graphql
    query GetCurrentUser{
        getCurrentUser{
        id,
        firstname,
        lastname,
        email,
        profileImageURL,
        }
    } 
`)