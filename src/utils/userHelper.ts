import { User, UserType } from 'src/Types/User'
import db from '../database/config'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const getUserType = (user: User): UserType => {
    return user.userType
}
const isTeacher = (user: User): boolean => {
    return getUserType(user) === 'teacher'
}
const isStudent = (user: User): boolean => {
    return getUserType(user) === 'student'
}

/* Student */
export const fetchTeachersList = async (studentId: string): Promise<User[]> => {
    try {
        const query = `
            SELECT u.*
            FROM users u
            INNER JOIN student_teacher st ON u.id = st.teacher_id
            WHERE st.student_id = $1
        `
        const values = [studentId]
        const result = await db.query(query, values)

        return result.rows
    } catch (error) {
        console.error('Error fetching teachers list:', error)
        throw new Error('fetchTeachersList - Database query failed')
    }
}

/* Teacher */
export const fetchStudentsList = async (teacherId: string): Promise<User[]> => {
    try {
        const query = `
            SELECT u.*
            FROM users u
            INNER JOIN student_teacher st ON u.id = st.student_id
            WHERE st.teacher_id = $1
        `
        const values = [teacherId]
        const result = await db.query(query, values)

        return result.rows
    } catch (error) {
        console.error('Error fetching students list:', error)
        throw new Error('fetchStudentsList - Database query failed')
    }
}
