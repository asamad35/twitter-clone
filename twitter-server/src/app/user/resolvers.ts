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
        tweets: (parent: User) => prismaClient.tweet.findMany({ where: { authorId: parent.id } })
    }
}

export const resolvers = { queries, extraResolvers }