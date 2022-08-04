const db = require('../db/connection.js');

exports.selectCommentsByArticleId = (article_id) => {
    return db
    .query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;', [article_id])
    .then( ({rows: comments}) => {
        return comments;
    });
};

exports.publishComment = (article_id, username, comment) => {
    return db
    .query('INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;',[comment, article_id, username])
    .then( ({rows : [commentObj]}) => {
        return commentObj
    })
};