const { fetchArticleById } = require("../models/articles.models");
const { selectCommentsByArticleId, publishComment } = require("../models/comments.models");


exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    Promise.all([
        selectCommentsByArticleId(article_id),
        fetchArticleById(article_id)
    ])
    .then( (responses) => {
        const comments = responses[0]
        res.status(200).send({comments});
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    const {username} = req.body
    const {body : comment} = req.body
    
    fetchArticleById(article_id)
    .then( () => {
        return publishComment(article_id, username, comment)

    })
    .then( (commentObj) => {
        //send comment object on key 'comment'
        res.status(201).send({comment: commentObj });
    })
    .catch(next);
};