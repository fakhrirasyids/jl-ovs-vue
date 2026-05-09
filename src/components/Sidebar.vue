<template>
  <aside class="app-sidebar fixed bottom-0 left-0 z-40 bg-navy text-white">
    <nav class="app-sidebar-nav mt-4 space-y-1.5 px-3.5">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :title="item.label"
        :aria-label="item.label"
        class="group flex h-11 items-center gap-3 rounded-lg px-4 text-sm text-slate-400 transition hover:bg-white/8 hover:text-white"
        :class="isActive(item.to) ? 'bg-bluebrand font-semibold text-white shadow-soft' : ''"
      >
        <span class="app-sidebar-icon grid h-5 w-5 shrink-0 place-content-center">
          <img :src="item.icon" :alt="`${item.label} icon`" class="h-[18px] w-[18px] object-contain opacity-75 transition group-hover:opacity-100" :class="isActive(item.to) ? 'opacity-100 brightness-0 invert' : ''" />
        </span>
        <span class="app-sidebar-label whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const navItems = computed(() => [
  { label: 'Tour Listing', to: '/tour-listing', icon: '/assets/ic-tour-listing.png' },
  { label: 'Create New Tour', to: '/create-tour', icon: '/assets/ic-add.png' },
  { label: 'Purchase Orders', to: '/purchase-orders', icon: '/assets/ic-purchase-order.png' },
  { label: 'Staff Admin', to: '/staff', icon: '/assets/ic-staff-admin.png' },
  { label: 'Customer', to: '/customers', icon: '/assets/ic-customer.png' },
  { label: 'Discount', to: '/discounts', icon: '/assets/ic-discount.png' },
])

function isActive(to: string) {
  if (to === '/tour-listing' && route.path.startsWith('/tour/')) return true
  return route.path === to
}
</script>
