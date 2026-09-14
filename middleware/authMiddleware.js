import jwt from 'jsonwebtoken';

export function generateToken(user){
    const token=jwt.sign({
        name:user.name,
        email:user.email,
        role:user.role
    },
    process.env.SECRET_KEY,
    {
        expiresIn:'1h'
    }
);
return token;
}
