import jwt from 'jsonwebtoken';

const createToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email }, 
        process.env.JWT_SECRET,              
        { expiresIn: '30d' }                 
    );
};

export default createToken;