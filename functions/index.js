import { onRequest } from "firebase-functions/v2/https";
import app from "../api/index.js";

export const api = onRequest({ minInstances: 0, concurrency: 80 }, app);
