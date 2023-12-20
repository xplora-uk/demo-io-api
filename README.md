# io-api

WebSocket server with binary streaming API for fast lightweight IO operations on databases using ws, knex, msgpackr

## requirements

* Node v20.x

## installation

```sh
npm i
```

## configuration

Copy sample env settings file and edit it.

```sh
cp .env_sample.env .env
```

## build

This transpiles TypeScript code (inside folder `./src`) into JavaScript code (it creates folder `./build`)

```sh
npm run build
```

## execution

```sh
# Run JavaScript code inside ./build folder via Node
npm run start

# Or you can run TypeScript code via ts-node
npm run start:ts
```

## usage

Check [node-client](./node-client/)

## TODO

* generate TypeScript DTO models based on database tables into folder `./src/generated/db/*`.
