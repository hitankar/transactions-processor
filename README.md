# Transactions

CLI application to extract financial transactions from paged API endpoints, process to log daily balances

# Stack
The application is build using Node and TypeScript.

# Installation

## Minimum requirements
- Node v15 or above.
- Yarn as package manager.

## Steps to setup
- Run `yarn` from project root folder.
- Run `yarn build` to run linting and build TypeScript code. The generated code is the dist folder.

Execute the application from the cli by running `yarn start`.

# Tests
Run unit tests with `yarn test`.

# Implementation
## Consuming the API

Based on the question, the API is paged however, it has a separate each URL. The dates for each transactions are variable. This means we can do two things. 

- Execute recursively to fetch transactions from the API.
- Storing all the transaction to a store (here, we are using an array);


## Calulating daily balances

We will also need to transform the transaction data that is stored in the array. A function is needed to process through this array and calculate daily balance and store to a HashMap, which can be used log the values.

# Improvements
As part of making this code scalable. It might make sense to use some persistent store to save the transactions pulled out from the API. The understanding is that the stored data doesn't have to persist very long but needs to be accessible quickly. One way to achieve this is using `Redis`.

- ~~Approach this problem as you would in the real-world. Consider errors that may occur when fetching data from the API such as non-200 http responses.~~
- Consider scalability when picking data abstractions and algorithms; what would happen if the transaction list was considerably larger?
- ~~Coding style matters. Ensure your code is consistent and easy to follow. Leave comments where appropriate and use meaningful methods and variables.~~
- ~~Avoid overly complex code. The complexity of the solution should make sense for the problems you're solving.~~
- Document limitations and trade-offs of your code if appropriate.
Include a README explaining how to install and/or run your software.