import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../client/db";
import { GraphqlContext } from "../interfaces";



export interface CreateTweetData {
    content: string
    imageURL?: string
}



const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS!,
        secretAccessKey: process.env.AWS_SECRET!
    }
})

class TweetService {
    async getAllTweets() {
        return await prismaClient.tweet.findMany({ orderBy: { createdAt: 'desc' } })
    }

    async getSignedURLForTweet({ imageType, imageName, ctx }: { imageType: string, imageName: string, ctx: GraphqlContext }) {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated")

        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
        if (!allowedImageTypes.includes(imageType)) throw new Error("Image type is not supported")

        const putObjectCommand = new PutObjectCommand({
            Bucket: "abdus-twitter-dev",
            Key: `uploads/${ctx.user.id}/tweet/${imageName}-${Date.now().toString()}.${imageType}`
        })

        const signedURL = await getSignedUrl(s3Client, putObjectCommand);

        return signedURL
    }

    async createTweet({ payload, ctx }: { payload: CreateTweetData, ctx: GraphqlContext }) {
        if (!ctx.user) {
            throw new Error("You are not authenticated")
        }

        const tweet = await prismaClient.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } }
            }
        })

        return tweet
    }
}

const tweetService = new TweetService();

export default tweetService;