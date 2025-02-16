import { NextFunction, Request, Response } from 'express'

const errorHanlder = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).send({ error: err.message })
    } else {
        res.status(500).send({ error: 'Internal server error' })
    }
    console.error(err.stack)
    return
}

export default errorHanlder


export class AppError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}