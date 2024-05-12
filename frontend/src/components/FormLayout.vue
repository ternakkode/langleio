<script setup lang="ts">
import { Separator } from '@/components/ui/separator'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="block p-10 pb-16 m-5 rounded-sm bg-white">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">{{ title }}</h2>
      <p class="text-muted-foreground">{{ description  }}</p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col space-y-8">
      <div class="space-y-6">
        <slot />
      </div>
    </div>
  </div>
</template>
