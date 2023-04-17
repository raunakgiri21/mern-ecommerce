const express = require('express');
const connectDB = require('./db/connect')
require('dotenv').config()
const passport = require('passport')
const session = require('cookie-session')
const passportSetup = require('./helpers/passport-setup')
const morgan = require('morgan')
const cors = require('cors')

// import routes
const auth = require('./routes/auth');
const user = require('./routes/user'); 
const category = require('./routes/category')
const product = require('./routes/product')

const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))

app.get('/',(req,res)=> {
    res.status(200).json({msg: "Welcome!"})
})


app.use(session({
    maxAge: 7*24*60*60*1000,
    keys: ['secret']
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// use routes
app.use('/api/v1/auth',auth)
app.use('/api/v1/user',user)
app.use('/api/v1/category',category)
app.use('/api/v1/product',product)











const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log(`The server is listening to http://localhost:${port} ...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()