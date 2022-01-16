import { expect } from "chai";
import { ethers } from "hardhat";
import { SundayToken } from "../src/types/SundayToken";

describe("Run Test", function () {
  let contract: SundayToken;

  const setup = async () => {
    const [addr1, addr2, addr3] = await ethers.getSigners();
    return { addr1, addr2, addr3 };
  };

  before("deploy FullMathTest", async () => {
    const { addr1 } = await setup();
    let Contract = await ethers.getContractFactory("SundayToken");
    contract = (await Contract.deploy(addr1.address)) as SundayToken;
    await contract.deployed();
  });

  describe("SundayToken", function () {
    it("get admin", async function () {
      const { addr1 } = await setup();
      let admin = await contract.admin();
      expect(admin).to.eq(addr1.address);
    });

    it("mint token", async function () {
      const { addr1 } = await setup();
      await contract.mint(addr1.address, 10000000);
      let result = await contract.totalSupply();
      expect(result.toNumber()).to.eq(10000000);
    });

    it("burn token", async function () {
      const { addr1 } = await setup();
      await contract.burn(addr1.address, 5000000);
      let result = await contract.balanceOf(addr1.address);
      expect(result.toNumber()).to.eq(5000000);
    });

    it("address 1 transfer to address 2", async function () {
      const { addr2 } = await setup();
      await contract.transfer(addr2.address, 3000);
      let result = await contract.balanceOf(addr2.address);
      expect(result.toNumber()).to.eq(3000);
    });

    it("address 2 transfer to address 3", async function () {
      const { addr2, addr3 } = await setup();
      await contract.connect(addr2).transfer(addr3.address, 1500);
      let result = await contract.balanceOf(addr3.address);
      expect(result.toNumber()).to.eq(1500);
    });

    it("address 2 transfer to address 3", async function () {
      const { addr1, addr2, addr3 } = await setup();
      await contract.connect(addr2).approve(addr1.address, 1500);

      await contract
        .connect(addr1)
        .transferFrom(addr2.address, addr3.address, 1500);
      let resultAddr2 = await contract.balanceOf(addr2.address);
      let resultAddr3 = await contract.balanceOf(addr3.address);
      expect(resultAddr2.toNumber()).to.eq(0);
      expect(resultAddr3.toNumber()).to.eq(3000);
    });

    it("address 2 allowance address 1", async function () {
      const { addr1, addr2 } = await setup();
      let result = await contract
        .connect(addr2)
        .allowance(addr2.address, addr1.address);

      expect(result.toNumber()).to.eq(0);
    });
  });
});
