<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FormLayout from '@/components/FormLayout.vue'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { readContract, writeContract } from '@wagmi/core'
import abi from '@/assets/abi.json'
import { config } from '@/service/web3modal'

import { formatEther, parseEther } from 'viem'

interface Auctions {
  id: string
  productName: string
  startingPrice: string
  buyNowPrice: string
  auctionEndAt: string
  highestBid: string
}

const data = ref<Auctions[]>([])

async function getData() {
  const readResult = await readContract(config, {
    abi,
    address: '0x915dbA5FF949102242f0ca0011846Cc008FBecf4',
    functionName: 'allAuction'
  })

  console.log(readResult)

  const auctions: Auctions[] = (readResult as any[]).map((auction) => {
    return {
      id: auction.id,
      productName: auction.name,
      startingPrice: formatEther(auction.startingPrice),
      buyNowPrice: formatEther(auction.buyNowPrice),
      auctionEndAt: new Date(Number(auction.endAt) * 1000).toLocaleString(),
      highestBid: formatEther(auction.highestBid)
    }
  })

  data.value = auctions
}

const selectedBidAmount = ref(0.0)

const changeBidAmountInput = (bidAmountFromTable: number) => {
  selectedBidAmount.value = bidAmountFromTable
}

const placeBid = async (auctionId: string, bidAmount: string) => {
  const result = await writeContract(config, {
    abi,
    address: '0x915dbA5FF949102242f0ca0011846Cc008FBecf4',
    functionName: 'placeBid',
    args: [auctionId],
    value: parseEther(bidAmount)
  })

  console.log(result)
}

onMounted(async () => {
  await getData()
})
</script>

<template>
  <FormLayout title="Auctions" description="">
    <Table>
      <TableCaption>A list of recently created auctions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead>Starting Price</TableHead>
          <TableHead>Buy Now Price</TableHead>
          <TableHead>Auction End At</TableHead>
          <TableHead>Highest Bid</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="auction in data" :key="auction.id">
          <TableCell>{{ auction.productName }}</TableCell>
          <TableCell>{{ auction.startingPrice }} ETH</TableCell>
          <TableCell>{{ auction.buyNowPrice }} ETH</TableCell>
          <TableCell>{{ auction.auctionEndAt }}</TableCell>
          <TableCell>{{ auction.highestBid }}</TableCell>
          <TableCell>
            <Sheet>
              <SheetTrigger as-child>
                <Button variant="outline" @click="changeBidAmountInput(Number(auction.highestBid))"
                  >Place Bid</Button
                >
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Place your bid</SheetTitle>
                  <SheetDescription>
                    Make sure your bid is higher than current highest bid!
                  </SheetDescription>
                </SheetHeader>
                <div class="grid gap-4 py-4">
                  <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="bidAmount" class="text-right"> Bid Amount </Label>
                    <Input
                      type="number"
                      id="bidAmount"
                      v-model="selectedBidAmount"
                      class="col-span-3"
                    />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose as-child>
                    <Button type="submit" @click="placeBid(auction.id, String(selectedBidAmount))"
                      >Place</Button
                    >
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </FormLayout>
</template>
