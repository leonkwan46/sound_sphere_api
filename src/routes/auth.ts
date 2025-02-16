import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { createUser, getUserByEmail } from '../utils/authHelper'
import { AppError } from '../middlewares/errorHandler'

const router = express.Router()

router.post('/register-with-firebase', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, firebaseUserId } = req.body
        // Check if the user already exists
        const userExist = await getUserByEmail(email)
        if (userExist) throw new AppError('User already exists', 400)

        // Create a new user
        const user = await createUser(email, firebaseUserId)
        console.log('user', user)
        if (!user) throw new AppError('User does not exist', 400)
        
        // Send success authToken
        res.send({ message: 'User created successfully' })
        return
    } catch (error) {
        next(error)
    }
})

// LEGACY CODE
// router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { email, password } = req.body
//         // Check if the user already exists
//         const userExist = await getUserByEmail(email)
//         if (userExist) throw new AppError('User already exists', 400)

//         // Create a new user
//         const user = await createUser(email, password)
//         if (!user) throw new AppError('User does not exist', 400)

//         // Generate a auth token
//         const secret = process.env.JWT_SECRET
//         if (!secret) throw new Error('JWT_SECRET is not defined')
//         const authToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' })
        
//         // Send success authToken
//         res.send({ authToken })
//         return
//     } catch (error) {
//         next(error)
//     }
// })

// router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { email, password } = req.body
//         // Check if the user already exists
//         const user = await getUserByEmail(email)
//         if (!user) throw new AppError('User does not exist', 400)
//         // Compare password
//         const isValid = await bcrypt.compare(password, user.password_hash)
//         if (!isValid) throw new AppError('Invalid password', 400)

//         // Generate a auth token
//         const secret = process.env.JWT_SECRET
//         if (!secret) throw new Error('JWT_SECRET is not defined')
//         const authToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1s' })

//         // Send success authToken
//         res.send({ authToken })
//         return
//     } catch (error) {
//         next(error)
//     }
// })

export default router