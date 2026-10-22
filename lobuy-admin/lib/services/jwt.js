import jwt from "jsonwebtoken";

const MIN_SECRET_LENGTH = 32;

function readSecret() {
  const secret = process.env.JWT_TOKEN;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    const message = `JWT_TOKEN must be set to a random string of at least ${MIN_SECRET_LENGTH} characters.`;
    if (process.env.NODE_ENV === "production") throw new Error(message);
    console.warn(`[jwt] ${message}`);
  }
  return secret;
}

class Jwt {
  constructor(expiresIn = "24h") {
    this.expiresIn = expiresIn;
  }

  genrateToken(payload) {
    return jwt.sign(payload, readSecret(), { expiresIn: this.expiresIn, algorithm: "HS256" });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, readSecret(), { algorithms: ["HS256"] });
    } catch {
      throw new Error("Token verification failed");
    }
  }
}

export default new Jwt();
