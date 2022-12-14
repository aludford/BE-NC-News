const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("Invalid endpoint", () => {
  test("status:404, should return error for invalid endpoint", () => {
    return request(app)
      .get("/api/NotAnEndpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid endpoint");
      });
  });
});

describe("GET /api/topics", () => {
  test("endpoint responds with status of 200 and an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toEqual([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, respond with article object with correct properties ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          })
        );
      });
  });
  test("status:400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid input");
      });
  });
  test("status:404, responds with an error if the parameter is valid but the entry does not exist", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status: 200, respond with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 2 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 102,
        });
      });
  });
  test("status 400, respond with error message when No inc_votes on request body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("vote increment not provided");
      });
  });
  test("status 400, respond with error message when invalid inc_votes on request body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "cat" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid input");
      });
  });
  test("status 404, responds with error if article_id does not exist ", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 2 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});

describe("GET /api/users", () => {
  test("status: 200, respond with array of objects with correct properties", () => {
    const expected = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
      {
        username: "rogersop",
        name: "paul",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      },
      {
        username: "lurker",
        name: "do_nothing",
        avatar_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ];

    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(expected);
      });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("status:200, respond with article object with correct properties incl comment count ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          comment_count: 11,
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("status: 200, respond with array of article objects with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            }),
          ])
        );
      });
  });
  test("status:200 returned array should be sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status:200, respond with array of comment objects with correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            }),
          ])
        );
      });
  });
  test("status:400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid input");
      });
  });
  test("status:200, responds with empty array for existent category with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(0);
      });
  });
  test("status:404, responds with an error if the parameter is valid but the entry does not exist", () => {
    return request(app)
      .get("/api/articles/9000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status: 201, responds with the posted comment ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "rogersop", body: "Eat, sleep, code, repeat" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("status:400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .post("/api/articles/notAnID/comments")
      .send({ username: "rogersop", body: "Eat, sleep, code, repeat" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid input");
      });
  });
  test("status 404, responds with error if article_id does not exist ", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "rogersop", body: "Eat, sleep, code, repeat" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("status 400, responds with error message when passed a username that does not exist  ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "crazyCoder", body: "Eat, sleep, code, repeat" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid input");
      });
  });
  test("status 400, responds with error message when the request object does not have correctly named keys  ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ badKey1: "rogersop", badKey2: "Eat, sleep, code, repeat" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid input");
      });
  });
  //username must be a string - optional test
});

describe("GET /api/articles (queries)", () => {
  test("status 200, default sort by date and default sort order is descending ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status 200, sorted by and sort order is as per passed query ", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author");
      });
  });
  test("status 200, sorted by comment_count and sort order is as per passed query ", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("status 200, filtered by topic passed in the query ", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "cats",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            }),
          ])
        );
      });
  });
  test("status 400, sort_by doesnt exist", () => {
    return request(app)
      .get("/api/articles?sort_by=notValidField")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort_by and/or sort order");
      });
  });
  test("status 400, order doesnt exist", () => {
    return request(app)
      .get("/api/articles?order=notValidOrder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort_by and/or sort order");
      });
  });
  test("status 404, topic that is not in the database should respond with error message", () => {
    return request(app)
      .get("/api/articles?topic=topicDoesntExist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic not found");
      });
  });
  test("status 200, topic exists but no articles associated with it should respond with empty array ", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(0);
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status:204, delete and respond with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("status:400, responds with an error message when passed an invalid comment ID", () => {
    return request(app)
      .delete("/api/comments/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid input");
      });
  });
  test("status:404, responds with an error if the parameter is valid but the entry does not exist", () => {
    return request(app)
      .delete("/api/comments/9000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
      });
  });
});

describe("GET /api", () => {
  test("respond with JSON describing all available endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(
          expect.objectContaining({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
            "GET /api/articles:article_id": expect.any(Object),
            "PATCH /api/articles:article_id": expect.any(Object),
            "GET /api/users": expect.any(Object),
            "GET /api/articles/:article_id/comments": expect.any(Object),
            "POST /api/articles/:article_id/comments": expect.any(Object),
            "DELETE /api/comments/:comment_id": expect.any(Object),
          })
        );
      });
  });
});
