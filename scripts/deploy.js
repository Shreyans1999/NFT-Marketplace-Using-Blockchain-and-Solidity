const hre = require("hardhat");

async function main() {
  const NFT_mkplace = await hre.ethers.getContractFactory("NFT_mkplace");
  const nft_mkplace = await NFT_mkplace.deploy();

  await nft_mkplace.deployed();

  console.log(` deployed contract Address ${nft_mkplace.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
