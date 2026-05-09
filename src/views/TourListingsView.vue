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
        <button v-for="tour in tours" :key="tour.title" class="grid w-full min-w-[840px] grid-cols-[300px_150px_140px_150px_100px] items-center border-b border-slate-100 px-6 py-3 text-left text-sm transition hover:bg-slate-50" @click="$router.push('/tour/jp-sakura')">
          <div class="flex items-center gap-5">
            <span class="dummy-image h-14 w-14 shrink-0" aria-label="Tour image placeholder"></span>
            <b class="max-w-[205px] text-sm leading-5 text-slate-800">{{ tour.title }}</b>
          </div>
          <span class="text-slate-700">{{ tour.duration }}</span>
          <span class="font-semibold text-slate-900">{{ tour.price }}<br/><span class="text-sm font-normal text-slate-400 line-through" v-if="tour.oldPrice">{{ tour.oldPrice }}</span></span>
          <span class="text-slate-800">{{ tour.destination }}</span>
          <span :class="tour.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'" class="w-fit rounded-full px-3 py-1 text-xs font-semibold">{{ tour.status }}</span>
        </button>
      </div>

    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '../layouts/AdminLayout.vue'

const tours = [
  { title: 'BEIJING - SHANGHAI MOSLEM 6D5N TOUR', duration: '3 Days 2 Nights', price: 'Rp 2.400.000', destination: 'Indonesia', status: 'Live' },
  { title: 'SAWASDEE BANGKOK 5D4N TOUR', duration: '3 Days 2 Nights', price: 'Rp 2.400.000', oldPrice: 'Rp 3.000.000', destination: 'Thailand', status: 'Live' },
  { title: 'BEIJING MOSLEM 4D3N TOUR', duration: '3 Days 2 Nights', price: 'Rp 2.400.000', oldPrice: 'Rp 3.000.000', destination: 'Indonesia', status: 'Draft' },
  { title: 'BEIJING MOSLEM 4D3N TOUR', duration: '3 Days 2 Nights', price: 'Rp 2.400.000', oldPrice: 'Rp 3.000.000', destination: 'Indonesia', status: 'Draft' },
  { title: 'BEIJING MOSLEM 4D3N TOUR', duration: '3 Days 2 Nights', price: 'Rp 2.400.000', oldPrice: 'Rp 3.000.000', destination: 'Indonesia', status: 'Draft' },
  { title: 'BEIJING MOSLEM 4D3N TOUR', duration: '3 Days 2 Nights', price: 'Rp 2.400.000', oldPrice: 'Rp 3.000.000', destination: 'Indonesia', status: 'Draft' },
  { title: 'BEIJING MOSLEM 4D3N TOUR', duration: '3 Days 2 Nights', price: 'Rp 2.400.000', oldPrice: 'Rp 3.000.000', destination: 'Indonesia', status: 'Draft' },
]
</script>
