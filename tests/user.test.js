const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../server')
const User = require('../models/User')
require("dotenv").config();


// Connecting to the database before each test.
beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_TEST_URI);
});

// Closing database connection after each test.
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Sanity test', () => {
    test('1 should equal 1', () => {
        expect(1).toBe(1)
    })
})


describe("GET /users on empty {collection}", () => {
    it("should return 'No users found'", async () => {
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('No users found');
    });
});

describe("POST /users without all fields", () => {
    it("should create a user", async () => {
        const res = await request(app).post("/users").send({
            username: "Sacha",
            password: "!Hb12345"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("All fields are required");

    });
});

describe("POST /users", () => {
    it("should create a user", async () => {
        const res = await request(app).post("/users").send({
            username: "Sacha",
            password: "!Hb12345",
            roles: ["Employee"]
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("New user Sacha created");

    });
});

describe("GET /users", () => {
    it("should return all users", async () => {
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("DELETE /users", () => {
    it("should delete a user", async () => {
        const user = await User.findOne({username: 'Sacha'}).lean().exec()
        const res = await request(app).delete("/users").send({
            _id: user._id.toString()
        });
        expect(res.statusCode).toBe(200);
    });
});