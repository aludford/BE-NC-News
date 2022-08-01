const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js')

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('3. GET /api/topics', () => {
    test('endpoint responds with status of 200 and an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            // console.log(Object.keys(body))
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

