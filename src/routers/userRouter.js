import express from "express";
import { newUserValidation } from "../middlewares/joiValidation.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { createNewUser, getUserByEmail } from "../models/user/UserModal.js";
import { signAccessJWT, signRefreshJWT } from "../utils/jwt.js";

const router = express.Router();

router.all("/", (req, res, next) => {
  //always execute
  console.log("from all");
  next();
});

//======public controllers======

//create new user
router.post("/", newUserValidation, async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);
    const user = await createNewUser(req.body);

    user?._id
      ? res.json({
          status: "success",
          message: "Your Account has been created successfully",
        })
      : res.json({
          status: "failure",
          message: "Unable to create an account, try again later",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message =
        "Another user already have this email, change your email and try again";
      error.status = 200;
    }
    next(error);
  }
});

//login

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email.includes("@") && !password) {
      throw new Error("Invalid login details");
    }
    // find user by email
    const user = await getUserByEmail(email);
    if (user?._id) {
      // verify the password
      const isPasswordMatched = comparePassword(password, user.password);

      if (isPasswordMatched) {
        //user authentication
        //create token, and return

        return res.json({
          status: "success",
          message: "user authenticated",
          tokens: {
            accessJWT: signAccessJWT({ email }),
            refreshJWT: signRefreshJWT(email),
          },
        });
      }
    }
    res.json({
      status: "error",
      message: "Invalid login details",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
