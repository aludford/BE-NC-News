const { fetchTopics } = require("../models/topics.models");


exports.getTopics = (req, res) => {
// console.log('reached controller')

fetchTopics().then( topics => {
    // console.log(topics)
    res.status(200).send({topics});
})
};