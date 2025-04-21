import express, { NextFunction, Request, Response } from 'express'
import authHandler, { RequestWithAuth } from '../middlewares/authHandler'
import { AppError } from '../middlewares/errorHandler'
import { searchUsersByUsername } from '../utils/searchHelper'

const router = express.Router()

router.get('/search-username', authHandler, async (req: RequestWithAuth, res: Response, next: NextFunction) => {
    try {
        const { username } = req.query // Use query params for GET requests
        if (!username || typeof username !== 'string') throw new AppError('Username query parameter is required', 400)

        const users = await searchUsersByUsername(username)
        res.send(users)
        return
    } catch (error) {
        next(error)
    }
})

export default router
