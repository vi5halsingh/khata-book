const User = require('../Models/User.Model');

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
            res.clearCookie('authToken');
            
            res.json({ msg: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ msg: error.message });
        }
    },

    // contact: async (req, res) => {
    //     try {
    //        const { name , email, mobileNo, message}  = req.body;
           
    //     } catch (error) {
    //         console.error('Contact error:', error);
    //         return res.status(500).json({ msg: error.message });
    //       }
    // },
}
module.exports = UserController;