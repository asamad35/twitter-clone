"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default("redis://default:7858b87801974813af6fc166d3eec502@us1-profound-elephant-38437.upstash.io:38437");
exports.default = redisClient;
