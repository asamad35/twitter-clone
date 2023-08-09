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
const db_1 = require("../../client/db");
const userService_1 = __importDefault(require("../../services/userService"));
const queries = {
    verifyGoogleToken: (parent, { token }) => __awaiter(void 0, void 0, void 0, function* () {
        const resultToken = yield userService_1.default.verifyGoogleToken(token);
        return resultToken;
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService_1.default.getCurrentUser(ctx);
        return user;
    }),
    getUserById: (parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService_1.default.getUserById(id);
        return user;
    })
};
const extraResolvers = {
    User: {
        tweets: (parent) => db_1.prismaClient.tweet.findMany({ where: { authorId: parent.id } }),
        followers: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const followersList = yield db_1.prismaClient.follows.findMany({
                where: { following: { id: parent.id } },
                include: { follower: true }
            });
            return followersList.map(el => el.follower);
        }),
        followings: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const followingsList = yield db_1.prismaClient.follows.findMany({
                where: { follower: { id: parent.id } },
                include: { following: true }
            });
            return followingsList.map(el => el.following);
        })
    }
};
const mutations = {
    followUser: (parent, { to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthenticated");
        yield userService_1.default.followUser({ from: ctx.user.id, to: to });
        return true;
    }),
    unfollowUser: (parent, { to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthenticated");
        yield userService_1.default.unfollowUser({ from: ctx.user.id, to: to });
    }),
};
exports.resolvers = { queries, extraResolvers, mutations };
