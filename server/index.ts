import server from "src/contentServer.ts";

import("dotenv").then((dotenv) => dotenv.config());

import { __CONTENT_PORT } from "src/utils/environmentGuards.ts";

server(parseInt(__CONTENT_PORT!));
