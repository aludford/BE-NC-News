\c nc_news_test

-- SELECT articles.*, COUNT(comment_id) AS comment_count
-- FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- WHERE articles.article_id = 1
-- GROUP BY articles.article_id;

-- SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comment_id)::int AS comment_count
-- FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id
-- ORDER BY articles.created_at DESC;

-- SELECT comment_id, votes, created_at, author, body
-- FROM comments
-- WHERE article_id = 1;

DELETE
FROM comments
WHERE article_id=1
RETURNING *