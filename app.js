const express = require('express');
const { getArticleId } = require('./controllers/articles.controllers');
const { getTopics } = require('./controllers/topics.controllers');
const app = express();


app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleId);

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