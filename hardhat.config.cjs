require("@nomicfoundation/hardhat-toolbox");
require("hardhat-jest");
require("dotenv").config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const SEPOLIA_PRIVATE_KEYS = process.env.SEPOLIA_PRIVATE_KEYS || "";

module.exports = {
	solidity: "0.8.21",
	networks: {
		localhost: {},
		sepolia: {
			url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
			accounts: SEPOLIA_PRIVATE_KEYS.split(","),
		},
	},
};
