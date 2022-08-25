const { checkExists } = require("../db/seeds/utils");
const {
  fetchArticleById,
  updateArticlesIdVotes,
  selectArticles,
} = require("../models/articles.models");

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleIdVotes = (req, res, next) => {
  const { inc_votes: incVotes } = req.body;
  const { article_id } = req.params;
  updateArticlesIdVotes(article_id, incVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { topic } = req.query;

  const promiseArr = [selectArticles(sort_by, order, topic)];
  if (topic) {
    promiseArr.push(checkExists("topics", "slug", topic, "topic not found"));
  }

  Promise.all(promiseArr)
    .then((result) => {
      const articles = result[0];
      res.status(200).send({ articles });
    })
    .catch(next);
};
