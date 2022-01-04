import { ethers } from "hardhat";
import { KUSDT } from "../src/types/KUSDT";

async function main() {
  const [deployer, addr2, addr3] = await ethers.getSigners();
  console.log("DEPLOYER", deployer.address);
  console.log("ADDRESS 2:", addr2.address);

  // Deploy
  const AppToken = await ethers.getContractFactory("KUSDT");
  const appToken: KUSDT = (await AppToken.deploy(
    deployer.address,
    deployer.address,
    deployer.address,
    4
  )) as KUSDT;
  await appToken.deployed();

  console.log("CONTRACT ADDRESS:", appToken.address);

  // Get Name
  let name = await appToken.name();
  console.log("COIN NAME:", name);

  // Get Decimal
  let decimal = await appToken.decimals();
  console.log("DECIMAL:", decimal);

  // Mint Token
  await appToken.mint(deployer.address, 1000000000000000);
  let balance = await appToken.balanceOf(deployer.address);
  console.log("BALANCE DEPLOYER:", balance.toNumber());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
