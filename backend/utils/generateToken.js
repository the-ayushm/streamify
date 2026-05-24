import jwt from 'jsonwebtoken';

export const getCookieOptions = () => ({
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
});

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn : "7d",
    })
    
    res.cookie('streamifyToken', token, getCookieOptions())
} 