import { createRouter, createWebHistory } from 'vue-router'
import CreateAuction from '@/views/CreateAuction.vue'
import ListAuction from '@/views/ListAuction.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auctions/create',
      name: 'Create Auction',
      component: CreateAuction
    },
    {
      path: '/auctions',
      name: 'List Auction',
      component: ListAuction,
    }
  ]
})

export default router
