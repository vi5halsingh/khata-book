const express = require('express');
const Router = express();
const UserController = require('../Controller/User.Controller.js'); 
Router.get('/', (req, res) => {
    res.json('Hello World!');
});
 
const authMiddleware = require('../middleware/auth.middleware');

Router.get('/profile', authMiddleware, (req, res) => {
    res.json(req.user);
});

Router.post('/register', UserController.register);
Router.post('/login', UserController.login);
Router.put('/profile/update', authMiddleware, UserController.updateProfile);
Router.post('/logout', authMiddleware, UserController.logout);

const ReciveEmail = require('../services/EmailSender.js');
Router.post('/contact',authMiddleware, (req, res) =>{
    const { name, email, mobile, message } = req.body;
    ReciveEmail(name, email, mobile, message);
    res.json({ msg: 'Email sent successfully' });
}
);
module.exports = Router;