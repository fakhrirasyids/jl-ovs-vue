<template>
  <AdminLayout>
    <section class="content-wrap">
      <div class="mb-5">
        <h1 class="page-title">Tour Listings</h1>
        <p class="page-subtitle">Manage all your tour packages</p>
      </div>

      <div class="card overflow-hidden">
        <div class="grid min-w-[840px] grid-cols-[300px_150px_140px_150px_100px] border-b border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700">
          <span>Tour</span><span>Duration</span><span>Price</span><span>Destination</span><span>Status</span>
        </div>
        <div v-if="loading" class="px-6 py-10 text-sm text-slate-500">Loading tours...</div>
        <div v-else-if="error" class="px-6 py-10 text-sm text-red-600">{{ error }}</div>
        <div v-else-if="!tours.length" class="px-6 py-10 text-sm text-slate-500">No tours yet. Create the first tour to start building listings.</div>
        <button v-for="tour in tours" v-else :key="tour.id" class="grid w-full min-w-[840px] grid-cols-[300px_150px_140px_150px_100px] items-center border-b border-slate-100 px-6 py-3 text-left text-sm transition hover:bg-slate-50" @click="$router.push(`/tour/${tour.id}`)">
          <div class="flex items-center gap-5">
            <img v-if="tour.heroImageUrl" :src="tour.heroImageUrl" alt="" class="h-14 w-14 shrink-0 rounded-lg object-cover" />
            <span v-else class="dummy-image h-14 w-14 shrink-0" aria-label="Tour image placeholder"></span>
            <b class="max-w-[205px] text-sm leading-5 text-slate-800">{{ tour.title }}</b>
          </div>
          <span class="text-slate-700">{{ durationLabel(tour) }}</span>
          <span class="font-semibold text-slate-900">{{ priceLabel(tour) }}</span>
          <span class="text-slate-800">{{ tour.destinationName || '-' }}</span>
          <span :class="tour.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'" class="w-fit rounded-full px-3 py-1 text-xs font-semibold">{{ statusLabel(tour.status) }}</span>
        </button>
      </div>

    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { listTours } from '../api/admin'
import type { Tour, TourStatus } from '../api/types'

const tours = ref<Tour[]>([])
const loading = ref(false)
const error = ref('')

function durationLabel(tour: Tour) {
  const days = tour.durationDays ?? 0
  const nights = tour.durationNights ?? 0
  if (!days && !nights) return '-'
  return `${days} Days ${nights} Nights`
}

function priceLabel(tour: Tour) {
  const firstPackage = tour.packages?.[0]
  if (!firstPackage) return '-'
  return `${firstPackage.currency} ${Number(firstPackage.adultPrice).toLocaleString()}`
}

function statusLabel(status: TourStatus) {
  return status === 'PUBLISHED' ? 'Live' : status[0] + status.slice(1).toLowerCase()
}

async function loadTours() {
  loading.value = true
  error.value = ''

  try {
    tours.value = await listTours()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load tours'
  } finally {
    loading.value = false
  }
}

onMounted(loadTours)
</script>
