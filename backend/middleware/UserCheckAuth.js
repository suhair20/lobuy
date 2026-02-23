
import jwt from "../Services/jwt.js";
export function UserCheckAuth(req, res, next) {
  console.time("TOKEN_VERIFY"); 
console.log("come");

  const token = req.cookies.token;

  if (!token) {
    console.timeEnd("TOKEN_VERIFY");
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const user = jwt.verifyToken(token);
    req.user = user;
    
    console.timeEnd("TOKEN_VERIFY"); 
    next();
  } catch (err) {
    console.timeEnd("TOKEN_VERIFY");
    return res.status(401).json({ message: "Invalid token" });
  }
}