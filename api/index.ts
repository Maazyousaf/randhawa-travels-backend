import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { default: app } = require("../dist/server.js") as {
	default: import("express").Express;
};

export default app;
