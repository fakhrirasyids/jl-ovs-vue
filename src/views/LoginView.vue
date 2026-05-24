<template>
  <div class="login-pattern relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-12 text-white">
    <form class="relative z-10 w-full max-w-[326px] translate-y-[10px]" @submit.prevent="submitLogin">
      <div class="mb-10">
        <LogoMark class="login-logo" />
      </div>
      <h1 class="mb-4 text-xl font-extrabold leading-6">Admin Panel</h1>
      <label class="mb-2 block text-sm font-bold leading-5">Email</label>
      <input
        v-model="email"
        type="email"
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
      <p v-if="error" class="mb-4 rounded-lg border border-red-300 bg-red-500/15 px-3 py-2 text-sm text-red-100">{{ error }}</p>
      <button type="submit" :disabled="loading" class="h-12 w-full rounded-xl bg-gradient-to-r from-bluebrand to-purplebrand text-sm font-bold shadow-lg shadow-blue-950/40 transition hover:opacity-95 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-[186px]">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogoMark from '../components/LogoMark.vue'
import { loginAdmin } from '../api/admin'

const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function submitLogin() {
  error.value = ''
  loading.value = true

  try {
    await loginAdmin({ email: email.value.trim(), password: password.value })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/tour-listing'
    await router.push(redirect)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.body.classList.add('login-body')
})

onUnmounted(() => {
  document.body.classList.remove('login-body')
})
</script>
