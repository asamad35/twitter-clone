import axios from "axios";
import { prismaClient } from "../client/db";
import jwtService from "./jwtService";
import { GraphqlContext } from "../interfaces";
import { User } from "@prisma/client";

interface GoogleTokenResult {
    iss?: string,
    azp?: string,
    aud?: string,
    sub?: string,
    email: string,
    email_verified?: string,
    nbf?: string,
    name?: string,
    picture: string,
    given_name: string,
    family_name: string,
    locale?: string,
    iat?: string,
    exp?: string,
    jti?: string,
    alg?: string,
    kid?: string,
    typ?: string,
}


class UserService {
    async verifyGoogleToken(token: string): Promise<string> {
        const googleToken = token;
        const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOauthURL.searchParams.set('id_token', googleToken)


        const { data } = await axios.get<GoogleTokenResult>(`${googleOauthURL}`)

        let user = await prismaClient.user.findUnique({ where: { email: data.email } })

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstname: data.given_name,
                    lastname: data.family_name,
                    profileImageURL: data.picture
                }
            })
        }

        const userToken = jwtService.generateTokenForUser(user)

        return userToken
    }

    async getCurrentUser(ctx: GraphqlContext): Promise<User | null> {
        const id = ctx?.user?.id
        if (!id) return null
        const user = await prismaClient.user.findUnique({ where: { id } })
        return user
    }

    async getUserById(id: string) {
        const user = await prismaClient.user.findUnique({ where: { id: id } })
        return user
    }
}

const userService = new UserService()

export default userService