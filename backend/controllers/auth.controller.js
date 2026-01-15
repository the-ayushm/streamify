import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken.js'

export const signup = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // check if user exists
        const userExist = User.findOne({ email, phone });
        if (userExist) {
            return res.json('User already exists!');
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

export const signin = () => {

}

export const signout = () => {

}