import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    console.log("Setting token cookie: ", token);

    res.cookie("token", token, {
        httpOnly: true, // prevent XSS attacks
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict", // prevent csrf attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
}