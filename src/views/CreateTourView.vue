<template>
  <AdminLayout hide-assistant>
    <section class="create-tour-page mx-auto max-w-[1180px] px-6 py-5">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="page-title">{{ editingTourId ? 'Edit Tour' : 'Create New Tour' }}</h1>
          <p class="page-subtitle">{{ editingTourId ? 'Update tour package details' : 'Add a new tour package for customers' }}</p>
        </div>
        <button class="btn-gradient h-[50px] w-48 rounded-xl disabled:cursor-not-allowed disabled:opacity-60" :disabled="saving" @click="saveDraft">
          {{ saving ? 'Saving...' : editingTourId ? 'Save changes' : 'Save to draft' }}
        </button>
      </div>

      <div class="create-tour-workspace grid min-h-[calc(100vh-170px)] grid-cols-[380px_minmax(0,1fr)] bg-white">
        <aside class="create-assistant flex min-h-0 flex-col border-r border-slate-200 bg-white">
          <div class="flex h-[68px] shrink-0 items-center gap-3 border-b border-slate-200 px-4">
            <span class="grid h-10 w-10 place-content-center rounded-full bg-bluebrand text-lg text-white">
              <img src="/assets/icons/ic-ai-assistant.png" alt="" class="h-5 w-5" />
            </span>
            <b class="text-sm">AI Listing Assistant</b>
          </div>

          <div class="shrink-0 border-b border-slate-200 px-4 py-4">
            <p class="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-900">Tour Setup Status</p>
            <div v-for="row in setupRows" :key="row.label" class="mb-2.5 flex items-center justify-between text-sm text-slate-600">
              <span>{{ row.label }}</span>
              <span v-if="row.done" class="grid h-4 w-4 place-content-center rounded-full border border-emerald-500 text-[10px] text-emerald-500">✓</span>
              <span v-else class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">In Progress</span>
            </div>
          </div>

          <div ref="chatScroller" class="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
            <div v-for="(message, index) in messages" :key="index" class="mb-3">
              <div
                class="max-w-[308px] whitespace-pre-line rounded-lg border px-4 py-3 text-sm leading-6 text-slate-700 shadow-soft"
                :class="message.from === 'user' ? 'ml-auto border-blue-200 bg-blue-50' : 'mr-auto border-slate-200 bg-white'"
              >
                {{ message.text }}
              </div>
              <p class="mt-1 text-xs text-slate-400" :class="message.from === 'user' ? 'text-right' : ''">{{ message.time }}</p>
            </div>
          </div>

          <form class="assistant-composer-wrap" @submit.prevent="sendMessage">
            <div class="assistant-composer">
              <input v-model="draft" placeholder="Create new tour...." />
              <button class="assistant-plus-button" type="button" aria-label="Add attachment">＋</button>
              <button type="submit" class="assistant-send-button" aria-label="Send message">
                <img src="/assets/icons/ic-send.png" alt="" />
              </button>
            </div>
          </form>
        </aside>

        <div class="create-editor min-w-0 bg-white px-6 py-6">
          <div class="mb-8 rounded-xl bg-slate-100 p-4">
            <div class="grid grid-cols-4 gap-3">
              <button v-for="tab in mainTabs" :key="tab.id" class="tab h-[38px] whitespace-nowrap" :class="activeMain === tab.id ? 'tab-active' : ''" @click="activeMain = tab.id">
                {{ tab.label }}
              </button>
            </div>
          </div>

          <section v-if="activeMain === 'overview'">
            <h2 class="section-title">Tour Details</h2>
            <p class="text-sm text-slate-500">Provide a detailed information of the tour.</p>
            <div class="mt-3 border-t border-slate-200 pt-6">
              <div class="mb-5 flex gap-12 border-b border-slate-200 pl-6">
                <button class="subtab subtab-active">English (US)</button>
                <button class="subtab">Bahasa (ID)</button>
                <button class="subtab">Chinese</button>
              </div>
              <div class="space-y-5">
                <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                  <label class="pt-3 text-right text-sm font-bold text-slate-700"><span class="text-red-500">* </span>Slug <span class="text-slate-400">ⓘ</span></label>
                  <div>
                  <input v-model="overview.slug" class="input h-14 w-full rounded-none border-slate-400 disabled:bg-slate-100" :disabled="Boolean(editingTourId)" />
                  </div>
                </div>
                <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                  <label class="pt-3 text-right text-sm font-bold text-slate-700"><span class="text-red-500">* </span>Tour Package Name <span class="text-slate-400">ⓘ</span></label>
                  <div>
                  <input v-model="overview.title" class="input h-14 w-full rounded-none border-slate-400" />
                  <button class="btn-outline mt-3 py-1.5 text-xs" type="button" @click="overview.title = 'Tokyo to Kyoto Escape'">↻ Regenerate Content</button>
                  </div>
                </div>
                <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                  <label class="pt-3 text-right text-sm font-bold text-slate-700"><span class="text-red-500">* </span>Destination <span class="text-slate-400">ⓘ</span></label>
                  <div>
                  <input v-model="overview.destinationName" class="input h-10 w-full rounded-none border-slate-400" />
                  </div>
                </div>
                <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                  <label class="pt-3 text-right text-sm font-bold text-slate-700">Partner</label>
                  <input v-model="overview.partnerName" class="input h-10 w-full rounded-none border-slate-400" />
                </div>
                <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                  <label class="pt-3 text-right text-sm font-bold text-slate-700">Hero Image URL</label>
                  <input v-model="overview.heroImageUrl" class="input h-10 w-full rounded-none border-slate-400" />
                </div>
                <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                  <label class="pt-3 text-right text-sm font-bold text-slate-700">Trip Rules</label>
                  <div class="grid grid-cols-4 gap-3">
                    <input v-model.number="overview.durationDays" class="input h-10" placeholder="Days" type="number" min="0" />
                    <input v-model.number="overview.durationNights" class="input h-10" placeholder="Nights" type="number" min="0" />
                    <input v-model.number="overview.minPax" class="input h-10" placeholder="Min pax" type="number" min="0" />
                    <input v-model.number="overview.maxPax" class="input h-10" placeholder="Max pax" type="number" min="0" />
                  </div>
                </div>
                <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                  <label class="pt-16 text-right text-sm font-bold text-slate-700">Tour Description <span class="text-slate-400">ⓘ</span></label>
                  <div>
                  <textarea v-model="overview.description" class="input h-36 w-full rounded-none border-slate-400 leading-6"></textarea>
                  <button class="btn-outline mt-3 py-1.5 text-xs" type="button">↻ Regenerate Content</button>
                  </div>
                </div>
                <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                  <label class="pt-16 text-right text-sm font-bold text-slate-700">Inclusion <span class="text-slate-400">ⓘ</span></label>
                  <div>
                  <textarea v-model="overview.inclusion" class="input h-36 w-full rounded-none border-slate-400 leading-6"></textarea>
                  <button class="btn-outline mt-3 py-1.5 text-xs" type="button">↻ Regenerate Content</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section v-if="activeMain === 'schedule'">
            <div class="mb-8 border-b border-slate-200">
              <button v-for="tab in scheduleTabs" :key="tab.id" class="subtab" :class="activeSchedule === tab.id ? 'subtab-active' : ''" @click="activeSchedule = tab.id">
                {{ tab.label }}
              </button>
            </div>

            <div v-if="activeSchedule === 'package'">
              <div class="mb-5 flex items-center justify-between gap-3">
                <h2 class="section-title">Package</h2>
                <button class="btn-primary" @click="addPackage">＋ Add package</button>
              </div>
              <div class="rounded-lg border border-slate-200 p-6">
                <div class="grid min-w-[860px] grid-cols-[1fr_128px_128px_88px_112px_112px_76px_28px] gap-3 border-b border-slate-200 pb-4 text-sm font-semibold text-slate-600">
                  <span>Package</span><span>Start Date</span><span>End Date</span><span>Inventory</span><span>Adult</span><span>Child</span><span>Currency</span><span></span>
                </div>
                <div v-for="(pkg, index) in packages" :key="index" class="grid min-w-[860px] grid-cols-[1fr_128px_128px_88px_112px_112px_76px_28px] gap-3 border-b border-slate-100 py-3">
                  <input v-model="pkg.name" class="input h-10" />
                  <input v-model="pkg.startDate" class="input h-10" type="date" />
                  <input v-model="pkg.endDate" class="input h-10" type="date" />
                  <input v-model.number="pkg.inventory" class="input h-10" type="number" min="0" />
                  <input v-model.number="pkg.adultPrice" class="input h-10" type="number" min="0" />
                  <input v-model.number="pkg.childPrice" class="input h-10" type="number" min="0" />
                  <input v-model="pkg.currency" class="input h-10" maxlength="3" />
                  <button class="text-red-500" type="button" @click="packages.splice(index, 1)">🗑</button>
                </div>
              </div>
            </div>

            <div v-if="activeSchedule === 'pricing'" class="space-y-3">
              <h2 class="section-title">Pricing</h2>
              <div v-for="(hotel, hotelIndex) in pricing" :key="hotel.hotel" class="rounded-lg border border-slate-200 p-6">
                <div class="mb-5 flex items-center justify-between">
                  <h3 class="section-title">{{ hotel.hotel }}</h3>
                  <button class="btn-primary" @click="addPricing(hotelIndex)">＋ pricing</button>
                </div>
                <div class="price-grid grid min-w-[650px] grid-cols-[1fr_128px_68px_92px_92px] gap-3 border-b border-slate-200 pb-3 text-sm font-semibold text-slate-600">
                  <span>Package</span><span>Price</span><span>Inventory</span><span>Min buy</span><span>Max buy</span>
                </div>
                <div v-for="(row, index) in hotel.rows" :key="index" class="price-grid grid min-w-[650px] grid-cols-[1fr_128px_68px_92px_92px] gap-3 border-b border-slate-100 py-3">
                  <input class="input h-10 bg-slate-100" :value="hotel.hotel" readonly />
                  <input class="input h-10" :value="`USD  ${row.price}`" />
                  <input class="input h-10" value="50" />
                  <input class="input h-10" :value="`${row.min} pax`" />
                  <input class="input h-10" :value="`${row.max} pax`" />
                </div>
              </div>
            </div>

            <div v-if="activeSchedule === 'addon'">
              <div class="mb-6 flex items-center justify-between">
                <h2 class="section-title">Add-on</h2>
                <button class="btn-primary" @click="addAddon">＋ Add-on</button>
              </div>
              <div class="rounded-lg border border-slate-200 p-6">
                <div class="price-grid grid min-w-[650px] grid-cols-[1fr_128px_68px_92px_92px] gap-3 border-b border-slate-200 pb-3 text-sm font-semibold text-slate-600">
                  <span>Add On Name</span><span>Price</span><span>Inventory</span><span>Min buy</span><span>Max buy</span>
                </div>
                <div v-for="(row, index) in addons" :key="index" class="price-grid grid min-w-[650px] grid-cols-[1fr_128px_68px_92px_92px] gap-3 border-b border-slate-100 py-3">
                  <input class="input h-10" v-model="row.name" />
                  <input class="input h-10" :value="'USD  ' + row.price" />
                  <input class="input h-10" v-model="row.inventory" />
                  <input class="input h-10" :value="row.min + ' pax'" />
                  <input class="input h-10" :value="row.max + ' pax'" />
                </div>
              </div>
            </div>

            <div v-if="activeSchedule === 'exceptions'">
              <div class="mb-6 flex items-center justify-between">
                <h2 class="section-title">Price Exception</h2>
                <button class="btn-primary" @click="addException">＋ exception</button>
              </div>
              <div class="mb-5 flex flex-wrap items-center gap-5">
                <input class="input h-11 w-64" value="2/4/2026" />
                <span>-</span>
                <input class="input h-11 w-64" value="2/4/2026" />
                <button class="text-red-500">🗑</button>
              </div>
              <div class="rounded-lg border border-slate-200 p-6">
                <div class="price-grid grid min-w-[650px] grid-cols-[1fr_128px_68px_92px_92px] gap-3 border-b border-slate-200 pb-3 text-sm font-semibold text-slate-600">
                  <span>Package</span><span>Price</span><span>Inventory</span><span>Min buy</span><span>Max buy</span>
                </div>
                <div v-for="(row, index) in exceptions" :key="index" class="price-grid grid min-w-[650px] grid-cols-[1fr_128px_68px_92px_92px] gap-3 border-b border-slate-100 py-3">
                  <input class="input h-10" v-model="row.name" />
                  <input class="input h-10" :value="'USD  ' + row.price" />
                  <input class="input h-10" v-model="row.inventory" />
                  <input class="input h-10" :value="row.min + ' pax'" />
                  <input class="input h-10" :value="row.max + ' pax'" />
                </div>
              </div>
            </div>

            <div v-if="activeSchedule === 'cancel'" class="text-sm text-slate-700">
              <h2 class="mb-8 section-title">Cancellation Policies</h2>
              <div class="space-y-8">
                <div>
                  <p class="mb-3">Refundable</p>
                  <label class="mr-6"><input type="radio" name="refundable" /> No</label>
                  <label><input type="radio" name="refundable" /> Yes</label>
                </div>
                <div class="flex flex-wrap items-end gap-8">
                  <div>
                    <p class="mb-3">Free Cancellation</p>
                    <label class="mr-6"><input type="radio" name="free" /> No</label>
                    <label><input checked type="radio" name="free" /> Yes</label>
                  </div>
                  <label class="text-xs text-slate-500"><span class="text-red-500">*</span> Free Cancellation Days<br /><input class="input mt-1 h-10 w-24" value="90" /></label>
                </div>
                <div>
                  <p class="mb-3">Penalty Charge for No Show</p>
                  <div class="input flex h-10 w-32 items-center justify-between">100 <span class="text-slate-400">%</span></div>
                </div>
                <div>
                  <p class="mb-3">Cancellation Policies</p>
                  <div class="rounded-lg border border-slate-200 p-4">
                    <label class="mb-4 block text-xs text-slate-500"><span class="text-red-500">*</span> Days in advance<br /><input class="input mt-1 h-10 w-24" value="10" /></label>
                    <label class="block text-xs text-slate-500"><span class="text-red-500">*</span> Penalty Charge<br /><div class="input mt-1 flex h-10 w-24 items-center justify-between">1 <span>%</span></div></label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section v-if="activeMain === 'itinerary'">
            <div class="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 class="section-title">Day-by-Day Schedule</h2>
                <p class="text-sm text-slate-500">Provide a detailed breakdown of activities for each day of the tour.</p>
              </div>
              <button class="btn-primary" @click="addDay">＋ Add itinerary</button>
            </div>
            <div v-for="(day, index) in days" :key="index" class="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="section-title">Day {{ index + 1 }}</h3>
                <button class="text-red-500" @click="days.splice(index, 1)">🗑</button>
              </div>
              <div class="create-form-row mb-4 grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                <label class="pt-2 text-right text-sm font-bold text-slate-700"><span class="text-red-500">* </span>Day Title</label>
                <div>
                <input v-model="day.title" class="input h-10 w-full rounded-none border-slate-400" />
                </div>
              </div>
              <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                <label class="pt-8 text-right text-sm font-bold text-slate-700">Day Description</label>
                <div>
                <textarea v-model="day.desc" class="input h-[76px] w-full rounded-none border-slate-400"></textarea>
                <button v-if="day.desc" class="btn-outline mt-3 py-1.5 text-xs" type="button">↻ Regenerate Content</button>
                </div>
              </div>
            </div>
          </section>

          <section v-if="activeMain === 'media'">
            <h2 class="section-title">Media Generation</h2>
            <p class="text-sm text-slate-500">Provide high-quality images for your listing. You can upload or use our AI Generator.</p>
            <div class="mt-3 border-t border-slate-200 pt-6">
              <div class="create-form-row grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                <label class="pt-3 text-right text-sm font-bold text-slate-700">AI Image Prompt <span class="text-slate-400">ⓘ</span></label>
                <div>
                <input v-model="mediaPrompt" class="input h-14 w-full rounded-none border-slate-400" />
                <button class="btn-gradient mt-4" @click="generatedAssets.push(String(generatedAssets.length + 1))">Generate Image</button>
                </div>
              </div>
              <div class="mt-7 rounded-lg border border-slate-200 p-5">
                <h3 class="mb-4 font-bold">Generated Assets</h3>
                <div class="flex gap-4 overflow-x-auto pb-1">
                  <span v-for="asset in generatedAssets" :key="asset" class="dummy-image h-[148px] w-[158px] shrink-0" aria-label="Generated image placeholder"></span>
                  <button class="grid h-[148px] w-[158px] shrink-0 place-content-center rounded bg-slate-50 text-sm text-slate-500">▧<br />Upload Image</button>
                </div>
              </div>
            </div>
          </section>
          <p v-if="saveError" class="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ saveError }}</p>
        </div>
      </div>
    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import { createTour, getTour, replaceTourPackages, updateTour } from '../api/admin'
import type { PackageRequest, Tour } from '../api/types'

const router = useRouter()
const route = useRoute()
const editingTourId = ref(typeof route.query.tourId === 'string' ? route.query.tourId : '')
const activeMain = ref('overview')
const activeSchedule = ref('package')
const draft = ref('')
const chatScroller = ref<HTMLElement | null>(null)
const saving = ref(false)
const saveError = ref('')

const mainTabs = [
  { id: 'overview', label: 'Tour Overview' },
  { id: 'schedule', label: 'Schedule & Package' },
  { id: 'itinerary', label: 'Itinerary Details' },
  { id: 'media', label: 'Media & Images' },
]
const scheduleTabs = [
  { id: 'package', label: 'Package' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'addon', label: 'Add-on' },
  { id: 'exceptions', label: 'Price Exceptions' },
  { id: 'cancel', label: 'Cancellation Policies' },
]
const setupRows = [
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
])

const overview = ref({
  slug: 'tokyo-kyoto-escape-7d6n',
  title: 'Tokyo to Kyoto Escape',
  destinationName: 'Japan',
  partnerName: 'Global Explorer Expeditions',
  heroImageUrl: '',
  durationDays: 7,
  durationNights: 6,
  minPax: 15,
  maxPax: 20,
  description: 'Experience the magic of Japan during the breathtaking Sakura season. This 7-day comprehensive journey takes you through the bustling neon-lit streets of Tokyo, the serene ancient temples of Kyoto, and offers majestic views of Mount Fuji. Immerse yourself in authentic cultural experiences, from traditional tea ceremonies to exhilarating bullet train (Shinkansen) rides. Perfect for first-time visitors wanting a complete Japanese experience.',
  inclusion: 'Experience the magic of Japan during the breathtaking Sakura season. This 7-day comprehensive journey takes you through the bustling neon-lit streets of Tokyo, the serene ancient temples of Kyoto, and offers majestic views of Mount Fuji. Immerse yourself in authentic cultural experiences, from traditional tea ceremonies to exhilarating bullet train (Shinkansen) rides. Perfect for first-time visitors wanting a complete Japanese experience.',
})
const packages = ref([
  { name: 'Kingsgate Hotel Al Jaddaf', startDate: '2026-04-02', endDate: '2026-04-08', inventory: 50, adultPrice: 2500, childPrice: 2000, currency: 'USD', active: true },
  { name: 'Grand Kingston Hotel', startDate: '2026-04-02', endDate: '2026-04-08', inventory: 50, adultPrice: 2700, childPrice: 2200, currency: 'USD', active: true },
])
const pricing = ref([
  { hotel: 'Kingsgate Hotel Al Jaddaf', rows: [{ price: 92, min: 2, max: 3 }, { price: 107, min: 4, max: 5 }] },
  { hotel: 'Grand Kingston Hotel', rows: [{ price: 92, min: 2, max: 3 }, { price: 107, min: 4, max: 5 }] },
])
const addons = ref([{ name: 'Vehicle', price: 92, inventory: 50, min: 2, max: 3 }, { name: 'Tour Guide', price: 107, inventory: 50, min: 4, max: 5 }])
const exceptions = ref([{ name: 'Kingsgate Hotel Al Jaddaf', price: 92, inventory: 50, min: 2, max: 3 }, { name: 'Grand Kingston Hotel', price: 107, inventory: 50, min: 4, max: 5 }])
const days = ref([
  { title: 'Arrival in Tokyo & Welcome Dinner', desc: '' },
  { title: 'Tokyo City Tour & Sakura Viewing', desc: 'Visit the historic Asakusa area and Senso-ji Temple. Enjoy cherry blossom viewing at Ueno Park. Afternoon high-end shopping and exploration in the Ginza district.' },
])
const mediaPrompt = ref('Mount Fuji with cherry blossoms in the foreground, spring season, hyper realistic, 4k')
const generatedAssets = ref(['1', '2', '3'])

function addPackage() { packages.value.push({ name: 'New Hotel Package', startDate: '', endDate: '', inventory: 50, adultPrice: 0, childPrice: 0, currency: 'USD', active: true }) }
function addPricing(index: number) { pricing.value[index].rows.push({ price: 120, min: 6, max: 8 }) }
function addAddon() { addons.value.push({ name: 'Travel Insurance', price: 30, inventory: 50, min: 1, max: 5 }) }
function addException() { exceptions.value.push({ name: 'Grand Kingston Hotel', price: 135, inventory: 25, min: 6, max: 9 }) }
function addDay() { days.value.push({ title: `Day ${days.value.length + 1} Cultural Experience`, desc: 'Generated day description with sightseeing, meals, and local cultural activities.' }) }

function sendMessage() {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ from: 'user', text, time: 'Now' })
  messages.value.push({ from: 'bot', text: 'Got it. I updated the tour draft to match your latest note.', time: 'Now' })
  draft.value = ''
}

function scrollChat() {
  nextTick(() => {
    if (chatScroller.value) chatScroller.value.scrollTop = chatScroller.value.scrollHeight
  })
}

function sanitizePackage(pkg: PackageRequest): PackageRequest {
  return {
    name: pkg.name.trim(),
    startDate: pkg.startDate || null,
    endDate: pkg.endDate || null,
    inventory: Number(pkg.inventory) || 0,
    adultPrice: Number(pkg.adultPrice) || 0,
    childPrice: pkg.childPrice === null || pkg.childPrice === undefined ? null : Number(pkg.childPrice) || 0,
    currency: (pkg.currency || 'USD').trim().toUpperCase().slice(0, 3),
    active: pkg.active ?? true,
  }
}

async function saveDraft() {
  saveError.value = ''

  if (!overview.value.slug.trim() || !overview.value.title.trim()) {
    saveError.value = 'Slug and tour package name are required.'
    activeMain.value = 'overview'
    return
  }

  const validPackages = packages.value.map(sanitizePackage).filter((pkg) => pkg.name && pkg.currency.length === 3)
  saving.value = true

  try {
    const payload = {
      title: overview.value.title.trim(),
      description: overview.value.description,
      destinationName: overview.value.destinationName,
      partnerName: overview.value.partnerName,
      heroImageUrl: overview.value.heroImageUrl,
      durationDays: Number(overview.value.durationDays) || 0,
      durationNights: Number(overview.value.durationNights) || 0,
      minPax: Number(overview.value.minPax) || 0,
      maxPax: Number(overview.value.maxPax) || 0,
    }
    const tour = editingTourId.value
      ? await updateTour(editingTourId.value, payload)
      : await createTour({ slug: overview.value.slug.trim(), ...payload })

    if (validPackages.length) {
      await replaceTourPackages(tour.id, validPackages)
    }

    await router.push(`/tour/${tour.id}`)
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : 'Failed to save tour'
  } finally {
    saving.value = false
  }
}

function applyTour(existing: Tour) {
  overview.value.slug = existing.slug
  overview.value.title = existing.title
  overview.value.description = existing.description || ''
  overview.value.destinationName = existing.destinationName || ''
  overview.value.partnerName = existing.partnerName || ''
  overview.value.heroImageUrl = existing.heroImageUrl || ''
  overview.value.durationDays = existing.durationDays || 0
  overview.value.durationNights = existing.durationNights || 0
  overview.value.minPax = existing.minPax || 0
  overview.value.maxPax = existing.maxPax || 0
  packages.value = (existing.packages || []).map((pkg) => ({
    name: pkg.name,
    startDate: pkg.startDate || '',
    endDate: pkg.endDate || '',
    inventory: pkg.inventory || 0,
    adultPrice: Number(pkg.adultPrice) || 0,
    childPrice: Number(pkg.childPrice) || 0,
    currency: pkg.currency || 'USD',
    active: pkg.active ?? true,
  }))
}

async function loadExistingTour() {
  if (!editingTourId.value) return
  saving.value = true
  saveError.value = ''

  try {
    applyTour(await getTour(editingTourId.value))
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : 'Failed to load tour'
  } finally {
    saving.value = false
  }
}

watch(() => messages.value.length, scrollChat)
onMounted(() => {
  scrollChat()
  void loadExistingTour()
})

</script>
