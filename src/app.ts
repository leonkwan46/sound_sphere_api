import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/index'
import errorHanlder from './middlewares/errorHandler'

// App Config
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({ limit: '5mb' }))
app.use(bodyParser.json())
const port = 3000

// Routes
app.use(routes)

// Error Handler
app.use(errorHanlder)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
