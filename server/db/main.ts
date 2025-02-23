import { PrismaClient } from "@prisma/client";
import { webcrypto } from "crypto";
import { isDev } from "./dev/utils.ts";
import { devLog } from "utils/logger.ts";

const prisma = new PrismaClient();

async function main() {
  if (isDev()) {
    await prisma.refreshTokens.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  }
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

export type RefreshToken = {
  id: string;
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

const refreshTokens = prisma.refreshTokens;

export async function createRefreshToken(
  id: string
): Promise<RefreshToken | null> {
  return await refreshTokens.create({
    data: {
      id,
    },
  });
}

export async function readRefreshToken(
  id: string
): Promise<RefreshToken | null> {
  return await refreshTokens.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteRefreshToken(
  id: string
): Promise<RefreshToken | null> {
  return await refreshTokens.delete({
    where: {
      id,
    },
  });
}
