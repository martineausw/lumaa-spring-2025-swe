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
    await __user_delete_all!();

    const expect = createExpectedUser(0);
    const actual = await createUser("username0", "password0");
    const count = await __user_count!();

    assert.strictEqual(count, 1);
    assert.strictEqual(actual.username, expect.username);
    assert.strictEqual(actual.password, expect.password);
  });

  it("should get a user", async () => {
    await __user_delete_all!();
    await __user_create!(0);

    const expect = createExpectedUser(0);
    const actual = await getUser("username0");

    assert.strictEqual(actual, expect);
  });
});

describe("Task", async () => {
  it("should create a task", async () => {
    await __user_create!();
    await __user_create!(0)!;

    const expect = createExpectedTask(0, 0);
    const actual = await createTask("0", "title0", "description0");
    const count = await __task_count!();

    assert.strictEqual(count, 1);
    assert.strictEqual(actual.title, expect.title);
    assert.strictEqual(actual.description, expect.description);
    assert.strictEqual(actual.isComplete, expect.isComplete);
    assert.strictEqual(actual.userId, expect.userId);
  });

  it("should update a task", async () => {
    await __user_delete_all!();
    await __task_delete_all!();
    await __user_create!(0);
    await __task_create!(0);

    const expect = createExpectedTask(0, 0, true);
    const actual = await updateTask("id0", { isComplete: true });

    assert.strictEqual(actual.title, expect.title);
    assert.strictEqual(actual.description, expect.description);
    assert.strictEqual(actual.isComplete, expect.isComplete);
    assert.strictEqual(actual.userId, expect.userId);
  });

  it("should delete a task", async () => {
    await __user_delete_all!();
    await __task_delete_all!();
    await __user_create!(0);
    await __task_create!(0);

    deleteTask("id0");

    const count = __task_count!();
    assert.strictEqual(count, 0);
  });

  it("should get a task", async () => {
    await __user_delete_all!();
    await __task_delete_all!();
    await __user_create!(0)!;
    await __task_create!(0)!;

    const expect = createExpectedTask(0, 0, false);
    const actual = await getTask("id0");

    assert.strictEqual(actual, expect);
  });

  it("should get 10 tasks", async () => {
    await __user_delete_all!();
    await __task_delete_all!();
    await __user_create!(0)!;
    await __task_populate!(10, 0);

    const expect = [];

    for (let i = 0; i < 10; i++) expect.push(createExpectedTask(i, 0, false));

    const actual = await getTasks();
    assert.deepStrictEqual(actual, expect);
  });

  it("should get 15 tasks with 5 from each user id", async () => {
    await __task_delete_all!();

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

    const actual0 = await getTasks("id0");
    const actual1 = await getTasks("id1");
    const actual2 = await getTasks("id2");

    assert.deepStrictEqual(actual0, expect0);
    assert.deepStrictEqual(actual1, expect1);
    assert.deepStrictEqual(actual2, expect2);
  });
});
