<!-- <script setup lang="ts">
</script>

<template>
  <FormLayout title="Auctions" description="">
      <Table>
        <TableCaption>A list of your recently created auctions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Starting Price</TableHead>
            <TableHead>Buy Now Price</TableHead>
            <TableHead>Auction End At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="auction in data" :key="auction.id">
            <TableCell>{{ auction.id }}</TableCell>
            <TableCell>{{ auction.productName }}</TableCell>
            <TableCell>{{ auction.startingPrice }}</TableCell>
            <TableCell>{{ auction.buyNowPrice }}</TableCell>
            <TableCell>{{ auction.auctionEndAt }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
  </FormLayout>
</template> -->

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

import { readContract } from '@wagmi/core'
import abi from '@/assets/abi.json'
import { config } from '@/service/web3modal'

import { formatEther } from 'viem'

interface Auctions {
  id: string
  productName: string
  startingPrice: string
  buyNowPrice: string
  auctionEndAt: string
}

const data = ref<Auctions[]>([])

async function getData() {
  const readResult = await readContract(config, {
    abi,
    address: '0x8B524D6937351eC39A7ED7c7543729440DcDEc05',
    functionName: 'AllAuctions'
  })

  const auctions: Auctions[] = (readResult as any[]).map((auction) => {
    return {
      id: auction.id,
      productName: auction.name,
      startingPrice: formatEther(auction.startingPrice),
      buyNowPrice: formatEther(auction.buyNowPrice),
      auctionEndAt: new Date(Number(auction.endAt) * 1000).toLocaleString()
    }
  })

  data.value = auctions
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
          <TableHead>ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Starting Price</TableHead>
          <TableHead>Buy Now Price</TableHead>
          <TableHead>Auction End At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="auction in data" :key="auction.id">
          <TableCell>{{ auction.id }}</TableCell>
          <TableCell>{{ auction.productName }}</TableCell>
          <TableCell>{{ auction.startingPrice }} ETH</TableCell>
          <TableCell>{{ auction.buyNowPrice }} ETH</TableCell>
          <TableCell>{{ auction.auctionEndAt }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </FormLayout>
</template>
