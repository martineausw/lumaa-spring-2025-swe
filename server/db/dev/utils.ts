export const isDev = () => process.env.NODE_ENV === "development" || undefined;

import { DEBUG_CLIENT, User, Task } from "../main.ts";

export const __user_delete_all = isDev()
  ? async () => {
      console.warn("[dev] __user_delete_all");
      await DEBUG_CLIENT!.user.deleteMany();
    }
  : undefined;

export const __task_delete_all = isDev()
  ? async () => {
      console.warn("[dev] __task_delete_all");
      await DEBUG_CLIENT!.task.deleteMany();
    }
  : undefined;

export const __user_count = isDev()
  ? async () => {
      console.warn("[dev] __user_count");
      return await DEBUG_CLIENT!.user.count();
    }
  : undefined;

export const __task_count = isDev()
  ? async () => {
      console.warn("[dev] __task_count");
      return await DEBUG_CLIENT!.task.count();
    }
  : undefined;

export const __user_create = isDev()
  ? async (index?: number) => {
      console.warn("[dev] __user_create");
      index ??= await __user_count!();
      return await DEBUG_CLIENT!.user.create({
        data: {
          id: `id${index}`,
          username: `username${index}`,
          password: `password${index}`,
        },
      });
    }
  : undefined;

export const __task_create = isDev()
  ? async (userId?: number, isComplete?: boolean, index?: number) => {
      console.warn("[dev] __user_create");
      userId ??= await __user_count!();
      index ??= await __task_count!();
      return await DEBUG_CLIENT!.task.create({
        data: {
          id: `id${index}`,
          title: `title${index}`,
          description: `description${index}`,
          userId: `id${userId}`,
          isComplete: !!isComplete,
        },
      });
    }
  : undefined;

export const __refresh_token_clear = isDev()
  ? async (id?: string) => {
      console.warn("[dev] __refresh_token_delete");
      return await DEBUG_CLIENT!.task.deleteMany();
    }
  : undefined;

export const __task_populate = isDev()
  ? async (
      count: number,
      userId?: number,
      isComplete?: boolean,
      start?: number
    ) => {
      console.warn("[dev] __task_populate");
      start ??= await __task_count!();
      const tasks: Task[] = [];

      for (let i = start; i < count + start; i++) {
        const task: Task = await __task_create!(userId, false, i);

        tasks.push(task);
      }
      return tasks;
    }
  : undefined;

export const __user_populate = isDev()
  ? async (count: number, start?: number) => {
      console.warn("[dev] __user_populate");

      start ??= await __user_count!();

      const users: User[] = [];
      for (let i = start; i < count + start; i++) {
        const user: User = await __user_create!(i);

        users.push(user);
      }

      return users;
    }
  : undefined;
