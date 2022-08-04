const { fetchArticleById, updateArticlesIdVotes, selectArticles } = require("../models/articles.models");


exports.getArticleId = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id)
    .then( (article) => {res.status(200).send({article})})
    .catch(next);
};

exports.patchArticleIdVotes = (req, res, next) => {
    const {inc_votes: incVotes} = req.body;
    const {article_id} = req.params;
    updateArticlesIdVotes(article_id, incVotes)
    .then( (article) => {
        res.status(200).send({article});
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles});
    });
};