import("dotenv").then((dotenv) => {
  dotenv.config();
});

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  User,
  createRefreshToken,
  createUser,
  readRefreshToken,
  readUserId,
  readUserUsername,
} from "../db/main.ts";

const app = express();

app.use(express.json());

app.post("/auth/login", async (req, res) => {
  if (req.body.token) {
    let id = await validateAccessToken(req.body.token);
    if (id) {
      res.status(201).send();
      return;
    }

    id = await validateRefreshToken(req.body.token);
    if (id) {
      const accessToken = generateAccessToken(id);
      res.status(201).json({ accessToken });
      return;
    }
  }

  if (req.body.username === null || req.body.password === null) {
    res.status(401).send();
    return;
  }

  const user = await readUserUsername(req.body.username);

  if (user === null) {
    console.log("username not found");
    res.status(401).send();
  }

  try {
    if (await bcrypt.compare(req.body.password, user!.password)) {
      res.status(201).send();
      return;
    }
  } catch (err: any) {
    console.error(err.message);
    res.send(500).send();
    return;
  }

  res.status(401).send();
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

app.listen(process.env.AUTH_PORT);

function generateAccessToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.AUTH_ACCESS!, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(userId: string) {
  return jwt.sign(userId, process.env.AUTH_ACCESS!);
}

async function validateAccessToken(token?: string) {
  if (token === null) {
    console.log("no token provided");
    return;
  }
  let id;
  jwt.verify(token!, process.env.AUTH_ACCESS!, (err, userId) => {
    if (err) {
      console.log(err.message);
      return;
    }

    id = userId;
  });

  console.log(id);
  return id;
}

async function validateRefreshToken(token?: string) {
  if (token === null) {
    console.log("no token provided");
    return;
  }

  const validToken = await readRefreshToken(token!);
  if (validToken === null) {
    console.log("invalid refresh token");
    return;
  }

  let id;
  jwt.verify(validToken!.id, process.env.AUTH_REFRESH!, (err, userId) => {
    if (err) {
      console.log(err.message);
      return;
    }

    id = userId;
  });

  console.log(id);
  return id;
}
