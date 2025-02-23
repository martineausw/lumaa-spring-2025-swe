import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";
import {
  createRefreshToken,
  createUser,
  readRefreshToken,
  readUserUsername,
} from "../database/prismaClient.ts";
import { IUserIdRequest } from "server.js";

import("dotenv").then((dotenv) => {
  dotenv.config();
});

import {
  __AUTH_ACCESS,
  __AUTH_PORT,
  __AUTH_REFRESH,
} from "src/utils/environmentGuards.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/auth/login", validate, async (req, res) => {
  if (req.body.token) {
    const token = generateAccessToken(req.body.userId);
    res.status(200).json({ token });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await createUser(req.body.username, password);

    const accessToken = generateAccessToken(user!.id);
    const refreshToken = generateRefreshToken(user!.id);

    createRefreshToken(refreshToken);

    res.status(201).json({ accessToken, refreshToken });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send();
  }
});

app.listen(__AUTH_PORT!);

function validate(req: Request, res: Response, next: NextFunction) {
  if (req.body.username !== undefined) {
    validateUsername(req, res, next);
    return;
  }
  if (req.body.token !== undefined) {
    validateToken(req, res, next);
  }
  res.status(400).send();
}

async function validateUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body.password === undefined) {
    res.status(401).send();
    return;
  }
  console.log(req.body.username);
  const user = await readUserUsername(req.body.username);
  if (user === undefined) {
    res.status(401).send();
    return;
  }

  if (!(await bcrypt.compare(req.body.password, user!.password))) {
    res.status(401).send();
    return;
  }

  const userReq = req as IUserIdRequest;
  userReq.userId = user!.id;

  next();
}

async function validateToken(req: Request, res: Response, next: NextFunction) {
  jwt.verify(req.body.token, __AUTH_ACCESS!, (err: any, id: any) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (!id) {
      validateRefreshToken(req, res, next);
      return;
    }

    const userReq = req as IUserIdRequest;
    userReq.userId = id!;

    next();
  });
}

async function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = await readRefreshToken(req.body.token);

  if (refreshToken === undefined) {
    res.status(401).send();
    return;
  }

  jwt.verify(refreshToken!.id, __AUTH_REFRESH!, (err: any, id: any) => {
    if (err || !id) {
      res.status(401).send(err);
      return;
    }
    const userReq = req as IUserIdRequest;
    userReq.userId = id!.id;
    next();
  });
}

function generateAccessToken(userId: string) {
  return jwt.sign({ id: userId }, __AUTH_ACCESS!, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, __AUTH_REFRESH!);
}
