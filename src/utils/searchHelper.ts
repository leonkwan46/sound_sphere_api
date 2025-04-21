import { User, UserType } from 'src/Types/User'
import db from '../database/config'
import dotenv from 'dotenv'
import { transformUser } from './authHelper'


dotenv.config()

export const searchUsersByUsername = async (username: string): Promise<User[] | void[]> => {
    try {
        const query = `
            SELECT * FROM users 
            WHERE username ILIKE $1
        `
        const values = [`%${username}%`]
        const result = await db.query(query, values)

        const filteredUsers = result.rows.map(user =>
            transformUser(user, user.firebase_user_id)
        )

        return filteredUsers

    } catch (error) {
        console.error('Error searching users by username:', error)
        throw new Error('searchUsersByUsername - Database query failed')
    }
}
