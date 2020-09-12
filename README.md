# SmartGrid Dapp

A decentralized applicaion simulating a SmartGrid using the Ethereum BlockChain and web3js.

## Getting Started

The following instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* node version - 10.16.0
* npm version - 6.9.0
* Truffle version - 4.0.4 (https://www.npmjs.com/package/truffle/v/4.0.4)
* Metamask version - 3.14.1 (https://github.com/MetaMask/metamask-extension/releases/tag/v3.14.1)

### Installing

To get the development env running:

Clone the repository in your working directory

```
git clone https://github.com/RiaDhanani/SmartGrid.git
```

Navigate to src directory and run the commands below

```
cd src/
```
```
truffle develop
```
Open another instance of command prompt/terminal and navigate to the src directory
```
truffle compile
```
```
truffle migrate --reset
```

## Running the tests

```
truffle test
```

## Deployment

Run the server

```
npm run dev
```

* Log into metamask and import an account using given private key (shown in truffle develop).
* A single account can register as a Producer or Provider or Consumer. 
* Switch accounts to access functionalities of a Producer, Provider or Consumer. 
