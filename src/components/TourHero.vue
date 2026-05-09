<template>
  <section class="relative h-[285px] overflow-hidden bg-slate-800">
    <div class="dummy-image absolute inset-0 rounded-none" aria-label="Tour hero placeholder"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-slate-700/50 via-slate-500/20 to-transparent"></div>
    <div class="absolute bottom-6 left-8 right-8 flex items-end justify-between">
      <div class="text-white">
        <span class="rounded-full bg-amber-500 px-6 py-1.5 text-xs font-bold text-white">{{ published ? 'Live' : 'Draft' }}</span>
        <h1 class="mt-3 text-2xl font-extrabold">Tokyo to Kyoto Escape 7D 6N</h1>
        <div class="mt-3 flex items-center gap-6 text-xs text-white/75">
          <span>⌖ Tokyo · Mt. Fuji · Hakone · Kyoto · Nara</span>
          <span>ID: JP-SAKURA-7D6N-2026</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span v-for="item in thumbs" :key="item" class="dummy-image h-12 w-12 rounded-lg border-2 border-white/70 shadow" aria-label="Tour thumbnail placeholder"></span>
        <button class="h-12 w-12 rounded-lg border border-white/60 bg-white/10 text-xs text-white backdrop-blur">▧<br/>+5</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ published?: boolean }>()
const thumbs = ['1', '2', '3', '4', '5']
</script>
