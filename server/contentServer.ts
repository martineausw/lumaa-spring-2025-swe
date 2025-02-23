import("dotenv").then((dotenv) => dotenv.config());

import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  readTask,
  readTasks,
  createTask,
  updateTask,
  deleteTask,
} from "prismaClient.ts";

const app = express();

app.use(express.json());
app.use(authenticate);

app.get("/tasks", async (req, res) => {
  res.status(200).json(await readTasks(req.userId));
});

app.post("/tasks", validateTaskProperties, async (req, res) => {
  await createTask(req.userId, req.body.title, req.body.description);
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

app.listen(process.env.CONTENT_PORT!);

function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (header === null) res.status(401).send();

  const token = header!.split(" ").at(1);

  if (token === null) res.status(401).send();

  let userId;

  jwt.verify(token!, process.env.AUTH_ACCESS!, (err, id) => {
    if (err !== null) res.status(401).send();
    userId = id;
  });

  if (userId === null) res.status(401).send();

  req.userId = userId;

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
