import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SBT contract...");

  const SBT = await ethers.getContractFactory("SBT");
  const sbt = await SBT.deploy();

  await sbt.waitForDeployment();

  const address = await sbt.getAddress();

  console.log(`SBT deployed to: ${address}`);
  console.log("\nAdd this address to your frontend configuration:");
  console.log(`CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
