const User = require('../Models/User.Model');
const { OAuth2Client, GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const UserController = {
    register: async (req, res) => {
        try {
            const { name,mobileNo, email, password } = req.body;
            const user = await User.findOne({ mobileNo: mobileNo });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            const hashedPassword = await User.hashPassword(password);
            console.log(hashedPassword);
            const newUser = new User({ name, mobileNo, email, password: hashedPassword });
            await newUser.save();

            const token = newUser.generateAuthToken();
            console.log(token);

            res.json({ msg: 'Register Success' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
            console.log(err)
        }
    },
    login: async (req, res) => {
        try {
            const { mobileNo, password } = req.body;
            const user = await User.findOne({ mobileNo: mobileNo }).select('+password');
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
            
            // Generate token for authenticated user
            const token = user.generateAuthToken();
            
          // In your login controller
res.cookie('authToken', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, 
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    sameSite: 'strict'
  }).json({ 
    msg: 'Login Success',
    token 
  });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { name, email, mobileNo, category } = req.body;
            
            // Find user by ID (from auth middleware)
            const user = await User.findById(req.user._id);
            
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
            
            // Update user fields if provided
            if (name) user.name = name;
            if (email) user.email = email;
            if (mobileNo) user.mobileNo = mobileNo;
            if (category) user.category = category;
            
            // Save updated user
            await user.save();
            
            res.json({
                msg: 'Profile updated successfully',
                user: {
                    name: user.name,
                    email: user.email,
                    mobileNo: user.mobileNo,
                    category: user.category
                }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            return res.status(500).json({ msg: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            // Clear the auth cookie
            res.clearCookie('authToken',{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });
            
            res.json({ msg: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ msg: error.message });
        }
    },
    GoogleLogin:  async (req, res) => {
        try {
          const { token } = req.body;
          
          if (!token) {
            return res.status(400).json({ msg: 'No token provided' });
          }
      
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
      
          const payload = ticket.getPayload();
          const { email, name, picture, sub: googleId } = payload;
      
          // Find or create user
          let user = await User.findOne({email});
          
          if (!user) {
            // Create new user if doesn't exist
            user = new User({
              email,
              name,
              password: await User.hashPassword(Math.random().toString(36).slice(-8)),
              isGoogleUser: true,
              googleId,
              picture
            });
            await user.save();
          }
      
          // Generate JWT token with user ID
          const authToken = jwt.sign(
            { _id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
          );
      
          // Set cookie
          res.cookie('authToken', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
          });
      
          // Send response with token
          res.json({
            success: true,
            token: authToken,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              picture: user.picture
            }
          });
      
        } catch (error) {
          console.error('Google login error:', error);
          res.status(401).json({ 
            success: false,
            msg: 'Google authentication failed: ' + error.message 
          });
        }
      },
    DeleteProfile: async (req ,res) => {
        const userId = req.user._id;
        if(!userId)
             { res.json("No user found")}
        const user =await User.findById(userId)
        console.log(user)
        const deleteUser =await User.findByIdAndDelete(user._id)
        if(!deleteUser){
            res.status(400).json("Something wrong to delete  you")
        }
        res.json("goodBye but Hope we will meet soon")
    }

}
module.exports = UserController;