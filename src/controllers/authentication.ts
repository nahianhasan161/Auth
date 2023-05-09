import { createUser, getUserByEmail } from "../db/users";
import express from "express";
import { authentication, random } from "../helpers/passwordHelper";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("fields are empty");
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.status(400).json("email or password is wrong");
    }
    const exceptedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== exceptedHash) {
      return res.status(403).json("Not Authenticated");
    }
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();
    res.cookie("Hasan-Auth", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    console.log(email, password, username);
    if (!email || !password || !username) {
      console.log("empty");
      return res.status(400).json("Empty Fields");
    }
    /* existing user check */
    const existingUser = await getUserByEmail(email);
    console.log(existingUser);
    if (existingUser) {
      console.log(existingUser);
      console.log("existing user found");
      return res.status(400).json("email already exists!");
    }

    const salt = random();
    const user = createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    /* console.log(user); */
    return res.status(200).json("User Created Successfully").end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
