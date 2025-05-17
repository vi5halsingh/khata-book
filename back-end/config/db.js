const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        return conn
    } catch (error) {
        throw error
    }
}

module.exports = connectDB
