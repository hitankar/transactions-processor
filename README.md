[![Node CI](https://github.com/hitankar/transactions-processor/actions/workflows/nodejs.yml/badge.svg?branch=main)](https://github.com/hitankar/transactions-processor/actions/workflows/nodejs.yml)

# Transactions &amp; Daily Balances

CLI application to extract financial transactions from paged API endpoints, process to log daily balances

# Stack
- The application is built using NodeJS. Code is written in TypeScript.
- Linting and formatting with ESLint and Prettier.
- Units tests using Jest.
- Logging using Winston logger.

# Installation

## Minimum requirements
- Node v16 or above.
- Yarn v1.x.x as package manager.

## Steps to setup
- Copy .env.example file to .env
- Fill in the value of `API_ROOT` eg. `https://example.com/transactions`
- Run `yarn` from project root folder.
- Run `yarn build` to run linting and compile TypeScript code to JavaScript. The generated code is the dist folder.

Execute the application from the cli by running `yarn start`.

# Tests
Run unit tests with `yarn test`.

## CI
The code uses GitHub Actions to enable continous integration. On a push or PR, the code is compiled, linted and unit tested.

# Implementation
## Problem

- The transactions are spread across multiple pages which are represented by a different API endpoint. 
- The dates for each transactions within each page are variable. This means we can do two things. 
- Multiple pages can add up to large set of transactions.
- Transactions per page may / may not be constant.

## Solution

### Fetching transactions from the API
- Execute recursively to fetch transactions from the API until the total number of transactions matches the processed transactions.
- Transactions are intially stored in-memory (or to a persistence database, see below).
- Fetching of transactions happens in O(n * m) where n = no. of pages and m = no. of transactions per page. If number of transactions per page remains constant, time complexity can be effectively O(n) which is linear time.
- Space complexity is O(n) where n = no. of transactions.

### Error handling
Fetching errors are silently handled and logged without crashing the application. The daily transaction will be calculated based on the transactions it stored while iterating through the endpoints.

### Calculating daily balances

We will also need to calculate daily balances from the transaction data that is stored. A function processes through stored transactions and calculate daily balance that is then store to a HashMap.

Time complexity is O(n) where n is total number of transactions. Space complexity is O(n) here n is number of dates/entries. 

### Storing transactions
I created data abstraction to store the transactions. The `Store` (which is responsible for keeping the transactions) accepts an `Adapter`. 

For simplicity, I created a `InMemory` adapter where the data is stored in an HashMap as in array. In the future, additional adapters can be add to implement scalable solution using persistent store like Redis, MongoDB, etc.

# Limitations and Improvements

- The entire process of fetching to processing of transaction happens in a single invocation. This is necessary because we are storing the data in memory. However, the logic the split into two methods, and if third party stores like `Redis` or a NoSQL db is used (with custom adapters), we can invoke fetching and processing for daily balances in separate invocations. Technically, this would allow us to scale up for large transaction list and be able to calculate without needing to re-fetch the data from the API.

- The `Amount` in a transaction is a floating point number. In JavaScript adding two such number yield unexpectedly long decimal values eg. `0.21 + 0.12 = 0.32999999999999996`. Currently, the balances are stored as is and formatted correctly when logged. As an improvement, the total could be stored in correct format eg. `0.33`.

- As an improvement we can add a git-hook to run linting and formatting to keep code style consistent.
- `Dockerization`: we can dockerize local development in order to emulate the production environment.