import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey"; // 🔴 hardcoded for now

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent XSS
    sameSite: "strict", // prevent CSRF
    secure: false, // development mode
  });

  return token;
};
