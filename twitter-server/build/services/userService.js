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
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../client/db");
const jwtService_1 = __importDefault(require("./jwtService"));
class UserService {
    verifyGoogleToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const googleToken = token;
            const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
            googleOauthURL.searchParams.set('id_token', googleToken);
            const { data } = yield axios_1.default.get(`${googleOauthURL}`);
            let user = yield db_1.prismaClient.user.findUnique({ where: { email: data.email } });
            if (!user) {
                user = yield db_1.prismaClient.user.create({
                    data: {
                        email: data.email,
                        firstname: data.given_name,
                        lastname: data.family_name,
                        profileImageURL: data.picture
                    }
                });
            }
            const userToken = jwtService_1.default.generateTokenForUser(user);
            return userToken;
        });
    }
    getCurrentUser(ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!id)
                return null;
            const user = yield db_1.prismaClient.user.findUnique({ where: { id } });
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.prismaClient.user.findUnique({ where: { id: id } });
            return user;
        });
    }
    followUser({ from, to }) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.prismaClient.follows.create({
                data: {
                    follower: { connect: { id: from } },
                    following: { connect: { id: to } }
                }
            });
            return res;
        });
    }
    unfollowUser({ from, to }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(from, to);
            return yield db_1.prismaClient.follows.delete({ where: { followerId_followingId: { followerId: from, followingId: to } } });
        });
    }
}
const userService = new UserService();
exports.default = userService;
