const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../server')
const User = require('../models/User')
const Note = require('../models/Note')
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_TEST_URI);
});

// Closing database connection after each test.
afterAll(async () => {
    await mongoose.connection.close();
});

describe("GET /notes on empty {collection}", () => {
    it("should return 'No notes found'", async () => {
        const res = await request(app).get("/notes");
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('No notes found');
    });
});

describe("POST /notes without all fields", () => {
    it("should return 400 'All fields are required'", async () => {
        const res = await request(app).post("/notes").send({
            title: "TODO",
            text: "Clean the kitchen"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("All fields are required");

    });
});

describe("POST /notes", () => {
    it("should create a note", async () => {
        const res = await request(app).post("/notes").send({
            user: "63c702ef970ba1ff43fa99a0",
            title: "TODO",
            text: "Clean the kitchen"
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("New note created");

    });
});

describe("GET /notes", () => {
    it("should return all notes", async () => {
        const res = await request(app).get("/notes");
        expect(res.statusCode).toBe(400);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("DELETE /note", () => {
    it("should delete a note", async () => {
        const note = await Note.findOne({title: 'TODO'}).lean().exec()
        const res = await request(app).delete("/notes").send({
            _id: note._id.toString()
        });
        expect(res.statusCode).toBe(200);
    });
});