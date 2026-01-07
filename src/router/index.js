import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/main.vue'
import EstimationEntry from '@/components/EstimationEntry.vue'
import EstimationList from '@/components/EstimationList.vue'
import EstimationEdit from '@/components/EstimationEdit.vue'
import EstimationEditList from '@/components/EstimationEditList.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/estimation-list',
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
      {
        path: '/estimation-edit-list',
        name: 'EstimationEditList',
        component: EstimationEditList,
      },
      {
        path: '/estimation-edit',
        name: 'EstimationEdit',
        component: EstimationEdit,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
