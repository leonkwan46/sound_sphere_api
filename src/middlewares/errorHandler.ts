import { NextFunction, Request, Response } from 'express'
import chalk from 'chalk'

const formatErrorStack = (stack: string | undefined): string => {
    if (!stack) return ''
    
    return stack
        .split('\n')
        .map((line, index) => {
            if (index === 0) {
                return chalk.red(line)
            }
            return chalk.gray(line)
        })
        .join('\n')
}

const errorHanlder = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString()
    const statusCode = err instanceof AppError ? err.statusCode : 500
    const statusColor = statusCode >= 500 ? chalk.red : chalk.yellow

    // Log error details
    console.log('\n' + chalk.bgRed.white.bold(' Error Details ') + '\n')
    console.log(chalk.gray('Timestamp: ') + chalk.white(timestamp))
    console.log(chalk.gray('Path: ') + chalk.white(req.path))
    console.log(chalk.gray('Method: ') + chalk.white(req.method))
    console.log(chalk.gray('Status: ') + statusColor.bold(statusCode.toString()))
    console.log(chalk.gray('Error: ') + chalk.red(err.message))

    // Log request body if exists
    if (Object.keys(req.body).length > 0) {
        console.log('\n' + chalk.gray('Request Body:') + '\n' + 
            chalk.white(JSON.stringify(req.body, null, 2)))
    }

    // Log stack trace
    if (process.env.NODE_ENV !== 'production') {
        console.log('\n' + chalk.gray('Stack Trace:') + '\n' + 
            formatErrorStack(err.stack))
    }

    // Log separator
    console.log('\n' + chalk.gray('='.repeat(50)) + '\n')

    // Send response to client
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ 
            error: err.message,
            status: 'error'
        })
    } else {
        res.status(500).json({ 
            error: 'Internal server error',
            status: 'error'
        })
    }
}

export default errorHanlder

export class AppError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message)
        this.name = 'AppError'
        this.statusCode = statusCode
    }
}