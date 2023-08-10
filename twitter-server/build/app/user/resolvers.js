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
const redis_1 = __importDefault(require("../../client/redis"));
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
        }),
        recommendedUsers: (parent, _, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!ctx.user)
                    return [];
                const cachedValue = yield redis_1.default.get(`RECOMMENDED_USERS:${ctx.user.id}`);
                if (cachedValue) {
                    console.log("cached Found");
                    return JSON.parse(cachedValue);
                }
                ;
                const myFollowings = yield db_1.prismaClient.follows.findMany({
                    where: {
                        follower: { id: ctx.user.id },
                    },
                    include: {
                        following: {
                            include: { followers: { include: { following: true } } },
                        },
                    },
                });
                const users = [];
                for (const followings of myFollowings) {
                    for (const followingOfFollowedUser of followings.following.followers) {
                        if (followingOfFollowedUser.following.id !== ctx.user.id &&
                            myFollowings.findIndex((e) => (e === null || e === void 0 ? void 0 : e.followingId) === followingOfFollowedUser.following.id) < 0) {
                            users.push(followingOfFollowedUser.following);
                        }
                    }
                }
                console.log("No cached Found");
                yield redis_1.default.set(`RECOMMENDED_USERS:${ctx.user.id}`, JSON.stringify(users));
                return users;
            }
            catch (error) {
                return [];
            }
        }),
    },
};
const mutations = {
    followUser: (parent, { to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthenticated");
        yield userService_1.default.followUser({ from: ctx.user.id, to: to });
        yield redis_1.default.del(`RECOMMENDED_USERS:${ctx.user.id}`);
        return true;
    }),
    unfollowUser: (parent, { to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthenticated");
        console.log({ from: ctx.user.id, to: to });
        yield userService_1.default.unfollowUser({ from: ctx.user.id, to: to });
        return true;
    }),
};
exports.resolvers = { queries, extraResolvers, mutations };
