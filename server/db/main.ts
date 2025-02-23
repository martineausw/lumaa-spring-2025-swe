import { PrismaClient } from "@prisma/client";
import { webcrypto } from "crypto";
import { devLog } from "utils/logger.js";

const prisma = new PrismaClient();

async function main() {
  devLog("clearing user table");
  await prisma.user.deleteMany();
}

main()
  .catch((error) => {
    console.error(error.message);
  })
  .finally(async () => {
    await prisma.$disconnect;
  });

export const DEBUG_CLIENT =
  process.env.NODE_ENV === "development" ? prisma : undefined;

export type User = {
  id: string;
  username: string;
  password: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  isComplete: boolean;
  userId: string;
};

const users = prisma.user;

export async function createUser(
  username: string,
  password: string
): Promise<User | null> {
  return await users.create({
    data: {
      username,
      password,
    },
  });
}

export async function readUserId(id: string): Promise<User | null> {
  return await users.findUnique({
    where: {
      id,
    },
  });
}

export async function readUserUsername(username: string): Promise<User | null> {
  return await users.findUnique({
    where: {
      username,
    },
  });
}

const tasks = prisma.task;

export async function createTask(
  userId: string,
  title: string,
  description?: string
): Promise<Task | null> {
  return await tasks.create({
    data: {
      title,
      description,
      userId,
    },
  });
}

export async function readTask(id: string): Promise<Task | null> {
  return await tasks.findUnique({
    where: {
      id,
    },
  });
}

export async function readTasks(userId?: string): Promise<Task[] | null> {
  return await tasks.findMany({
    where: {
      userId,
    },
  });
}

export async function updateTask(
  id: string,
  props: object
): Promise<Task | null> {
  return await tasks.update({
    where: {
      id,
    },
    data: {
      ...props,
    },
  });
}

export async function deleteTask(id: string): Promise<Task | null> {
  return await tasks.delete({
    where: {
      id,
    },
  });
}
