import { __task_populate, __user_populate, isDev } from "./prismaUtils.ts";

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
  createUser,
  readUserId,
  readUserUsername,
  createTask,
  readTask,
  readTasks,
  updateTask,
  deleteTask,
} from "./prismaClient.ts";
import {
  __user_delete_all,
  __task_delete_all,
  __user_count,
  __task_count,
  __user_create,
  __task_create,
} from "./prismaUtils.ts";

const createExpectedUser = (index: number) => {
  return {
    id: `id${index}`,
    username: `username${index}`,
    password: `password${index}`,
  };
};

const createExpectedTask = (
  index: number,
  userId: number,
  isComplete?: boolean
) => {
  return {
    id: `id${index}`,
    title: `title${index}`,
    description: `description${index}`,
    isComplete: isComplete ?? false,
    userId: `id${userId}`,
  };
};

console.log("conducting tests");
describe("User", async () => {
  it("should create a user", async () => {
    await __task_delete_all!();
    await __user_delete_all!();

    const expect = createExpectedUser(0);
    const actual = await createUser("username0", "password0");
    const count = await __user_count!();

    assert.strictEqual(count, 1);
    assert.strictEqual(actual!.username, expect.username);
    assert.strictEqual(actual!.password, expect.password);
  });

  it("should get a user using username", async () => {
    await __task_delete_all!();
    await __user_delete_all!();
    await __user_create!(0);

    const expect = createExpectedUser(0);
    const actual = await readUserUsername("username0");

    assert.deepStrictEqual(actual, expect);
  });

  it("should get a user using id", async () => {
    await __task_delete_all!();
    await __user_delete_all!();
    await __user_create!(0);

    const expect = createExpectedUser(0);
    const actual = await readUserId("id0");

    assert.deepStrictEqual(actual, expect);
  });
});

describe("Task", async () => {
  it("should create a task", async () => {
    await __task_delete_all!();
    await __user_delete_all!();
    await __user_create!(0)!;

    const expect = createExpectedTask(0, 0);
    const actual = await createTask("id0", "title0", "description0");
    const count = await __task_count!();

    assert.strictEqual(count, 1);
    assert.strictEqual(actual!.title, expect.title);
    assert.strictEqual(actual!.description, expect.description);
    assert.strictEqual(actual!.isComplete, expect.isComplete);
    assert.strictEqual(actual!.userId, expect.userId);
  });

  it("should update a task", async () => {
    await __task_delete_all!();
    await __user_delete_all!();
    await __user_create!(0);
    await __task_create!(0);

    const expect = createExpectedTask(0, 0, true);
    const actual = await updateTask("id0", { isComplete: true });

    assert.strictEqual(actual!.title, expect.title);
    assert.strictEqual(actual!.description, expect.description);
    assert.strictEqual(actual!.isComplete, expect.isComplete);
    assert.strictEqual(actual!.userId, expect.userId);
  });

  it("should delete a task", async () => {
    await __task_delete_all!();
    await __user_delete_all!();
    await __user_create!(0);
    await __task_create!(0);

    deleteTask("id0");

    const count = await __task_count!();
    assert.strictEqual(count, 0);
  });

  it("should get a task", async () => {
    await __task_delete_all!();
    await __user_delete_all!();
    await __user_create!(0)!;
    await __task_create!(0)!;

    const expect = createExpectedTask(0, 0, false);
    const actual = await readTask("id0");

    assert.deepStrictEqual(actual, expect);
  });

  it("should get 10 tasks", async () => {
    await __task_delete_all!();
    await __user_delete_all!();
    await __user_create!(0)!;
    await __task_populate!(10, 0);

    const expect = [];

    for (let i = 0; i < 10; i++) expect.push(createExpectedTask(i, 0, false));

    const actual = await readTasks();
    assert.deepStrictEqual(actual, expect);
  });

  it("should get 15 tasks with 5 from each user id", async () => {
    await __task_delete_all!();
    await __user_delete_all!();

    await __user_populate!(15);
    await __task_populate!(5, 0);
    await __task_populate!(5, 1);
    await __task_populate!(5, 2);

    const expect0 = [];
    const expect1 = [];
    const expect2 = [];

    for (let i = 0; i < 15; i++) {
      if (i < 5) {
        expect0.push(createExpectedTask(i, 0));
        continue;
      }
      if (i < 10) {
        expect1.push(createExpectedTask(i, 1));
        continue;
      }
      expect2.push(createExpectedTask(i, 2));
    }

    const actual0 = await readTasks("id0");
    const actual1 = await readTasks("id1");
    const actual2 = await readTasks("id2");

    assert.deepStrictEqual(actual0, expect0);
    assert.deepStrictEqual(actual1, expect1);
    assert.deepStrictEqual(actual2, expect2);
  });
});
