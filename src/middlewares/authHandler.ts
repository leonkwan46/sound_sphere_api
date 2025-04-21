import dotenv from 'dotenv'
import { NextFunction } from 'node_modules/@types/express'

dotenv.config()

import { Request, Response } from 'express'
import { IncomingHttpHeaders } from 'http'
import { User } from '../Types/User'
import { verifyIdToken } from '../utils/firebaseHelper'
import { transformUser, getUserByEmail } from '../utils/authHelper'

export interface RequestWithAuth extends Request {
    user?: User
    headers: IncomingHttpHeaders & {
        authorization?: string
    }
}

const authHandler = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    try {
        // Check if token exists
        const authHeader = req.headers.authorization
        if (!authHeader) throw new Error("Authentication failed: Request is missing Authorization header")
        const token = authHeader.split(" ")[1]
        if (!token) throw new Error("Authentication failed: Token is missing")

        // Verify token
        // FIREBASE AUTH
        const firebaseUser = await verifyIdToken(token)
        if (!firebaseUser) throw new Error("Authentication failed: Token verification failed")

        // Get user from database
        if (!firebaseUser.email) throw new Error("Authentication failed: User is missing")
        const user = await getUserByEmail(firebaseUser.email)
        if (!user) throw new Error("User not found")
        const transformedUser = transformUser(user, firebaseUser.uid)

        // Set user
        req.user = transformedUser
        next()
    } catch (err) {
        next(err)
    }
}

export default authHandler