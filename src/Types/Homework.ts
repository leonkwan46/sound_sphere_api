export interface Homework {
    id: number
    title: string
    description: string
    due_date: Date
    created_at: Date
    updated_at: Date
    user_id: number
    subject_id: number
    status: boolean
    Tasks: Task[]
}

export interface Task {
    id: number
    title: string
    description: string
    due_date: Date
    created_at: Date
    updated_at: Date
    user_id: number
    homework_id: number
    status: boolean
}

export interface AudioFile {
    id: number
    name: string
    url: string
    created_at: Date
    updated_at: Date
    user_id: number
    task_id: number
}