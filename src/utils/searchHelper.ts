import { User } from 'src/Types/User'
import db from '../database/config'
import dotenv from 'dotenv'
import { transformRawUser } from './authHelper'


dotenv.config()

/* The line `const users = await searchUsersByUsername(username, currentUser?.username)` is
calling the `searchUsersByUsername` function with two parameters: `username` and
`currentUser?.username`. */
export const searchUsersByUsername = async (username: string, currentUsername: string): Promise<User[] | void[]> => {
    try {
        const query = `
            SELECT * FROM users 
            WHERE username ILIKE $1
            AND username != $2
        `
        const values = [`%${username}%`, currentUsername]
        const result = await db.query(query, values)

        const filteredUsers = result.rows.map(user =>
            transformRawUser(user, user.firebase_user_id)
        )

        return filteredUsers

    } catch (error) {
        console.error('Error searching users by username:', error)
        throw new Error('searchUsersByUsername - Database query failed')
    }
}
