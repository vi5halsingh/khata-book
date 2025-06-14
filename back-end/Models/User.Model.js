const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
    },
    mobileNo: {
        type: Number,
        required: function() {
            return !this.isGoogleUser; // Only required for non-Google users
        },
        min: 1000000000,
        max: 9999999999,
        unique:true
    },
    password: {
        type: String,
        required: function() {
            return !this.isGoogleUser; // Only required for non-Google users
        },
        select: false,
        min: 6,
    },
    category: {
        type: String,
        enum: ['general', 'obc', 'sc/st', ''],
        default: ''
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        sparse: true
    },
    picture: {
        type: String
    },
    socketId: {
        type: String,
        min: 6,
    }
}, { timestamps: true });

UserSchema.methods.generateToken =async function() {
  jwt.sign({
    _id: this._id,
    name: this.name,
    mobileNo: this.mobileNo,
    email: this.email,
    socketId: this.socketId,
  }, process.env.JWT_SECRET, { expiresIn: '5h' });
}
UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, JWT_SECRET, { expiresIn: '24h' });
    return token;
}
UserSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

UserSchema.methods.comparePassword = async function(password) {
  if (!this.password || !password) {
    console.log("this :", this.password , "password is ", password)
    return false; // Return false if either password is 
  }
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema );