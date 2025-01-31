import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "10h" });
};

export const generateRefressToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            throw new Error("Token has expired");
        }
        throw new Error("Token is invalid");
    }
};
