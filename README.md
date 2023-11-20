# EthDenver 2023 Demo instructions
Due to the nature of the Ceramic Daemon certain files must be updated to work with your local machine. Please follow the following directions carefully to ensure functionality.
1. On line 14 of `composedb.config.json` update the db key to be your ceramic install. You must use the full pathname as the Ceramic Daemon doesn't like relative paths. This path must start with `sqlite://` and must end with `indexing.sqlite`. Your directory should be inbetween these two required strings. EX: `sqlite:///sterahi/.ceramic/indexing.sqlite` or `sqlite:///[USERNAME]/.ceramic/indexing.sqlite` where `[USERNAME]` is your username.
2. You must run `npm i`
3. You must start the server with `npm run dev` once. You may continue to use this command if you'd like however it will close all Ceramic connections at the first error. It is recommended that once your node is configured to index the required models that you run `npm run ceramic` & `npm run nextDev` separately to avoid this eager quitting.
4. Enjoy this demo application! 

## Getting Started

First, run the development server:

```bash
npm run dev
```

composedb graphql:server --ceramic-url=http://localhost:7007 --graphiql src/__generated__/definition.json --did-private-key=z6MkfuigJH7DXP6PiYpMVLvsX1Ak2CYKmMEX488zCub9tvwP --port=5005

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

Upgrade this project to claynet to see other developer's posts! Check out wheel to install ceramic / composeDB locally:

https://github.com/ceramicstudio/wheel

To learn more about Ceramic please visit the following links

- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB](https://composedb.js.org/) - Details on how to use and develop with ComposeDB!

You can check out [Create Ceramic App repo](https://github.com/ceramicstudio/create-ceramic-app) and provide us with your feedback or contributions! 
