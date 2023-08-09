import axios from 'axios'
import { prismaClient } from '../../client/db';
import jwtService from '../../services/jwtService';
import { GraphqlContext } from '../../interfaces';
import { Tweet, User } from '@prisma/client';
import userService from '../../services/userService';
import redisClient from '../../client/redis';

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
        },
        recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
            if (!ctx.user) return [];

            const cachedValue = await redisClient.get(`RECOMMENDED_USERS:${ctx.user.id}`)
            if (cachedValue) {
                console.log("cached Found")
                return JSON.parse(cachedValue)
            };
            await new Promise((res, rej) => { setTimeout(() => res, 3000) })
            const myFollowings = await prismaClient.follows.findMany({
                where: {
                    follower: { id: ctx.user.id },
                },
                include: {
                    following: {
                        include: { followers: { include: { following: true } } },
                    },
                },
            });

            const users: User[] = [];

            for (const followings of myFollowings) {
                for (const followingOfFollowedUser of followings.following.followers) {
                    if (
                        followingOfFollowedUser.following.id !== ctx.user.id &&
                        myFollowings.findIndex(
                            (e) => e?.followingId === followingOfFollowedUser.following.id
                        ) < 0
                    ) {
                        users.push(followingOfFollowedUser.following);
                    }
                }
            }
            console.log("No cached Found")
            await redisClient.set(`RECOMMENDED_USERS:${ctx.user.id}`, JSON.stringify(users))

            return users;
        },
    },
};


const mutations = {
    followUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated")
        await userService.followUser({ from: ctx.user.id, to: to })
        await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`)
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