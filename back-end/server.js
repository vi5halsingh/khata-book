const dotenv = require('dotenv').config()
const Express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const app = Express()
const server = http.createServer(app)
app.use(Express.urlencoded({extended:true }))
app.use(Express.json())
app.use(cookieParser())


app.use(cors({
  origin: ['http://localhost:5173','https://khata-book-lime.vercel.app/', 'http://[::1]:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

const connectDB = require('./config/db')

connectDB()
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch((error) => {
    console.error('Database connection failed:', error)
    process.exit(1)
  })

const userRoute = require('./Routes/User.Routes')
const transactionRoute = require('./Routes/Transaction.Routes')

app.use('/api/users',userRoute)
app.use('/api/transactions', transactionRoute)


if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(compression());
}

// Add after helmet and compression requires
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Add this before route definitions
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply to all requests
app.use(limiter);

// Add winston logging configuration
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

// Add logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

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