<script setup lang="ts">
import { ref } from 'vue'
import * as z from 'zod'
import { toDate } from 'radix-vue/date'
import { toTypedSchema } from '@vee-validate/zod'
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { cn, combineDateTimeAsDate, dateToEpochSeconds } from '@/lib/utils'

import { CalendarIcon } from '@radix-icons/vue'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components//ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

const dateValue = ref()
const placeholder = ref()

const df = new DateFormatter('en-US', {
  dateStyle: 'long'
})

const accountFormSchema = toTypedSchema(
  z.object({
    productName: z.string(),
    startingPrice: z.number(),
    buyNowPrice: z.number(),
    auctionEndDate: z.string(),
    auctionEndTime: z.string()
  })
)

import { writeContract } from '@wagmi/core'
import abi from '@/assets/abi.json'
import { config } from '@/service/web3modal'
import { parseEther } from 'viem'

async function onSubmit(values: any) {
  const auctionStartTime = dateToEpochSeconds(new Date())
  const auctionEndTime = dateToEpochSeconds(
    combineDateTimeAsDate(values.auctionEndDate, values.auctionEndTime)
  )

  const result = await writeContract(config, {
    abi,
    address: '0x8B524D6937351eC39A7ED7c7543729440DcDEc05',
    functionName: 'createAuction',
    args: [
      values.productName,
      auctionStartTime,
      auctionEndTime,
      parseEther(values.startingPrice.toString()),
      parseEther(values.buyNowPrice.toString())
    ]
  })

  console.log(result)
}
</script>

<template>
  <Form
    v-slot="{ setValues }"
    :validation-schema="accountFormSchema"
    class="space-y-8"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="productName">
        <FormItem class="col-span-2">
          <FormLabel>Product Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Product Name" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="startingPrice">
        <FormItem>
          <FormLabel>Starting Price</FormLabel>
          <FormControl>
            <Input type="number" placeholder="In ETH" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="buyNowPrice">
        <FormItem>
          <FormLabel>Buy Now Price</FormLabel>
          <FormControl>
            <Input type="number" placeholder="In ETH" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field, value }" name="auctionEndDate">
        <FormItem class="flex flex-col">
          <FormLabel class="mb-2">Auction End Date</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <FormControl>
                <Button
                  variant="outline"
                  :class="
                    cn('justify-start text-left font-normal', !value && 'text-muted-foreground')
                  "
                >
                  <CalendarIcon class="mr-2 h-4 w-4 opacity-50" />
                  <span>{{
                    value ? df.format(toDate(dateValue, getLocalTimeZone())) : 'Pick a date'
                  }}</span>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="p-0">
              <Calendar
                v-model:placeholder="placeholder"
                v-model="dateValue"
                initial-focus
                :min-value="today(getLocalTimeZone())"
                @update:model-value="
                  (v) => {
                    if (v) {
                      dateValue = v
                      setValues(
                        {
                          auctionEndDate: toDate(v).toISOString().split('T')[0]
                        },
                        false
                      )
                    } else {
                      dateValue = undefined
                      setValues(
                        {
                          auctionEndDate: undefined
                        },
                        false
                      )
                    }
                  }
                "
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
        <input type="hidden" v-bind="field" />
      </FormField>

      <FormField v-slot="{ componentField }" name="auctionEndTime">
        <FormItem>
          <FormLabel>Auction End Time</FormLabel>
          <FormControl>
            <Input type="time" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="flex justify-start">
      <Button type="submit"> Create </Button>
    </div>
  </Form>
</template>
