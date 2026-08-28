import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: "7d",
    algorithm: "HS256",
  };

  return jwt.sign(
    {
      id: userId,
    },
    JWT_SECRET,
    options,
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
