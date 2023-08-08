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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const userService_1 = __importDefault(require("../../services/userService"));
const tweetService_1 = __importDefault(require("../../services/tweetService"));
const queries = {
    getAllTweets: () => __awaiter(void 0, void 0, void 0, function* () { return yield tweetService_1.default.getAllTweets(); }),
    getSignedURLForTweet: (parent, { imageType, imageName }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const signedURL = yield tweetService_1.default.getSignedURLForTweet({ imageType, imageName, ctx });
        return signedURL;
    })
};
const mutations = {
    createTweet: (parent, { payload }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const tweet = yield tweetService_1.default.createTweet({ payload, ctx });
        return tweet;
    })
};
const extraResolvers = {
    Tweet: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () { return yield userService_1.default.getUserById(parent.authorId); })
    }
};
exports.resolvers = { mutations, extraResolvers, queries };
