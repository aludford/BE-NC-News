const cors = require("cors");
const express = require("express");
const { getEndpoints } = require("./controllers/api.controllers");
const {
  getArticleId,
  patchArticleIdVotes,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postComment,
  deleteCommentById,
} = require("./controllers/comments.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.patch("/api/articles/:article_id", patchArticleIdVotes);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api", getEndpoints);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "invalid endpoint" });
});

///////////////////////

// handle custom errors
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

// handle specific psql errors
app.use((err, req, res, next) => {
  //invalid_text_representation
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid input" });
  }
  //foreign_key_violation
  if (err.code === "23503") {
    res.status(400).send({ msg: "invalid input" });
  }
  //not_null_violation
  if (err.code === "23502") {
    res.status(400).send({ msg: "invalid input" });
  }
});

module.exports = app;
