import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        pwdChangedAt: user.pwdChangedAt, // Include the password change timestamp in the token payload
    };

    // Generate a token with a secret key and an expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return token;
};

export { generateToken };
