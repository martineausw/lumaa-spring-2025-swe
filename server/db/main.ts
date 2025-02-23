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

export async function insertUser(
  username: string,
  password: string
): Promise<User> {
  return new Promise(() => {});
}

export async function selectUserWithId(id: string): Promise<User> {
  return new Promise(() => {});
}

export async function selectUserWithUsername(username: string): Promise<User> {
  return new Promise(() => {});
}

export async function insertTask(
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

export async function selectTask(id: string): Promise<Task> {
  return new Promise(() => {});
}

export async function selectTasks(userId?: string): Promise<Task[]> {
  return new Promise(() => {});
}
