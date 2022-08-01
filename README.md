# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database will be PSQL.

## To successfully connect to the two databases

You will need to create two .env files for your project: `.env.test` and `.env.development`.

Into `.env.test`, add `PGDATABASE=nc_news_test`.

Into `.env.development`, add `PGDATABASE=nc_news`.
