import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("API health", () => {
  it("returns ok for health endpoint", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});

