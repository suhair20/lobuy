
import jwt from "../Services/jwt.js";
export function UserCheckAuth(req, res, next) {
  console.time("TOKEN_VERIFY"); // <-- START TIMER

  const token = req.cookies.token;

  if (!token) {
    console.timeEnd("TOKEN_VERIFY");
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const user = jwt.verifyToken(token);
    req.user = user;
    
    console.timeEnd("TOKEN_VERIFY"); // <-- END TIMER
    next();
  } catch (err) {
    console.timeEnd("TOKEN_VERIFY");
    return res.status(401).json({ message: "Invalid token" });
  }
}