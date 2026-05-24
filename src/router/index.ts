import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import TourListingsView from '../views/TourListingsView.vue'
import CreateTourView from '../views/CreateTourView.vue'
import TourDetailView from '../views/TourDetailView.vue'
import PurchaseOrdersView from '../views/PurchaseOrdersView.vue'
import CustomerView from '../views/CustomerView.vue'
import StaffView from '../views/StaffView.vue'
import DiscountView from '../views/DiscountView.vue'
import PackageManagementView from '../views/PackageManagementView.vue'
import { getToken } from '../api/client'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/tour-listing', name: 'tour-listing', component: TourListingsView },
    { path: '/create-tour', name: 'create-tour', component: CreateTourView },
    { path: '/tour/:id', name: 'tour-detail', component: TourDetailView },
    { path: '/purchase-orders', name: 'purchase-orders', component: PurchaseOrdersView },
    { path: '/customers', name: 'customers', component: CustomerView },
    { path: '/staff', name: 'staff', component: StaffView },
    { path: '/discounts', name: 'discounts', component: DiscountView },
    { path: '/package-management', name: 'package-management', component: PackageManagementView },
  ],
})

router.beforeEach((to) => {
  if (to.meta.public) {
    if (to.path === '/login' && getToken()) return '/tour-listing'
    return true
  }

  if (!getToken()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
