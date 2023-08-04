import { User } from '@prisma/client';
import JWT from 'jsonwebtoken'


const JWT_SECRET = "dfejklnfjewbnfji";


class JWTService {
    generateTokenForUser(user: User) {
        const payload = {
            id: user?.id,
            emial: user?.email
        }

        const token = JWT.sign(payload, JWT_SECRET)
        return token
    }
}

const jwtService = new JWTService()

export default jwtService