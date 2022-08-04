const db = require('../db/connection.js');

exports.fetchArticleById = (article_id) => {
    /*the return type of the COUNT operator is bigint
    which can exceed the maximum value of an int in JavaScript,
    hence interpreted as a string. I've typecast it into an integer */
    return db
    .query('SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;',[article_id])
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
        if (!article) {
            return Promise.reject( {
                status: 404,
                msg: 'article not found'
            });
        };
        return article;
    });
};

exports.selectArticles = () => {
    return db
    .query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comment_id)::int AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`)
    .then(({rows: articles}) => {
        return articles;
    });
}