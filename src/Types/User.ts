export interface UserDB {
    // Basic
    id: number
    firebase_user_id: string
    email: string
    username: string
    user_type: 'student' | 'teacher' | 'admin'
    created_at: Date
    // Profile
    first_name: string
    last_name: string
    age: number
    // date_of_birth: Date
    gender: String
}

export interface FirebaseUser {
    email: string
    uid: string
  }

export interface User {
    firebaseId: string
    email: string
    username: string
    user_type: 'student' | 'teacher' | 'admin'
    first_name: string
    last_name: string
    age: number
    // date_of_birth: Date
    gender: String
}