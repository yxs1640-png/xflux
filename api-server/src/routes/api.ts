import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { config } from "../config.js";
import {
  ConsumerApiError,
  fetchTweetById,
  fetchUserByUsername,
  fetchUserTweets,
  searchTweets,
} from "../lib/consumer-client.js";

export const apiRoutes = new Hono();

function toHttpException(err: unknown): HTTPException {
  if (err instanceof ConsumerApiError) {
    const status = err.status >= 400 && err.status < 600 ? err.status : 502;
    return new HTTPException(status as 400, { message: err.message });
  }
  console.error(err);
  return new HTTPException(500, { message: "Internal server error" });
}

apiRoutes.get("/users/:username", async (c) => {
  try {
    const user = await fetchUserByUsername(c.req.param("username"));
    return c.json({ data: user });
  } catch (err) {
    throw toHttpException(err);
  }
});

apiRoutes.get("/users/:username/tweets", async (c) => {
  try {
    const limit = parseInt(c.req.query("limit") || "20", 10);
    const tweets = await fetchUserTweets(c.req.param("username"), limit);
    return c.json({ data: tweets, meta: { count: tweets.length } });
  } catch (err) {
    throw toHttpException(err);
  }
});

apiRoutes.get("/tweets/:id", async (c) => {
  try {
    const tweet = await fetchTweetById(c.req.param("id"));
    return c.json({ data: tweet });
  } catch (err) {
    throw toHttpException(err);
  }
});

apiRoutes.get("/search", async (c) => {
  try {
    const q = c.req.query("q");
    if (!q) {
      throw new HTTPException(400, { message: "Missing query parameter: q" });
    }
    const limit = parseInt(c.req.query("limit") || "20", 10);
    const tweets = await searchTweets(q, limit);
    return c.json({ data: tweets, meta: { query: q, count: tweets.length } });
  } catch (err) {
    throw toHttpException(err);
  }
});

apiRoutes.get("/status", (c) =>
  c.json({
    ok: true,
    provider: "consumer-api",
    baseUrl: config.consumerApiBaseUrl,
    prefix: config.consumerApiPrefix,
  })
);
