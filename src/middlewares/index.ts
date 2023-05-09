import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["Hasan-Auth"];
    if (!sessionToken) {
      /* return res.send(401).json("Not Authenticated"); */
      return res.sendStatus(401);
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      /* return res.send(401).json("Not User Found"); */
      return res.sendStatus(404);
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    if (currentUserId.toString() !== id) {
      return res.sendStatus(402);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};
