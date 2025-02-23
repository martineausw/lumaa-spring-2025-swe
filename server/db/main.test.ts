import { __task_populate, __user_populate, isDev } from "./dev/utils.ts";

if (!isDev()) {
  console.error(
    'Requires NODE_ENV to be "development" to export client for testing',
    "Database tests are destructive operations",
    "Additionally, consider switching to a temporary testing table"
  );
}

import { describe, it } from "node:test";
import assert from "node:assert";
import {
  User,
  Task,
  createUser,
  getUser,
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getTasks,
} from "./main.ts";
import {
  __user_delete_all,
  __task_delete_all,
  __user_count,
  __task_count,
  __user_create,
  __task_create,
} from "./dev/utils.ts";

console.log("conducting tests");
describe("User", async () => {
  it("should create a user", () => {
    __user_delete_all!();

    createUser("foo", "bar");

    const count = __user_count!();
    assert.strictEqual(count, 1);
  });

  it("should get a user", async () => {
    __user_delete_all!();

    const expected = await __user_create!({
      data: {
        username: "foo",
        password: "bar",
      },
    });

    const actual = await getUser("foo");
    assert.strictEqual(actual, expected);
  });
});

describe("Task", async () => {
  it("should create a task", async () => {
    __user_delete_all!();
    __task_delete_all!();

    const user: User = await __user_create!({
      data: {
        username: "foo",
        password: "bar",
      },
    })!;

    await createTask(user.id, "foo");
    const count = __task_count!();
    assert.strictEqual(count, 1);
  });

  it("should update a task", async () => {});

  it("should delete a task", async () => {
    __user_delete_all!();
    __task_delete_all!();

    const user: User = await __user_create!({
      data: {
        username: "foo",
        password: "bar",
      },
    })!;

    const task: Task = await __task_create!({
      data: {
        title: "fizz",
        description: "buzz",
        userId: user.id,
      },
    })!;

    deleteTask(task.id);
    const count = __task_count!();
    assert.strictEqual(count, 0);
  });

  it("should get a task", async () => {
    __user_delete_all!();
    __task_delete_all!();

    const user: User = await __user_create!({
      data: {
        username: "foo",
        password: "bar",
      },
    })!;

    const task: Task = await __task_create!({
      data: {
        title: "fizz",
        description: "buzz",
        userId: user.id,
      },
    })!;

    const actual = await getTask(task.id);

    assert.strictEqual(actual, task);
  });

  it("should get 10 tasks", async () => {
    __user_delete_all!();
    __task_delete_all!();

    await __user_create!({
      data: {
        id: "id0",
        username: "foo",
        password: "bar",
      },
    })!;

    await __task_populate!(10, "id0");

    const actual = await getTasks();
    assert.strictEqual(actual.length, 10);
  });

  it("should get 15 tasks with 5 from each user id", async () => {
    __task_delete_all!();

    await __user_populate!(15);
    await __task_populate!(5, "id0");
    await __task_populate!(5, "id1");
    await __task_populate!(5, "id2");

    const task0Count = await getTasks("id0");
    const task1Count = await getTasks("id1");
    const task2Count = await getTasks("id2");

    assert.strictEqual(task0Count.length, 5);
    assert.strictEqual(task1Count.length, 5);
    assert.strictEqual(task2Count.length, 5);
  });
});
