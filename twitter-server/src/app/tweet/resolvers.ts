import { Tweet } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";
import userService from "../../services/userService";
import tweetService, { CreateTweetData } from "../../services/tweetService";




const queries = {
    getAllTweets: async () => await tweetService.getAllTweets(),
    getSignedURLForTweet: async (parent: any, { imageType, imageName }: { imageType: string, imageName: string }, ctx: GraphqlContext) => {
        const signedURL = await tweetService.getSignedURLForTweet({ imageType, imageName, ctx })
        return signedURL
    }
}

const mutations = {
    createTweet: async (parent: any, { payload }: { payload: CreateTweetData }, ctx: GraphqlContext) => {
        const tweet = await tweetService.createTweet({ payload, ctx })
        return tweet
    }
}

const extraResolvers = {
    Tweet: {
        author: async (parent: Tweet) => await userService.getUserById(parent.authorId)
    }
}

export const resolvers = { mutations, extraResolvers, queries }