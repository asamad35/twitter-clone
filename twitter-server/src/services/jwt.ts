import { User } from '@prisma/client';
import JWT from 'jsonwebtoken'
import { JWTUser } from '../interfaces';


const JWT_SECRET = "dfejklnfjewbnfji";


class JWTService {
    generateTokenForUser(user: User) {
        const payload: JWTUser = {
            id: user?.id,
            email: user?.email
        }

        const token = JWT.sign(payload, JWT_SECRET)
        return token
    }

    decodeToken(token: string) {
        try {
            return JWT.verify(token, JWT_SECRET) as JWTUser
        } catch (error) {
            return null
        }


    }
}

const jwtService = new JWTService()

export default jwtService