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
        followers{
            id
            firstname
            lastname
            email
            profileImageURL
        },
        followings{
            id
            firstname
            lastname
            email
            profileImageURL
        },
        tweets{
                id
                content
                author{
                    firstname
                    lastname
                    profileImageURL
                }
            }
        }
    } 
`)

export const getUserByIdQuery = graphql(`#graphql
    query GetUserById($id: ID!){
        getUserById(id: $id) {
        id
        firstname
        email
        lastname
        profileImageURL
        tweets {
            content
            id
            author {
                firstname
                lastname
                profileImageURL
                }
            }
        followers{
            id
            firstname
            lastname
            email
            profileImageURL
        }
        followings{
            id
            firstname
            lastname
            email
            profileImageURL
        }
        }
    }
`)

export const getSignedURLForTweetQuery = graphql(`#graphql
    query getSignedURLForTweet($imageType: String!, $imageName: String!) {
        getSignedURLForTweet(imageType: $imageType, imageName: $imageName)
}
`)