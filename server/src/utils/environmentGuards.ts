export const __MODE_DEV = (function () {
  if (process.env.NODE_ENV === "development") {
    console.warn("[development] application in development mode");
    return true;
  }
  return false;
})();

export const __DATABASE_URL = function () {
  if (process.env.DATABASE_URL === null) {
    console.error(
      "DATABASE_URL environment variable for content server is undefined"
    );

    console.log(
      "e.g.",
      'DATABASE_URL="postgresql://johndoe:password@localhost:5432/task-manager"'
    );
    process.abort();
  }
  return process.env.DATABASE_URL;
};

export const __CONTENT_PORT = (function () {
  if (process.env.CONTENT_PORT === null) {
    console.error(
      "CONTENT_PORT environment variable for content server is undefined"
    );
    console.log("e.g.", "CONTENT_PORT=3000");
    process.abort();
  }
  return process.env.CONTENT_PORT!;
})();

export const __AUTH_PORT = (function () {
  if (process.env.AUTH_PORT === null) {
    console.error(
      "AUTH_PORT environment variable for content server is undefined"
    );
    console.log("e.g.", "AUTH_PORT=4000");
    process.abort();
  }
  return process.env.AUTH_PORT!;
})();

export const __AUTH_ACCESS = (function () {
  if (process.env.AUTH_ACCESS === null) {
    console.error(
      "AUTH_ACCESS environment variable for content server is undefined"
    );
    console.log(
      "Expects 64-byte hex string",
      "e.g.",
      'AUTH_ACCESS={{ require("crypto").randomBytes(64).toString("hex"); }}'
    );
    process.abort();
  }
  return process.env.AUTH_ACCESS;
})();

export const __AUTH_REFRESH = (function () {
  if (process.env.AUTH_REFRESH === null) {
    console.error(
      "AUTH_REFRESH environment variable for content server is undefined"
    );
    console.log(
      "Expects 64-byte hex string",
      "e.g.",
      'AUTH_REFRESH={{ require("crypto").randomBytes(64).toString("hex"); }}'
    );
    process.abort();
  }
  return process.env.AUTH_REFRESH;
})();

export const __UNLOCK_DATABASE_TEST = function () {
  if (process.env.__UNLOCK_DATABASE_TEST) {
    console.error(
      "UNLOCK_DATABASE_TEST enviornment variable is true allowing destructive actions for database tests",
      "Ensure that the DATABASE_URL connection appropriate for such mutations"
    );
  }
};
