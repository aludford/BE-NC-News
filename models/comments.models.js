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

exports.removeCommentById = (comment_id) => {
    return db
    .query('DELETE FROM comments WHERE comment_id=$1 RETURNING*;', [comment_id])
    .then( ({rows}) => {
        const comment = rows[0];
        if (!comment) {
            return Promise.reject( {
                status: 404,
                msg: 'comment not found'
            });
        };
        return
    });
};