const { fetchArticlesId } = require("../models/articles.models");
const { selectCommentsByArticleId } = require("../models/comments.models");


exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    Promise.all([
        selectCommentsByArticleId(article_id),
        fetchArticlesId(article_id)
    ])
    .then( (responses) => {
        const comments = responses[0]
        res.status(200).send({comments});
    })
    .catch(next);
};