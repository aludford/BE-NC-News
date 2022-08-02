const db = require('../db/connection.js');

exports.fetchArticlesId = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;',[article_id])
    .then( ({rows}) => {
        const article = rows[0];
        if (!article) {
            return Promise.reject( {
                status: 404,
                msg: 'article not found'
            });
        };
        return article;
    });
};

exports.updateArticlesIdVotes = (article_id, incVotes) => {
    //if incvotes undefined return error object, else run query
    if(incVotes === undefined) {
        return Promise.reject({status: 400, msg: 'vote increment not provided'})
    };

    return db
    .query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [incVotes, article_id])
    .then( ({rows}) => {
        const article = rows[0];
        return article
    });
};