import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/main.vue'
import EstimationEntry from '@/components/EstimationEntry.vue'
import EstimationList from '@/components/EstimationList.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/estimation-entry',
      },
      {
        path: '/estimation-entry',
        name: 'EstimationEntry',
        component: EstimationEntry,
      },
      {
        path: '/estimation-list',
        name: 'EstimationList',
        component: EstimationList,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
