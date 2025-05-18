const dotenv = require('dotenv').config()
const Express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const app = Express()
const server = http.createServer(app)
app.use(Express.urlencoded({extended:true }))
app.use(Express.json())
app.use(cookieParser())

// Updated CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://[::1]:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

const connectDB = require('./config/db')
// Connect to MongoDB database
connectDB()
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch((error) => {
    console.error('Database connection failed:', error)
    process.exit(1)
  })

//importing all the routes here
const userRoute = require('./Routes/User.Routes')
const transactionRoute = require('./Routes/Transaction.Routes')

app.use('/api/users',userRoute)
app.use('/api/transactions', transactionRoute)

// Add this near the top of server.js
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(compression());
}

// After all other routes
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: "Endpoint not found" 
    });
});

function serverOn(){
    let port =  process.env.PORT || 3000 ;
    server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
    })
}serverOn()