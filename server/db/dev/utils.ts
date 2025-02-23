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
      console.warn("[dev] clearing tasks table");
      await DEBUG_CLIENT!.user.deleteMany();
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
  ? async (args: any) => {
      console.warn("[dev] __user_create");
      return await DEBUG_CLIENT!.user.create(args);
    }
  : undefined;

export const __task_create = isDev()
  ? async (args: any) => {
      console.warn("[dev] __user_create");
      return await DEBUG_CLIENT!.task.create(args);
    }
  : undefined;

export const __task_populate = isDev()
  ? async (count: number, userId?: string) => {
      console.warn("[dev] __task_populate");
      const taskCount = await __task_count!();
      const tasks: Task[] = [];

      for (let i = taskCount; i < count + taskCount; i++) {
        const task: Task = await __task_create!({
          id: `id${i}`,
          title: `title${i}`,
          description: `description${i}`,
          userId: userId || `id0`,
        })!;

        tasks.push(task);
      }
      return tasks;
    }
  : undefined;

export const __user_populate = isDev()
  ? async (count: number) => {
      console.warn("[dev] __user_populate");
      const userCount = await __user_count!();
      const users: User[] = [];

      for (let i = userCount; i < count + userCount; i++) {
        const user: User = await __user_create!({
          data: {
            id: `id${i}`,
            username: `username${i}`,
            password: `password${i}`,
          },
        });

        users.push(user);
      }

      return users;
    }
  : undefined;
