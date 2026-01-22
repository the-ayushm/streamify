import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken.js'

// ========================= SIGN UP =====================================================================
export const signup = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // check if user exists
        const userExist = await User.findOne({
            $or: [{ email }, { phone }]
        });
        if (userExist) {
            return res.status(409).json({ error: 'User already exists!' });
        }

        // hash password using bcrypt.js
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save user to DB
        const user = await User.create({ fullName, email, phone, password: hashedPassword });

        // generate token
        generateToken(user._id, res);
        res.status(201).json({
            message: 'User created successfully!',
            user: {
                _id: user._id,
                email: user.email,
                phone: user.phone
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// =================== SIGN IN =========================================================================
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User does not exists!" });
        }

        // validate password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Incorrect Password!" });
        }

        // generate token if user exists
        generateToken(user._id, res);
        console.log("USER SIGNED IN SUCCESSFULLY!");
        // send response
        res.status(200).json({
            message: "User signed in successfully!",
            user: {
                _id: user._id,
                name: user.fullName,
                email: user.email,
                phone: user.phone
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error!" });
    }
}

// ============= SIGN OUT ===============================================================================
export const signout = (req, res) => {
    // clear cookie first
    res.clearCookie("streamifyToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    });
    // send logout response
    return res.status(200).json({
        message: "User logged out successfully!"
    })
}

// ================= GET ME ==============================================================================
export const getMe = (req, res) => {
  res.status(200).json({
    user: {
      _id: req.user._id,
      name: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
    },
  });
};
