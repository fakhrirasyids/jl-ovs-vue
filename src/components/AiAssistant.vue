<template>
  <div :class="mode === 'drawer' ? 'h-full rounded-none border-0' : 'card h-full'" class="flex min-h-0 flex-col bg-white">
    <div v-if="mode === 'drawer'" class="shrink-0 rounded-t-[14px] bg-gradient-to-r from-bluebrand to-purplebrand px-4 py-4 text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 text-lg font-bold">
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <img src="/assets/icons/ic-ai-assistant.png" alt="" class="h-5 w-5" />
          </span>
          AI Assistant
        </div>
        <button class="text-3xl leading-none transition hover:opacity-80" @click="$emit('close')">×</button>
      </div>
    </div>
    <div v-else class="flex shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-3">
      <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-bluebrand text-white">
        <img src="/assets/icons/ic-ai-assistant.png" alt="" class="h-5 w-5" />
      </span>
      <b class="text-sm">AI Listing Assistant</b>
    </div>

    <div v-if="showStatus" class="shrink-0 border-b border-slate-200 px-4 py-4">
      <p class="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-800">Tour Setup Status</p>
      <div v-for="row in statusRows" :key="row.label" class="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>{{ row.label }}</span>
        <span v-if="row.done" class="grid h-4 w-4 place-content-center rounded-full border border-emerald-500 text-[10px] text-emerald-500">✓</span>
        <span v-else class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">In Progress</span>
      </div>
    </div>

    <div v-if="mode === 'drawer'" class="shrink-0 border-b border-slate-100 bg-white px-4 py-4">
      <p class="mb-3 text-sm text-slate-500">Quick Actions</p>
      <div class="grid grid-cols-3 gap-2">
        <button class="rounded-lg border border-slate-200 p-3 text-center text-xs leading-4 hover:bg-slate-50" @click="$router.push('/create-tour')"><div class="mb-2 text-2xl">🗺️</div>Create<br/>New Tour</button>
        <button class="rounded-lg border border-slate-200 p-3 text-center text-xs leading-4 hover:bg-slate-50" @click="openImportFlow"><div class="mb-2 text-2xl">📥</div>Import<br/>Tour Listing</button>
        <button class="rounded-lg border border-slate-200 p-3 text-center text-xs leading-4 hover:bg-slate-50" @click="$router.push('/staff')"><div class="mb-2 text-2xl">👤</div>Add<br/>New Admin</button>
      </div>
    </div>

    <div ref="scrollContainer" class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div v-for="(message, idx) in messages" :key="idx" class="mb-3">
        <div :class="message.from === 'user' ? 'ml-auto border-blue-200 bg-blue-50' : 'mr-auto border-slate-200 bg-slate-50'" class="max-w-[310px] whitespace-pre-line rounded-lg border px-4 py-3 text-sm leading-6 text-slate-700 shadow-soft">
          {{ message.text }}
        </div>
        <p class="mt-1 text-xs text-slate-400" :class="message.from === 'user' ? 'text-right' : ''">{{ message.time || '10:31 AM' }}</p>
      </div>
      <div ref="messagesEnd"></div>
    </div>

    <div class="assistant-composer-wrap">
      <div class="assistant-composer">
        <input v-model="draft" @keydown.enter="send" placeholder="Create new tour...." />
        <button class="assistant-plus-button" type="button" aria-label="Add attachment">＋</button>
        <button class="assistant-send-button" type="button" aria-label="Send message" @click="send">
          <img src="/assets/icons/ic-send.png" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

defineProps<{ mode?: 'panel' | 'drawer'; showStatus?: boolean; compact?: boolean }>()
defineEmits<{ close: [] }>()

const statusRows = [
  { label: 'Basic Information', done: true },
  { label: 'Itinerary & Schedule', done: true },
  { label: 'Pricing Estimation', done: true },
  { label: 'Media & AI Images', done: false },
]

const messages = ref([
  { from: 'bot', text: "Hello! I am your AI Tour Creation Assistant. I can help you with:\n\n• Defining descriptions and itineraries\n• Generating pricing and cost estimations\n• Creating time schedules\n• Generating AI Images for your tour\n\nLet's get started. What is the main destination for this international tour package?", time: '10:30 AM' },
  { from: 'user', text: 'Japan - Tokyo, Mt. Fuji, and Kyoto', time: '10:31 AM' },
  { from: 'bot', text: 'Excellent choice! Destination: Japan (Tokyo, Mt. Fuji, Kyoto). What is the main theme or focus of this tour? (e.g., Cherry Blossoms, Winter Ski, Cultural Heritage, Food, etc.)', time: '10:31 AM' },
  { from: 'user', text: 'Cherry blossoms viewing and cultural heritage exploration', time: '10:32 AM' },
  { from: 'bot', text: 'Perfect! I have started drafting your tour listing with a focus on Sakura season and Japanese culture. What is your target duration and estimated retail price per person?', time: '10:32 AM' },
  { from: 'user', text: '7 Days 6 Nights, retail price around USD 2,500', time: '10:33 AM' },
  { from: 'bot', text: 'Alright! Based on a 7D6N duration and USD 2,500 target price, I have generated:\n\n✓ Tour Identity & Descriptions\n✓ Day-by-Day Itinerary\n✓ Pricing & Offer Details\n\nI have populated the listing form on the right. You can edit the text fields directly or ask me to revise.', time: '10:33 AM' },
] as { from: string; text: string; time?: string }[])
const draft = ref('')
const scrollContainer = ref<HTMLElement | null>(null)
const messagesEnd = ref<HTMLElement | null>(null)

function scrollToBottom(instant = false) {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: scrollContainer.value.scrollHeight,
        behavior: instant ? 'auto' : 'smooth',
      })
    }
  })
}

function send() {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ from: 'user', text, time: 'Now' })
  messages.value.push({ from: 'bot', text: 'Got it. I updated the dummy UI state and kept the tour draft consistent with your latest instruction.', time: 'Now' })
  draft.value = ''
}

function openImportFlow() {
  messages.value.push({ from: 'bot', text: 'Import flow opened. Upload CSV or paste tour listings to continue.', time: 'Now' })
}

watch(() => messages.value.length, () => scrollToBottom())
onMounted(() => scrollToBottom(true))
</script>
