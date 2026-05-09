<template>
  <Sidebar />
  <Topbar />
  <main class="admin-page">
    <slot />
  </main>
  <Transition name="assistant-panel">
    <aside v-if="!hideAssistant && assistantOpen" class="admin-assistant-shell">
      <AiAssistant mode="drawer" @close="assistantOpen = false" />
    </aside>
  </Transition>
  <Transition name="assistant-fab">
    <button
      v-if="!hideAssistant && !assistantOpen"
      class="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-content-center rounded-full bg-gradient-to-br from-bluebrand to-purplebrand text-xl text-white shadow-xl transition hover:scale-105 active:scale-95"
      aria-label="Open AI Assistant"
      @click="assistantOpen = true"
    >
      <img src="/assets/icons/ic-ai-assistant.png" alt="" class="h-6 w-6" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AiAssistant from '../components/AiAssistant.vue'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'

defineProps<{ hideAssistant?: boolean }>()
const assistantOpen = ref(false)
</script>
