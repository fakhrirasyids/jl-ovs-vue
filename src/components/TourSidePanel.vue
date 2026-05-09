<template>
  <aside class="tour-side-panel w-[270px] shrink-0 border-l border-slate-200 bg-white p-4">
    <div :class="published ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'" class="rounded-xl border p-4">
      <p class="font-bold">{{ published ? '✓ Published' : 'ⓘ Draft — Not Published' }}</p>
      <p class="mt-2 text-xs leading-5 text-slate-600">This listing is saved as a draft. Publish it to make it visible to customers.</p>
      <button class="btn-gradient mt-3 w-full py-2.5 text-xs" @click="$emit('publish')">🌐 Publish Listing</button>
    </div>

    <h4 class="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Quick Details</h4>
    <div class="mt-3 space-y-2">
      <InfoCard icon="◇" title="Retail Price" value="USD 2,500 / pax" />
      <InfoCard icon="◷" title="Duration" value="7 Days · 6 Nights" />
      <InfoCard icon="♧" title="Group Size" value="15–20 Pax" />
      <InfoCard icon="⌖" title="Destination" value="Japan (3 Cities)" />
    </div>

    <h4 class="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Listing Info</h4>
    <div class="card mt-3 space-y-2 p-4 text-xs">
      <div class="flex justify-between"><span class="text-slate-500">Tour ID</span><b>JP-SAKURA-7D6N-2026</b></div>
      <div class="flex justify-between"><span class="text-slate-500">Brand</span><b>Global Explorer</b></div>
      <div class="flex justify-between"><span class="text-slate-500">Category</span><b>International</b></div>
      <div class="flex justify-between"><span class="text-slate-500">AI Generated</span><b class="text-bluebrand">⊙ Yes</b></div>
      <div class="flex justify-between"><span class="text-slate-500">Created</span><b>Apr 7, 2026</b></div>
    </div>

    <h4 class="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Listing Checklist</h4>
    <div class="mt-3 space-y-2 text-sm">
      <p v-for="item in done" :key="item" class="text-slate-700"><span class="mr-2 text-emerald-500">⊙</span>{{ item }}</p>
      <p v-for="item in todo" :key="item" class="text-slate-400"><span class="mr-2">○</span>{{ item }}</p>
      <div class="pt-2">
        <div class="flex justify-between text-xs"><span>Completeness</span><b>75%</b></div>
        <div class="mt-2 h-1.5 rounded-full bg-slate-100"><div class="h-full w-3/4 rounded-full bg-bluebrand"></div></div>
      </div>
    </div>

    <button class="mt-8 w-full rounded-lg border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-500" @click="$emit('delete')">🗑 Delete Listing</button>
  </aside>
</template>

<script setup lang="ts">
import InfoCard from './info/InfoCard.vue'
defineProps<{ published?: boolean }>()
defineEmits<{ publish: []; delete: [] }>()
const done = ['Tour Name & Description', 'Day-by-Day Itinerary', 'Pricing & Offers', 'Hero Image', 'Gallery Photos (5+)', 'Inclusions & Exclusions']
const todo = ['Departure Dates Set', 'Booking Form Linked']
</script>
