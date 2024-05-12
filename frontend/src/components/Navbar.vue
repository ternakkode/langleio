<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="bg-white">
    <nav class="flex justify-between items-center w-[92%] mx-auto py-4">
      <div>
        <img src="@/assets/logo.png" class="w-20" />
      </div>
      <div
        class="md:static absolute bg-white md:min-h-fit md:w-auto min-h-[60vh] left-0 top-[-100%] w-full flex items-center px-5"
      >
        <ul class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
          <li>
            <RouterLink class="hover:text-gray-500" :to="'/'">Home</RouterLink>
          </li>
          <li>
            <RouterLink class="hover:text-gray-500" :to="'/auctions'">Auctions</RouterLink>
          </li>
          <li>
            <RouterLink class="hover:text-gray-500" :to="'/auctions/create'">New Auction</RouterLink>
          </li>
        </ul>
      </div>
      <div>
        <w3m-button balance="hide" />
      </div>
    </nav>
  </header>
</template>
