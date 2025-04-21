import express, { NextFunction, Request, Response } from 'express'
import authHandler, { RequestWithAuth } from '../middlewares/authHandler'
import { User } from '../Types/User'
import { AppError } from '../middlewares/errorHandler'
import { getUserByEmail, getUserByUsername, updateUser } from '../utils/authHelper'

const router = express.Router()

router.get('/get-user-data', authHandler, async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User
        res.send(user)
        return
    } catch (error) {
        next(error)
    }
})

router.post('/check-username-availability', authHandler, async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body
        // Check if the user already exists
        const userExist = await getUserByUsername(username)
        if (userExist) throw new AppError('Username already exists', 400)

        res.send({ isAvailable: true })
        return
    } catch (error) {
        next(error)
    }
})

router.post('/update-user-profile', authHandler, async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    try {
        const { email, firebaseId } = req.user as User
        const { username, firstName, lastName, age, gender } = req.body
        // Check if the user already exists
        const userExist = await getUserByEmail(email)
        if (!userExist) throw new AppError('Username does not exist', 400)

        // Update user
        const isUpdated = await updateUser(firebaseId, username.toLowerCase(), firstName, lastName, age, gender)
        res.send(isUpdated)
        return
    } catch (error) {
        next(error)
    }
})

export default router