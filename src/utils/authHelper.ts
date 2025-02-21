import { User, UserDB, UserType } from 'src/Types/User'
import db from '../database/config'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createUser = async (email: string, firebaseUserId: string, userType: UserType) => {
    try {
        // Insert new user into the database
        const query = `
            INSERT INTO users (email, firebase_user_id, user_type)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, firebase_user_id, user_type
        `
        const values = [email, firebaseUserId, userType]
        const result = await db.query(query, values)

        return result.rows[0]
    } catch (error) {
        console.error('Error creating user:', error)
        throw new Error('createUser - Database query failed')
    }
}

export const updateUser = async (
    firebaseId: string,
    username: string,
    firstName: string,
    lastName: string,
    age: number,
    gender: string
): Promise<Boolean> => {

    // Clean up and Prepare data
    username = username.toLowerCase()

    try {
        const query = `
            UPDATE users
            SET username = $1, first_name = $2, last_name = $3, age = $4, gender = $5
            WHERE firebase_user_id = $6
        `
        const values = [username, firstName, lastName, age, gender, firebaseId]
        const result = await db.query(query, values)

        if (result.rowCount === 0) return false

        return true
    } catch (error) {
        console.error('Error updating user:', error)
        throw new Error('updateUser - Database query failed')
    }
}

export const getUserByEmail = async (email: string): Promise<UserDB | null> => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1'
        const values = [email]
        const result = await db.query(query, values)
        return result.rows.length > 0 ? result.rows[0] : null
    } catch (error) {
        throw new Error('getUserByEmail - Database query failed')
    }
}

export const getUserById = async (userId: string | number): Promise<UserDB | null> => {
    const id = parseInt(userId.toString())
    try {
        const query = 'SELECT * FROM users WHERE id = $1 LIMIT 1'
        const values = [id]
        const result = await db.query(query, values)
        return result.rows.length > 0 ? result.rows[0] : null
    } catch (error) {
        throw new Error('getUserById - Database query failed')
    }
}

export const getUserByUsername = async (username: string): Promise<UserDB | null> => {
    try {
        const query = 'SELECT * FROM users WHERE username = $1 LIMIT 1'
        const values = [username]
        const result = await db.query(query, values)
        return result.rows.length > 0 ? result.rows[0] : null
    } catch (error) {
        throw new Error('getUserByUsername - Database query failed')
    }
}

export const generateAuthToken = (user: UserDB): string => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined')
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        return token
    } catch (error) {
        console.error('Error generating auth token:', error)
        throw new Error('generateAuthToken - Token generation failed')
    }
}

export const filterUser = (user: UserDB, firebaseId: string): User => {
    return {
        firebaseId: firebaseId,
        email: user.email,
        username: user.username,
        user_type: user.user_type,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        gender: user.gender
    }
}