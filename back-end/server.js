const dotenv = require('dotenv').config();
const Express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const { handleUserMessage } = require('./services/chatbot.service');
const User = require('./Models/User.Model');

const app = Express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://khata-book-lime.vercel.app',
  'https://khata-book-r8a8.onrender.com',
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(cookieParser());

// Update CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const connectDB = require('./config/db')

connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

const userRoute = require('./Routes/User.Routes')
const transactionRoute = require('./Routes/Transaction.Routes')

app.use('/api/users', userRoute);
app.use('/api/transactions', transactionRoute);


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

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
      socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return next(new Error('Unauthorized'));
    }

    socket.user = user;
    return next();
  } catch (error) {
    console.error('Socket auth error:', error.message);
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id} for user ${socket.user._id}`);

  socket.emit('chat:connected', {
    message: 'Connected to KhataBook AI assistant.',
  });

  socket.on('chat:user_message', async (payload = {}) => {
    const { message, history } = payload;
    if (!message || !message.trim()) {
      return;
    }

    socket.emit('chat:bot_typing');

    try {
      const response = await handleUserMessage({
        userId: socket.user._id,
        message,
        history,
      });

      socket.emit('chat:bot_response', {
        text: response.answer,
        references: response.references,
      });
    } catch (error) {
      console.error('Chatbot message error:', error);
      socket.emit('chat:error', {
        message:
          error.message ||
          'Unable to process your request at the moment. Please try again later.',
      });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${socket.id} (${reason})`);
  });
});

function serverOn() {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
}

serverOn();