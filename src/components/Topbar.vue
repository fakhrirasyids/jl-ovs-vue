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
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-bluebrand text-sm font-bold">{{ initial }}</div>
        <div class="leading-tight">
          <p class="text-sm font-semibold">{{ admin?.name || 'Admin User' }}</p>
          <p class="text-xs text-slate-300">{{ admin?.email || 'admin@jalanoverseas.com' }}</p>
        </div>
        <button class="ml-3 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10" @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoMark from './LogoMark.vue'
import { getStoredAdmin } from '../api/client'
import { logoutAdmin } from '../api/admin'
import type { AdminUser } from '../api/types'

const keyword = ref('')
const router = useRouter()
const admin = ref(getStoredAdmin<AdminUser>())
const initial = computed(() => admin.value?.name?.trim()[0]?.toUpperCase() || 'A')

async function logout() {
  logoutAdmin()
  await router.push('/login')
}
</script>
