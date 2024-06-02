import JWT from "jsonwebtoken";
import { updateUser } from "../models/user/UserModal.js";
import { insertToken } from "../models/session/SessionModal.js";

// create access jwt

export const signAccessJWT = (payload) => {
  const token = JWT.sign(payload, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "15m",
  });
  insertToken({ token });
  return token;
};

// verify access jwt

export const verifyAccessJWT = (token) => {
  try {
    return JWT.verify(token, process.env.ACCESS_JWT_SECRET);
  } catch (error) {
    console.log(error.message);
    return error.message === "jwt expired" ? "jwt expired" : "invalid token";
  }
  // return JWT.verify(token, );
};

// create refresh jwt

export const signRefreshJWT = (email) => {
  const refreshJWT = JWT.sign({ email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "30d",
  });
  updateUser({ email }, { refreshJWT });
  return refreshJWT;
};

// verify refresh jwt
export const verifyRefreshJWT = (token) => {
  try {
    return JWT.verify(token, process.env.ACCESS_JWT_SECRET);
  } catch (error) {
    console.log(error.message);
    return "invalid token";
  }
};
