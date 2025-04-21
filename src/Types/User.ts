export interface RawUser {
    // Basic
    id: number
    firebase_user_id: string
    email: string
    username: string
    user_type: UserType
    created_at: Date
    // Profile
    first_name: string
    last_name: string
    age: number
    // date_of_birth: Date
    gender: string
}

export interface FirebaseUser {
    email: string
    uid: string
}

export interface User {
    firebaseId: string
    email: string
    username: string
    userType: UserType
    profile: UserProfile
}

interface UserProfile {
    firstName: string
    lastName: string
    age: number
    // date_of_birth: Date
    gender: String
}

export type UserType = 'student' | 'teacher' | 'admin';