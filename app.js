const express = require('express');
const { getArticleId, patchArticleIdVotes } = require('./controllers/articles.controllers');
const { getTopics } = require('./controllers/topics.controllers');
const { getUsers } = require('./controllers/users.controllers');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleId);

app.patch('/api/articles/:article_id', patchArticleIdVotes);

app.get('/api/users', getUsers);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'invalid endpoint'});
})

///////////////////////

// handle custom errors
app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });

// handle specific psql errors
app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send( {msg: 'invalid input'});
    };
})

module.exports = app;