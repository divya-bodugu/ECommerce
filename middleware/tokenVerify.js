import jwt from "jsonwebtoken";
import "dotenv";
const key = process.env.SECRET_KEY;

export const tokenVerify = async (req,res,next) => {
    try {
        const authToken = req.headers.authorization;
        if (!authToken || !authToken.startsWith("Bearer ")) {
            return res.status(400).json({
                mesage : "Invalid Token"
            });
        }
            const token = authToken.split(" ")[1];
            const decode = jwt.verify(token, key);
            req.user = decode;
            next();

    } catch (err) {
        return res.status(400).json({
            status : "Invalid Token",
            message : err.mesage
        });
    }
}