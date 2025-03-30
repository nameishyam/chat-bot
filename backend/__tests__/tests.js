import request from "supertest";
import mongoose from "mongoose";
import express from "express";
import { jest } from "@jest/globals";
import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";
import model from "../lib/gemini.js";

// Mock dependencies
jest.mock("@clerk/express", () => ({
  requireAuth: () => (req, res, next) => {
    req.auth = { userId: "test-user-id" };
    next();
  },
}));

jest.mock("../models/chat.js");
jest.mock("../models/userChats.js");
jest.mock("../lib/gemini.js");

// Mock ImageKit
jest.mock("imagekit", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getAuthenticationParameters: jest.fn().mockReturnValue({
        token: "mock-token",
        signature: "mock-signature",
        expire: 9999999999,
      }),
    };
  });
});

// Express app setup
let app;

beforeAll(() => {
  // Dynamic import for the Express app to avoid execution during Jest's parse phase
  return import("../index.js").then((module) => {
    app = module.default || module;
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("API Endpoints", () => {
  describe("GET /api/upload", () => {
    test("should return authentication parameters", async () => {
      const response = await request(app).get("/api/upload");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("signature");
      expect(response.body).toHaveProperty("expire");
    });
  });

  describe("POST /api/chats", () => {
    test("should create a new chat", async () => {
      const mockSavedChat = { _id: "new-chat-id" };
      Chat.prototype.save.mockResolvedValue(mockSavedChat);
      UserChats.find.mockResolvedValue([]);
      model.generateContent.mockResolvedValue({
        response: {
          text: () => "Generated Title",
        },
      });

      const response = await request(app)
        .post("/api/chats")
        .send({ text: "Hello, bot!" });

      expect(response.status).toBe(201);
      expect(response.text).toBe("new-chat-id");
      expect(Chat).toHaveBeenCalledWith({
        userId: "test-user-id",
        history: [
          {
            role: "user",
            parts: [{ text: "Hello, bot!" }],
          },
        ],
      });
      expect(UserChats.prototype.save).toHaveBeenCalled();
    });

    test("should add to existing user chats", async () => {
      const mockSavedChat = { _id: "new-chat-id" };
      Chat.prototype.save.mockResolvedValue(mockSavedChat);
      UserChats.find.mockResolvedValue([{ userId: "test-user-id", chats: [] }]);
      model.generateContent.mockResolvedValue({
        response: {
          text: () => "Generated Title",
        },
      });

      const response = await request(app)
        .post("/api/chats")
        .send({ text: "Hello again!" });

      expect(response.status).toBe(201);
      expect(UserChats.updateOne).toHaveBeenCalled();
    });
  });

  describe("GET /api/userchats", () => {
    test("should return user chats", async () => {
      const mockUserChats = [
        { userId: "test-user-id", chats: [{ _id: "chat-1", title: "Chat 1" }] },
      ];
      UserChats.find.mockResolvedValue(mockUserChats);

      const response = await request(app).get("/api/userchats");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ _id: "chat-1", title: "Chat 1" }]);
    });
  });

  describe("GET /api/chats/:id", () => {
    test("should return a specific chat", async () => {
      const mockChat = {
        _id: "chat-1",
        userId: "test-user-id",
        history: [
          { role: "user", parts: [{ text: "Hello" }] },
          { role: "model", parts: [{ text: "Hi there!" }] },
        ],
      };
      Chat.findOne.mockResolvedValue(mockChat);

      const response = await request(app).get("/api/chats/chat-1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockChat);
      expect(Chat.findOne).toHaveBeenCalledWith({
        _id: "chat-1",
        userId: "test-user-id",
      });
    });
  });

  describe("PUT /api/chats/:id", () => {
    test("should update a chat with new messages", async () => {
      const mockUpdateResult = { nModified: 1 };
      Chat.updateOne.mockResolvedValue(mockUpdateResult);

      const response = await request(app).put("/api/chats/chat-1").send({
        question: "How does this work?",
        answer: "Let me explain...",
        img: "image-url.jpg",
      });

      expect(response.status).toBe(200);
      expect(Chat.updateOne).toHaveBeenCalledWith(
        { _id: "chat-1", userId: "test-user-id" },
        {
          $push: {
            history: {
              $each: [
                {
                  role: "user",
                  parts: [{ text: "How does this work?" }],
                  img: "image-url.jpg",
                },
                { role: "model", parts: [{ text: "Let me explain..." }] },
              ],
            },
          },
        }
      );
    });

    test("should update a chat with only an answer", async () => {
      const mockUpdateResult = { nModified: 1 };
      Chat.updateOne.mockResolvedValue(mockUpdateResult);

      const response = await request(app)
        .put("/api/chats/chat-1")
        .send({ answer: "Standalone answer" });

      expect(response.status).toBe(200);
      expect(Chat.updateOne).toHaveBeenCalledWith(
        { _id: "chat-1", userId: "test-user-id" },
        {
          $push: {
            history: {
              $each: [
                { role: "model", parts: [{ text: "Standalone answer" }] },
              ],
            },
          },
        }
      );
    });
  });

  describe("Error handling", () => {
    test("should handle database errors", async () => {
      Chat.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/chats/invalid-id");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});
