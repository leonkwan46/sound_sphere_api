import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/index'
import errorHanlder from './middlewares/errorHandler'
import { loggerMiddleware } from './middlewares/loggerMiddleware'

// App Config
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({ limit: '5mb' }))
app.use(bodyParser.json())

// Logger Middleware
app.use(loggerMiddleware)

// Routes
app.use(routes)

// Error Handler
app.use(errorHanlder)

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
