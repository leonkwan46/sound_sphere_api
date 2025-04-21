import express from 'express'
import users from './users'
import auth from './auth'
import search from './search'

const router = express.Router()
router.use('/users', users)
router.use('/auth', auth)
router.use('/search', search)

export default router