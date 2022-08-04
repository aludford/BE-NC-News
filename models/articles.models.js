const db = require('../db/connection.js');
const checkExists = require('../db/seeds/utils.js')

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

exports.selectArticles = (sort_by, order, topic) => {
    //whitelist acceptable query
    const validSortBys = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes'];
    const validOrders = ['asc','desc'];
    
    if(!sort_by) {sort_by = 'created_at'}; //if sort_by is undefined, assign the default date
    if(!order) {order = 'desc'}; //if order is undefined, assign the default desc

    const queryWhereValues = [];
    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comment_id)::int AS comment_count
                    FROM articles
                    LEFT JOIN comments
                    ON articles.article_id = comments.article_id `;

    if (topic) {
        queryStr += 'WHERE topic = $1 ';
        queryWhereValues.push(topic)
    };

    queryStr += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order};`

    if (validSortBys.includes(sort_by) && validOrders.includes(order)) {
        return db
        .query(queryStr, queryWhereValues)
        .then(({rows: articles}) => {
            return articles;
        });
    };
    return Promise.reject({status: 400, msg: 'invalid sort_by and/or sort order'})

};
