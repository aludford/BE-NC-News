const { fetchArticlesId } = require("../models/articles.models");


exports.getArticleId = (req, res, next) => {
    const {article_id} = req.params
    fetchArticlesId(article_id)
    .then( (article) => {res.status(200).send({article})})
    .catch(next);
};