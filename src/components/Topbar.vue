<template>
  <header class="app-topbar fixed left-0 right-0 top-0 z-30 h-16 bg-navy text-white">
    <div class="app-topbar-inner flex h-full items-center justify-between px-7">
      <div class="flex min-w-0 items-center gap-8">
        <LogoMark class="app-header-logo shrink-0" />
        <div class="app-topbar-search relative w-[640px] max-w-[58vw]">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/80">⌕</span>
          <input
            v-model="keyword"
            type="text"
            placeholder="Search"
            class="h-9 w-full rounded-lg border-0 bg-white/10 py-2 pl-11 pr-4 text-sm text-white placeholder:text-white/80 outline-none ring-1 ring-transparent focus:bg-white/15 focus:ring-blue-400"
          />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-bluebrand text-sm font-bold">A</div>
        <div class="leading-tight">
          <p class="text-sm font-semibold">Admin User</p>
          <p class="text-xs text-slate-300">admin@tourapp.com</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LogoMark from './LogoMark.vue'
const keyword = ref('')
</script>
