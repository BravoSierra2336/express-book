process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app"); 

describe("Books Routes", () => {
  describe("POST /books", () => {
    it("creates a book with valid data", async () => {
      const resp = await request(app)
        .post("/books")
        .send({
          isbn: "1234567890",
          title: "Test Book",
          author: "Tester",
          publisher: "Test Pub",
          year: 2024
        });
      expect(resp.statusCode).toBe(201);
      expect(resp.body.book).toHaveProperty("isbn", "1234567890");
    });

    it("rejects book with missing fields", async () => {
      const resp = await request(app)
        .post("/books")
        .send({
          title: "Incomplete Book"
        });
      expect(resp.statusCode).toBe(400);
      expect(resp.body.errors).toBeInstanceOf(Array);
      expect(resp.body.errors.length).toBeGreaterThan(0);
    });

    it("rejects book with invalid year", async () => {
      const resp = await request(app)
        .post("/books")
        .send({
          isbn: "0987654321",
          title: "Bad Year",
          author: "Tester",
          publisher: "Test Pub",
          year: -1
        });
      expect(resp.statusCode).toBe(400);
      expect(resp.body.errors.some(e => e.includes("year"))).toBe(true);
    });
  });

  describe("PUT /books/:isbn", () => {
    it("updates a book with valid data", async () => {
      await request(app)
        .post("/books")
        .send({
          isbn: "1111111111",
          title: "Update Me",
          author: "Tester",
          publisher: "Test Pub",
          year: 2024
        });

      const resp = await request(app)
        .put("/books/1111111111")
        .send({
          isbn: "1111111111",
          title: "Updated Book",
          author: "Tester",
          publisher: "Test Pub",
          year: 2025
        });
      expect(resp.statusCode).toBe(200);
      expect(resp.body.book.title).toBe("Updated Book");
    });

    it("rejects update with invalid data", async () => {
      const resp = await request(app)
        .put("/books/1111111111")
        .send({
          isbn: "1111111111",
          title: "Still Bad",
          author: "Tester",
          publisher: "Test Pub",
          year: "not a number"
        });
      expect(resp.statusCode).toBe(400);
      expect(resp.body.errors.some(e => e.includes("year"))).toBe(true);
    });
  });

  describe("GET /books/:isbn", () => {
    it("gets a book by isbn", async () => {
      await request(app)
        .post("/books")
        .send({
          isbn: "2222222222",
          title: "Get Me",
          author: "Tester",
          publisher: "Test Pub",
          year: 2024
        });

      const resp = await request(app)
        .get("/books/2222222222");
      expect(resp.statusCode).toBe(200);
      expect(resp.body.book).toHaveProperty("isbn", "2222222222");
    });

    it("returns 404 for missing book", async () => {
      const resp = await request(app)
        .get("/books/9999999999");
      expect(resp.statusCode).toBe(404);
    });
  });

  describe("DELETE /books/:isbn", () => {
    it("deletes a book", async () => {
      await request(app)
        .post("/books")
        .send({
          isbn: "3333333333",
          title: "Delete Me",
          author: "Tester",
          publisher: "Test Pub",
          year: 2024
        });

      const resp = await request(app)
        .delete("/books/3333333333");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ message: "Book deleted" });
    });

    it("returns 404 for deleting missing book", async () => {
      const resp = await request(app)
        .delete("/books/9999999999");
      expect(resp.statusCode).toBe(404);
    });
  });
});

afterAll(async () => {
  const db = require("../db"); 
  await db.end(); 
});