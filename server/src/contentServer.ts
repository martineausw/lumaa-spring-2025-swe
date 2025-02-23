import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  readTask,
  readTasks,
  createTask,
  updateTask,
  deleteTask,
} from "src/database/prismaClient.ts";
import { IUserIdRequest } from "server.js";

import("dotenv").then((dotenv) => dotenv.config());

import { __CONTENT_PORT, __AUTH_ACCESS } from "src/utils/environmentGuards.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(authenticate);

app.get("/tasks", async (req, res) => {
  const userReq = req as IUserIdRequest;
  res.status(200).json(await readTasks(userReq.userId));
  return;
});

app.post("/tasks", validateTaskProperties, async (req, res) => {
  const userReq = req as IUserIdRequest;
  await createTask(userReq.userId, req.body.title, req.body.description);
  res.status(300).send();
});

app.put("/tasks/:id", async (req, res) => {
  const task = await readTask(req.params.id);

  if (task === null) res.status(404).send();

  const newTask = {
    title: req.body.title ?? task!.title,
    description: req.body.description ?? task!.description,
    isComplete: req.body.isComplete ?? task!.isComplete,
  };

  res.status(200).json(await updateTask(req.params.id, newTask));
});

app.delete("/tasks/:id", async (req, res) => {
  res.status(200).json(await deleteTask(req.params.id));
});

app.listen(__CONTENT_PORT);

function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  console.log(req.headers.authorization);
  console.log(req.body);

  if (header === null) res.status(401).send();

  const token = header!.split(" ").at(1);

  if (token === null) res.status(401).send();

  let userId;

  jwt.verify(token!, __AUTH_ACCESS!, (err, id) => {
    if (err !== null) res.status(401).send();
    userId = id;
  });

  if (userId === null) res.status(401).send();

  const userReq = req as IUserIdRequest;
  userReq.userId = userId!;

  next();
}

function validateTaskProperties(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body.title === null) res.status(400).send();
  req.body.description ??= "";
  next();
}

export default function (port: number) {
  app.listen();
}
