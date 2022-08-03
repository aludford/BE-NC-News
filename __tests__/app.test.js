const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('Invalid endpoint', () => {
    test('status:404, should return error for invalid endpoint', () => {
        return request(app)
        .get('/api/NotAnEndpoint')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('invalid endpoint')
        });
    });
});

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
});

describe('GET /api/articles/:article_id', () => {
    test('status:200, respond with article object with correct properties ', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual(
                expect.objectContaining({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 100,
                }),
            );
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

describe('PATCH /api/articles/:article_id', () => {
    test('status: 200, respond with updated article', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes : 2 })
        .expect(200)
        .then(({body}) => {
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
    test('status 400, respond with error message when No inc_votes on request body', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(400)
        .then (({body}) => {
            expect(body.msg).toBe('vote increment not provided')
        });
    });
    test('status 400, respond with error message when invalid inc_votes on request body', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes : "cat"})
        .expect(400)
        .then (({body}) => {
            expect(body.msg).toBe('invalid input')
        });
    });
    test('status 404, responds with error if article_id does not exist ', () => {
        return request(app)
        .patch('/api/articles/9999')
        .send({ inc_votes : 2 })
        .expect(404)
        .then( ({body}) => {
            expect(body.msg).toBe('article not found');
        });
    }); 
});

describe('GET /api/users', () => {
    test('status: 200, respond with array of objects with correct properties', () => {
        const expected = [
            {
              username: 'butter_bridge',
              name: 'jonny',
              avatar_url:
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            },
            {
              username: 'icellusedkars',
              name: 'sam',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            },
            {
              username: 'rogersop',
              name: 'paul',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
            },
            {
              username: 'lurker',
              name: 'do_nothing',
              avatar_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
            }
        ];
        
        return request(app)
        .get('/api/users')
        .expect(200)
        .then( ({body}) => {
            expect(body.users).toEqual(expected);
        })
    });
});

describe('GET /api/articles/:article_id (comment count)', () => {
    test('status:200, respond with article object with correct properties incl comment count ', () => {
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
                comment_count: 11
            });
        });
    });
});

describe('GET /api/articles', () => {
    test('status: 200, respond with array of article objects with correct properties', () => {       
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then( ({body}) => {
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
            )
        })
    })
    test('status:200 returned array should be sorted in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then( ({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true,});
        });
    });
});

describe.only('GET /api/articles/:article_id/comments', () => {
    test('status:200, respond with array of comment objects with correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then ( ({body}) => {
            expect(body.comments).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                    })
                ])
            )
        });
    });
    test('status:400, responds with an error message when passed a bad article ID', () => {
        return request(app)
        .get('/api/articles/notAnID/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('invalid input')
        });
    });
    test('status:200, responds with empty array for existent category with no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(0);
        });
    });
    test('status:404, responds with an error if the parameter is valid but the entry does not exist', () => {
        return request(app)
        .get('/api/articles/9000/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('article not found');
        });
    });
});