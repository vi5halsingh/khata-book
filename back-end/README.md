# Khata Book Backend API

## Project Structure


## Features
- User authentication (JWT tokens)
- Transaction CRUD operations
- Financial summaries
- Email notifications
- Protected routes
- MongoDB database

## Requirements
- Node.js v16+
- MongoDB Atlas or local instance
- Gmail account for email service

## Installation
```bash
git clone https://github.com/your-repo/khata-book.git
cd back-end
npm install

##  environment variables
PORT=5000
MONGO_URI="your_mongodb_uri"
JWT_SECRET="your_jwt_secret"
EMAIL_USER="your_gmail"
EMAIL_APP_PASSWORD="gmail_app_password"

## API Endpoints
### Users Method Path Access Description POST

/api/users/register

Public

User registration POST

/api/users/login

Public

User login GET

/api/users/profile

Private

Get user profile
### Transactions Method Path Access Description POST

/api/transactions

Private

Create transaction GET

/api/transactions

Private

Get filtered transactions GET

/api/transactions/summary

Private
