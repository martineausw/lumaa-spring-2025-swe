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

export async function createUser(username: string, password: string) {}
export async function getUser(username: string) {
  return await undefined;
}
export async function createTask(
  userId: string,
  title: string,
  description?: string
) {}
export async function updateTask(id: string, task: object) {}
export async function deleteTask(id: string) {}
export async function getTask(id: string) {
  return await undefined;
}
export async function getTasks(userId?: string) {
  return await [];
}
