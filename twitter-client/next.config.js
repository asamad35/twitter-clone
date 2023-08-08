/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'abdus-twitter-dev.s3.ap-south-1.amazonaws.com']
    }
}

module.exports = nextConfig
