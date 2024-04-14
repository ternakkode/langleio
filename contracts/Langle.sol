// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Langle {

    enum State { WaitingToStart, Started, Ended, Finalized } 

    struct Auction {
        bytes32 id;
        uint startAt;
        uint endAt;
        uint startingPrice;
        uint buyNowPrice;
        address payable owner;
        address highestBidder;
        uint256 highestBid;
        State state;
    }

    Auction[] public auctions;
    mapping(bytes32 => Auction) public waitingToStartAuctions;
    mapping(bytes32 => Auction) public liveAuctions;
    mapping(bytes32 => Auction) public endedAuctions;
    mapping(bytes32 => Auction) public finalizedAuctions;
    mapping(bytes32 =>  mapping(address => uint256)) public bids;
    

    function createAuction(
        uint startAt,
        uint endAt,
        uint startingPrice,
        uint buyNowPrice
    ) public {
        require(endAt > startAt, "End time should be after start time");
        
        bytes32 id = keccak256(abi.encodePacked(startAt, endAt, startingPrice, buyNowPrice, msg.sender));
       
        if (block.timestamp > startAt) {
            startAt = block.timestamp;
        }

        Auction memory auction = Auction({
            id: id,
            startAt: startAt,
            endAt: endAt,
            startingPrice: startingPrice,
            buyNowPrice: buyNowPrice,
            owner: payable(msg.sender),
            highestBidder: address(0),
            highestBid: 0,
            state: State.WaitingToStart
        });
        
        if (startAt > block.timestamp) {
            waitingToStartAuctions[id] = auction;
        } else {
            auction.state = State.Started;
            liveAuctions[id] = auction;
        }

        auctions.push(auction);
    }
    
    function placeBid(
        bytes32 auctionId
    ) public payable {
        Auction storage auction = liveAuctions[auctionId];
        require(auction.state == State.Started, "Auction not started yet");
        require(block.timestamp < auction.endAt, "Auction has already ended");
        require(msg.value > auction.highestBid, "Bid must be higher than current highest bid");

        if (auction.highestBidder != address(0)) {
            // Refund the previous highest bidder
            bids[auctionId][auction.highestBidder] += auction.highestBid;
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
        bids[auctionId][msg.sender] += msg.value;
    }
}