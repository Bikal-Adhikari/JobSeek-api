import { getUserByEmail } from "../models/user/UserModal";
import { verifyAccessJWT } from "../utils/jwt";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = verifyAccessJWT(authorization);
    if (decoded?.email) {
      const tokenObj = await findToken(authorization);
      if (tokenObj?._id) {
        const user = await getUserByEmail(decoded.email);
        if (user?._id) {
          user.password = undefined;
          req.userInfo = user;
          return next();
        }
      }
    }
    const error = {
      status: 403,
      message: decoded,
    };
    next(error);
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  req.userInfo.role === "admin"
    ? next()
    : next({ status: 403, message: "Access denied" });
};

export const jwtAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = verifyRefreshJWT(authorization);

    if (decoded?.email) {
      const user = await getUserByEmail(decoded.email);
      if (user?._id && user.refreshJWT === authorization) {
        user.password = undefined;
        req.userInfo = user;
        return next();
      }
    }

    const error = {
      status: 403,
      message: decoded,
    };
    next(error);
  } catch (error) {
    next(error);
  }
};
