# Northcoders News API

## About The Project

This is an API for accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which can provide information to the front end architecture.

This API allows users to fetch articles, post and delete comments, vote on articles, and fetch users. The **endpoints.json** file decribes all available endpoints.

The database uses PostgreSQL.

You can find a hosted verson of the API at:

https://northcoders-news-api-app.herokuapp.com/api

---

## Getting Started

1. Fork this repository to your own GitHub account

2. Clone your fork of this repository to your local machine:

```
git clone <your fork's URL>
```

3. The project requires the following dependencies:

   - cors
   - dotenv
   - express
   - pg
   - pg-format
   - husky
   - jest
   - jest-extended
   - jest-sorted
   - supertest

\
To **install** these **dependencies** run the folowing CLI command:

```
npm install
```

## To successfully connect to the two databases

You will need to create two .env files for your project: `.env.test` and `.env.development`.

Into `.env.test`, add `PGDATABASE=nc_news_test`.

Into `.env.development`, add `PGDATABASE=nc_news`.

---

## To setup the databases and seed

You can setup the databases with the CLI command:

```
npm setup-dbs
```

You can seed with development data with the CLI command:

```
npm seed
```

Alternatively, the databases will be seeded with test data when the tests are run.

## Running Tests

To run all test suites use:

```
npm test
```

## Minimum Versions

- Node JS: v18.3.0
- PostgreSQL: 12.11
