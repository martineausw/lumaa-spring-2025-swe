import { PrismaClient } from "@prisma/client";
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

export async function readTask(id: string): Promise<Task> {
  return new Promise(() => {});
}

export async function readTasks(userId?: string): Promise<Task[]> {
  return new Promise(() => {});
}

export async function createTask(
  userId: string,
  title: string,
  description?: string
): Promise<Task> {
  return new Promise(() => {});
}

export async function updateTask(id: string, task: object): Promise<Task> {
  return new Promise(() => {});
}

export async function deleteTask(id: string) {}
