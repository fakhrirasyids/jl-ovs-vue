<template>
  <AdminLayout>
    <section class="content-wrap">
      <div class="mb-5 flex items-center justify-between gap-4"><div><h1 class="page-title">Discount Settings</h1><p class="page-subtitle">Manage general B2B customer discount tiers globally instead of per-product discounts.</p></div><button class="btn-primary" @click="addTier">＋ Add Discount Tier</button></div>
      <div class="card overflow-hidden">
        <div class="grid min-w-[820px] grid-cols-[1fr_160px_180px_110px_100px] border-b border-slate-200 px-6 py-3 text-sm font-bold text-slate-700"><span>Tier Name</span><span>Discount</span><span>Min. Order Value</span><span>Status</span><span>Actions</span></div>
        <div v-for="(tier, i) in tiers" :key="tier.name" class="grid min-w-[820px] grid-cols-[1fr_160px_180px_110px_100px] items-center border-b border-slate-100 px-6 py-3 text-sm">
          <div class="flex items-center gap-4"><span class="grid h-9 w-9 place-content-center overflow-hidden rounded-full bg-blue-50"><img class="h-9 w-9" src="/assets/icons/ic-dummy-cust.png" alt="" /></span><span class="font-medium">{{ tier.name }}</span></div>
          <span class="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{{ tier.discount }}% Off</span>
          <span class="text-slate-600">${{ tier.min.toLocaleString() }}</span>
          <button class="h-7 w-12 rounded-full p-1 transition" :class="tier.enabled ? 'bg-bluebrand' : 'bg-slate-200'" @click="tier.enabled = !tier.enabled"><span class="block h-5 w-5 rounded-full bg-white transition" :class="tier.enabled ? 'translate-x-5' : ''"></span></button>
          <div class="row-actions"><button aria-label="Edit discount tier" @click="tier.discount += 1"><img src="/assets/icons/ic-edit.png" alt="" /></button><button aria-label="Delete discount tier" @click="tiers.splice(i,1)"><img src="/assets/icons/ic-delete.png" alt="" /></button></div>
        </div>
      </div>
    </section>
  </AdminLayout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
const tiers = ref([{ name:'Bronze', discount:5, min:1000, enabled:true }, { name:'Silver', discount:10, min:5000, enabled:false }, { name:'Gold', discount:15, min:10000, enabled:false }])
function addTier() { tiers.value.push({ name:'Platinum', discount:20, min:15000, enabled:false }) }
</script>
