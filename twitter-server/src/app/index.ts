import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { User } from './user'
import cors from 'cors'
import jwtService from '../services/jwt';
import { GraphqlContext } from '../interfaces';

export async function initServer() {
    const app = express();
    app.use(express.json())
    app.use(cors())
    const graphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs: `
        ${User.types}
        type Query{
            ${User.queries}
        }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
        },
    });

    await graphqlServer.start();
    app.use('/graphql', expressMiddleware(graphqlServer, {
        context: async ({ req, res }) => {
            return {
                user: req.headers.authorization ?
                    jwtService.decodeToken(req.headers.authorization.split("Bearer ")[1]) :
                    undefined
            }
        }
    }));

    return app
}