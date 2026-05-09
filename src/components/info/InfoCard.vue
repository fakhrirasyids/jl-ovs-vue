<template>
  <div class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
    <span class="grid h-9 w-9 place-content-center rounded-lg bg-slate-50 text-lg text-bluebrand">{{ icon }}</span>
    <div>
      <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ title }}</p>
      <p class="text-sm font-bold text-slate-900">{{ value }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ icon: string; title: string; value: string }>()
</script>
