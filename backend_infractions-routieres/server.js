const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const bodyParser = require('body-parser')
dotenv.config()
const cors = require('cors')

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())

app.use('/api', require('./routes/api.route'))

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server running");
    })
})
