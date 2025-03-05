import { Request, Response, NextFunction } from 'express'
import chalk from 'chalk'

const getStatusColor = (status: number) => {
    if (status >= 500) return chalk.red
    if (status >= 400) return chalk.yellow
    if (status >= 300) return chalk.cyan
    return chalk.green
}

const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
        case 'GET': return chalk.blue
        case 'POST': return chalk.green
        case 'PUT': return chalk.yellow
        case 'DELETE': return chalk.red
        default: return chalk.white
    }
}

const formatResponseBody = (body: any): string => {
    if (!body) return ''
    
    try {
        // If body is already a string, try to parse it
        const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
        return JSON.stringify(parsedBody, null, 2)
    } catch (error) {
        // If parsing fails, return the original body
        return typeof body === 'string' ? body : JSON.stringify(body, null, 2)
    }
}

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now()
    const timestamp = new Date().toISOString()
    const methodColor = getMethodColor(req.method)

    // Log request details
    console.log('\n' + chalk.bgBlue.white.bold(' API Request ') + '\n')
    console.log(chalk.gray('Timestamp: ') + chalk.white(timestamp))
    console.log(
        methodColor.bold(req.method.padEnd(6)) + ' ' + 
        chalk.white(req.path)
    )
    
    // Log request body if exists and not empty
    if (Object.keys(req.body).length > 0) {
        console.log('\n' + chalk.gray('Request Body:') + '\n' + 
            chalk.white(JSON.stringify(req.body, null, 2)))
    }

    // Log query parameters if they exist
    if (Object.keys(req.query).length > 0) {
        console.log('\n' + chalk.gray('Query Parameters:') + '\n' + 
            chalk.white(JSON.stringify(req.query, null, 2)))
    }

    // Capture response
    const originalSend = res.send
    let isLogged = false

    res.send = function (body: any): Response {
        if (!isLogged) {
            const duration = Date.now() - start
            const statusColor = getStatusColor(res.statusCode)
            
            console.log('\n' + chalk.bgGreen.white.bold(' API Response ') + '\n')
            console.log(
                chalk.gray('Status: ') + 
                statusColor.bold(res.statusCode.toString())
            )
            console.log(
                chalk.gray('Duration: ') + 
                chalk.white(duration + 'ms')
            )
            
            if (body) {
                console.log('\n' + chalk.gray('Response Body:') + '\n' + 
                    chalk.white(formatResponseBody(body)))
            }
            
            console.log('\n' + chalk.gray('='.repeat(50)) + '\n')
            isLogged = true
        }
        return originalSend.call(this, body)
    }

    next()
} 