"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const db_1 = require("../client/db");
const s3Client = new client_s3_1.S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS,
        secretAccessKey: process.env.AWS_SECRET
    }
});
class TweetService {
    getAllTweets() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prismaClient.tweet.findMany({ orderBy: { createdAt: 'desc' } });
        });
    }
    getSignedURLForTweet({ imageType, imageName, ctx }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.user || !ctx.user.id)
                throw new Error("Unauthenticated");
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!allowedImageTypes.includes(imageType))
                throw new Error("Image type is not supported");
            const putObjectCommand = new client_s3_1.PutObjectCommand({
                Bucket: "abdus-twitter-dev",
                Key: `uploads/${ctx.user.id}/tweet/${imageName}-${Date.now().toString()}.${imageType}`
            });
            const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand);
            return signedURL;
        });
    }
    createTweet({ payload, ctx }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.user) {
                throw new Error("You are not authenticated");
            }
            const tweet = yield db_1.prismaClient.tweet.create({
                data: {
                    content: payload.content,
                    imageURL: payload.imageURL,
                    author: { connect: { id: ctx.user.id } }
                }
            });
            return tweet;
        });
    }
}
const tweetService = new TweetService();
exports.default = tweetService;
