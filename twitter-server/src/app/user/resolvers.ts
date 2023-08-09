import axios from 'axios'
import { prismaClient } from '../../client/db';
import jwtService from '../../services/jwtService';
import { GraphqlContext } from '../../interfaces';
import { Tweet, User } from '@prisma/client';
import userService from '../../services/userService';

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        const resultToken = await userService.verifyGoogleToken(token)
        return resultToken;
    },

    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        const user = await userService.getCurrentUser(ctx)
        return user;
    },

    getUserById: async (parent: any, { id }: { id: string }) => {
        const user = await userService.getUserById(id)
        return user
    }

}

const extraResolvers = {
    User: {
        tweets: (parent: User) => prismaClient.tweet.findMany({ where: { authorId: parent.id } }),

        followers: async (parent: User) => {
            const followersList = await prismaClient.follows.findMany({
                where: { following: { id: parent.id } },
                include: { follower: true }
            })
            return followersList.map(el => el.follower)
        },

        followings: async (parent: User) => {
            const followingsList = await prismaClient.follows.findMany({
                where: { follower: { id: parent.id } },
                include: { following: true }
            })
            return followingsList.map(el => el.following)
        }
    }


}

const mutations = {
    followUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated")
        await userService.followUser({ from: ctx.user.id, to: to })
        return true
    },

    unfollowUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated")
        console.log({ from: ctx.user.id, to: to })

        await userService.unfollowUser({ from: ctx.user.id, to: to })
        return true
    },


}

export const resolvers = { queries, extraResolvers, mutations }