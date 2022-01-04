import { expect } from "chai";
import { ethers } from "hardhat";

import { KUSDT } from "../src/types/KUSDT";

describe("AppToken", function () {
  it("deploy", async function () {
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

    // Get Name
    let name = await appToken.name();
    console.log("COIN NAME:", name);

    // Get Decimal
    let decimal = await appToken.decimals();
    console.log("DECIMAL:", decimal);

    // Mint Token
    await appToken.mint(deployer.address, 1000000);
    let balance = await appToken.balanceOf(deployer.address);
    console.log("BALANCE DEPLOYER:", balance.toNumber());

    // Get Total Supply
    let totalSupply = await appToken.totalSupply();
    console.log("TOTAL SUPPLY:", totalSupply.toNumber());

    // Transfer
    await appToken.transfer(addr2.address, 5000);
    let balance1 = await appToken.balanceOf(deployer.address);
    let balance2 = await appToken.balanceOf(addr2.address);
    console.log("BALANCE DEPLOYER:", balance1.toNumber());
    console.log("BALANCE ADDRESS 2:", balance2.toNumber());

    // Burn
    await appToken.burn(addr2.address, 1000);
    balance2 = await appToken.balanceOf(addr2.address);
    console.log("BALANCE ADDRESS 2:", balance2.toNumber());

    // Get Total Supply After Burn
    totalSupply = await appToken.totalSupply();
    console.log("TOTAL SUPPLY AFTER BURN:", totalSupply.toNumber());

    // ADMIN MINT TRANSFER
    await appToken.adminTransfer(deployer.address, addr2.address, 100000);
    balance2 = await appToken.balanceOf(addr2.address);
    console.log("AFTER ADMIN MINT TRANSFER:", balance2.toNumber());

    appToken.connect(addr2).approve(addr3.address, 1000);
    appToken.connect(addr3).transferFrom(addr2.address, addr3.address, 1000);
    let balance3 = await appToken.connect(addr3).balanceOf(addr3.address);
    console.log(
      "BALANCE ADDRESS 2:",
      (await appToken.connect(addr2).balanceOf(addr2.address)).toNumber()
    );
    console.log("BALANCE ADDRESS 3:", balance3.toNumber());
  });
});
