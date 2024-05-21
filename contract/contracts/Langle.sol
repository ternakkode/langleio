// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Langle {
    enum State {
        WaitingToStart,
        Started,
        Ended,
        Finalized
    }

    struct Auction {
        bytes32 id;
        string name;
        uint startAt;
        uint endAt;
        uint startingPrice;
        uint buyNowPrice;
        address payable owner;
        address highestBidder;
        uint256 highestBid;
        State state;
    }

    struct Bid {
        uint amount;
        address bidder;
    }


    bytes32[] public auctionIDs;


    mapping(bytes32 => Auction) public auctions;
    mapping(bytes32 => Bid) public bids;

    function createAuction(
        string memory name,
        uint startAt,
        uint endAt,
        uint startingPrice,
        uint buyNowPrice
    ) public {
        require(endAt > startAt, "End time should be after start time");

        bytes32 id = keccak256(
            abi.encodePacked(
                startAt,
                endAt,
                startingPrice,
                buyNowPrice,
                msg.sender
            )
        );

        if (block.timestamp > startAt) {
            startAt = block.timestamp;
        }

        Auction memory auction = Auction({
            id: id,
            name: name,
            startAt: startAt,
            endAt: endAt,
            startingPrice: startingPrice,
            buyNowPrice: buyNowPrice,
            owner: payable(msg.sender),
            highestBidder: address(0),
            highestBid: 0,
            state: block.timestamp >= startAt ? State.Started : State.WaitingToStart
        });

        auctions[id] = auction;
        auctionIDs.push(id);
    }

    function allAuction() public view returns (Auction[] memory) {
        Auction[] memory auctionFromMap = new Auction[](auctionIDs.length);

        for (uint256 i = 0; i < auctionIDs.length; i++) {
            auctionFromMap[i] = auctions[auctionIDs[i]];
        }

        return auctionFromMap;
    }

    function placeBid(bytes32 auctionId) public payable {
        Auction storage auction = auctions[auctionId];
        require(auction.state == State.Started, "Auction not started yet");
        require(block.timestamp < auction.endAt, "Auction has already ended");
        require(
            msg.value > auction.highestBid,
            "Bid must be higher than current highest bid"
        );

        if (auction.highestBidder != address(0)) {
            (bool success, ) = payable(auction.highestBidder).call{
                value: auction.highestBid
            }("bid refund");
            require(success, "Payment failed.");
        }

        auctions[auctionId].highestBidder = payable(msg.sender);
        auctions[auctionId].highestBid = msg.value;
    }
}
