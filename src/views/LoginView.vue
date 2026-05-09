<template>
  <div class="login-pattern relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-12 text-white">
    <form class="relative z-10 w-full max-w-[326px] translate-y-[10px]" @submit.prevent="$router.push('/tour-listing')">
      <div class="mb-10">
        <LogoMark class="login-logo" />
      </div>
      <h1 class="mb-4 text-xl font-extrabold leading-6">Admin Panel</h1>
      <label class="mb-2 block text-sm font-bold leading-5">Username</label>
      <input
        v-model="username"
        class="mb-6 h-10 w-full rounded-lg border border-white/85 bg-transparent px-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-white focus:ring-2 focus:ring-white/15"
      />
      <label class="mb-2 block text-sm font-bold leading-5">Password</label>
      <div class="mb-10 flex h-10 w-full items-center rounded-lg border border-white/85 bg-transparent px-3 transition focus-within:border-white focus-within:ring-2 focus-within:ring-white/15">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          class="min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none"
        />
        <button type="button" class="shrink-0 text-sm font-medium text-white transition hover:text-white/80" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'View' }}</button>
      </div>
      <button type="submit" class="h-12 w-full rounded-xl bg-gradient-to-r from-bluebrand to-purplebrand text-sm font-bold shadow-lg shadow-blue-950/40 transition hover:opacity-95 active:scale-[.99] sm:w-[186px]">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import LogoMark from '../components/LogoMark.vue'

const username = ref('Johndoe123')
const password = ref('password')
const showPassword = ref(false)

onMounted(() => {
  document.body.classList.add('login-body')
})

onUnmounted(() => {
  document.body.classList.remove('login-body')
})
</script>
