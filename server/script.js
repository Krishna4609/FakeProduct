import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
    apiKey: "SFKfde-tr7-tBy0xEFHukWWApYn5xCNd",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);