# Brief of Introduction

Langle is a decentralized auction platform that utilizes blockchain and Web3 technology. The main goal of the Langle platform is to establish trust, ensuring that both sellers and buyers feel comfortable and secure when conducting transactions within the Langle ecosystem. To sustain the Langle project, a small fee will be added to each transaction completed on the platform.

# User Story

1. User creates an auction, currently only allowing ART/PICTURE type. but in future we will expand to other type of auction such as real stuff, other digital stuff such as game account, voucher, or even service
    - Users need to upload the picture to the Langle frontend.
    - The Langle frontend will add a watermark to the image.
    - The watermarked image is then sent to the backend with the auction details to be stored in the database.
    - Auction information (only related to transactions) is sent to the blockchain.
3. Other users make bids.
4. Bidding ends, and a winner is chosen.
    - A chat room will be created for the seller and buyer to facilitate the transaction.
        - To ensure privacy, some security and encryption mechanisms will be implemented, such as digital signatures, so that only the seller and buyer who are able to access the conversation.
    - The seller will send instructions on how to claim the item they are selling.
        - If the seller does not send the details within 3x24 hours, the auction will be cancelled, and the auction winner will receive a refund.
        - A smart contract function will be called to add a flag to the auction in the blockchain as "SELLER SENT."
    - After receiving the details from the seller, the buyer will have 3x24 hours to confirm.
    - After the buyer confirms receipt, a smart contract function will be called to mark the auction as completed.
        - If the buyer feels scammed by the seller, they can mark the transaction as fraud.
        - An escrow/administrator will join the chat, and the escrow will determine whether the transaction should be completed or refunded.
        - In the future, we will implement a more decentralized way of escrow. The simplest idea is to imagine that we have a lot of sellers who have completed transactions in Langle. When the buyer marks the transaction as fraud, we will ask the group of "trusted" sellers to reach a consensus to complete the transaction.
    - The smart contract then sends money to the seller after both parties acknowledge the completion of the transaction.