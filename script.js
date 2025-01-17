import { ethers } from "ethers";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Constants
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const INFURA_PROJECT_SECRET = process.env.INFURA_PROJECT_SECRET;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const DATE_EPOC = process.env.DATE_EPOC;
const provider = new ethers.providers.InfuraProvider("mainnet", {
	projectId: INFURA_PROJECT_ID,
	projectSecret: INFURA_PROJECT_SECRET,
});

// Function to get ETH balance at a specific block
async function getETHBalanceAtBlock(address, blockNumber) {
	try {
		const balance = await provider.getBalance(address, blockNumber);
		return parseFloat(ethers.utils.formatEther(balance));
	} catch (error) {
		console.error(`Error fetching balance for ${address} at block ${blockNumber}:`, error);
		return 0;
	}
}

// Main function to calculate total ETH value for the contract at a given epoch time
async function calculateTotalETH(epochTime) {
	try {
		// Convert epoch time to block number (approximation)
		const blockNumber = await provider.getBlockNumber();
		const currentBlock = await provider.getBlock(blockNumber);
		const timeDifference = currentBlock.timestamp - epochTime;
		const blocksAgo = Math.floor(timeDifference / 12); // Approx. 12 seconds per block
		const targetBlock = blockNumber - blocksAgo;

		// Get ETH balance at the target block for the contract address
		const balance = await getETHBalanceAtBlock(CONTRACT_ADDRESS, targetBlock);

		console.log(`Total ETH at contract ${CONTRACT_ADDRESS} at epoch time ${epochTime}:`, balance);
		return balance;
	} catch (error) {
		console.error("Error calculating total ETH:", error);
		throw error;
	}
}

const date = new Date(`${DATE_EPOC}T00:00:00Z`);
const epochTime = Math.floor(date.getTime() / 1000);
calculateTotalETH(epochTime).catch((error) => {
	console.error("Failed to calculate total ETH:", error);
});
