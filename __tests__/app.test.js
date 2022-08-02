const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('GET /api/topics', () => {
    test('endpoint responds with status of 200 and an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toEqual([
                {
                  description: 'The man, the Mitch, the legend',
                  slug: 'mitch'
                },
                {
                  description: 'Not dogs',
                  slug: 'cats'
                },
                {
                  description: 'what books are made of',
                  slug: 'paper'
                }
              ]);
        });
    });
    test('404 - should return error for invalid endpoint', () => {
        return request(app)
        .get('/api/notanendpoint')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('invalid endpoint')
        });
    });
});

describe('GET /api/articles/:article_id', () => {
    test('status:200, respond with article object with correct properties ', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 100,
            });
        });
    });
    test('status:400, responds with an error message when passed a bad article ID', () => {
        return request(app)
        .get('/api/articles/notAnID')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('invalid input')
        });
    });
    test('status:404, responds with an error if the parameter is valid but the entry does not exist', () => {
        return request(app)
        .get('/api/articles/9000')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('article not found')
        });
    });
});

