import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Langle", function () {
  describe("Auction", function () {
    it("Auction with in future start date should mapped to waiting to start auction", async function () {
      const [owner, otherAccount] = await hre.ethers.getSigners();

      const Langle = await hre.ethers.getContractFactory("Langle", owner);
      const langle = await Langle.deploy();

      let now = new Date().getTime();
      let startAt = now + 3 * 24 * 60 * 60 * 1000;
      let endAt = startAt + 10 * 24 * 60 * 60 * 1000;

      await langle.createAuction(
        Math.floor(startAt / 1000),
        Math.floor(endAt / 1000),
        2,
        5
      );

      const insertedAuction = await langle.auctions(0);
      expect(insertedAuction.startingPrice).eq(BigInt(2n));
      expect(insertedAuction.buyNowPrice).eq(BigInt(5n));
      expect(insertedAuction.state).eq(BigInt(0n));

      let auctionFromMap = await langle.waitingToStartAuctions(
        insertedAuction.id
      );
      expect(auctionFromMap.id).eq(insertedAuction.id);
    });

    it("Auction whose start time is later than or at the current time should mapped to live auction", async function () {
      const [owner, otherAccount] = await hre.ethers.getSigners();

      const Langle = await hre.ethers.getContractFactory("Langle", owner);
      const langle = await Langle.deploy();

      let now = new Date().getTime();
      let startAt = now - 3 * 24 * 60 * 60 * 1000;
      let endAt = startAt + 10 * 24 * 60 * 60 * 1000;

      await langle.createAuction(
        Math.floor(startAt / 1000),
        Math.floor(endAt / 1000),
        2,
        5
      );

      const insertedAuction = await langle.auctions(0);
      expect(insertedAuction.state).eq(BigInt(1n));

      let auctionFromMap = await langle.liveAuctions(insertedAuction.id);
      expect(auctionFromMap.id).eq(insertedAuction.id);
    });
  });

  describe("Bid", function () {
    it("Should not able to bid waiting to start action", async function () {
      const [owner, otherAccount] = await hre.ethers.getSigners();

      const Langle = await hre.ethers.getContractFactory("Langle", owner);
      const langle = await Langle.deploy();

      let now = new Date().getTime();
      let startAt = now + 3 * 24 * 60 * 60 * 1000;
      let endAt = startAt + 10 * 24 * 60 * 60 * 1000;

      await langle.createAuction(
        Math.floor(startAt / 1000),
        Math.floor(endAt / 1000),
        2,
        5
      );

      const insertedAuction = await langle.auctions(0);

      await expect(langle.placeBid(insertedAuction.id)).to.be.reverted;
    });

    it("Bid should higher than highest bid", async function () {
      const [owner, otherAccount] = await hre.ethers.getSigners();

      const Langle = await hre.ethers.getContractFactory("Langle", owner);
      const langle = await Langle.deploy();

      let now = new Date().getTime();
      let startAt = now - 3 * 24 * 60 * 60 * 1000;
      let endAt = startAt + 10 * 24 * 60 * 60 * 1000;

      await langle.createAuction(
        Math.floor(startAt / 1000),
        Math.floor(endAt / 1000),
        2,
        5
      );

      const insertedAuction = await langle.auctions(0);
      
      await langle.placeBid(insertedAuction.id, {
        value: ethers.parseUnits("0.1")
      })

      await expect(langle.placeBid(insertedAuction.id, {
        value: ethers.parseUnits("0.1")
      })).to.be.reverted
    });

    it("Bid successfully placed", async function () {
      const [owner, otherAccount] = await hre.ethers.getSigners();

      const Langle = await hre.ethers.getContractFactory("Langle", owner);
      const langle = await Langle.deploy();

      let now = new Date().getTime();
      let startAt = now - 3 * 24 * 60 * 60 * 1000;
      let endAt = startAt + 10 * 24 * 60 * 60 * 1000;

      await langle.createAuction(
        Math.floor(startAt / 1000),
        Math.floor(endAt / 1000),
        2,
        5
      );

      const insertedAuction = await langle.auctions(0);
      
      await langle.placeBid(insertedAuction.id, {
        value: ethers.parseUnits("0.1")
      })
    });
  });
});
