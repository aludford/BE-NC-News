const db = require('../db/connection.js');

exports.fetchTopics = () => {
    // console.log('reached model')
    return db
    .query('SELECT * FROM topics')
    .then(({rows: topics}) => {
        return topics;
    })

};