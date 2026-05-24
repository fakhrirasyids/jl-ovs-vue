<template>
  <AdminLayout>
    <div class="tour-detail-page">
      <div v-if="loading" class="px-6 py-10 text-sm text-slate-500">Loading tour...</div>
      <div v-else-if="error" class="px-6 py-10 text-sm text-red-600">{{ error }}</div>
      <template v-else-if="tour">
      <header class="tour-detail-toolbar">
        <button class="tour-detail-back" @click="$router.push('/tour-listing')">
          <span aria-hidden="true">←</span>
          <span>Tour Listing</span>
        </button>

        <div class="tour-detail-actions">
          <button class="detail-action-button">
            <img :src="icon('copy')" alt="" />
            Duplicate
          </button>
          <button class="detail-action-button" @click="showPreview = true">
            <img :src="icon('preview')" alt="" />
            Preview
          </button>
          <button class="detail-action-button" @click="$router.push(`/create-tour?tourId=${tour.id}`)">
            <img :src="icon('edit')" alt="" />
            Edit Listing
          </button>
          <button class="detail-publish-button" :disabled="publishing" @click="publishCurrentTour">
            <img :src="icon('publish')" alt="" />
            {{ publishing ? 'Publishing...' : 'Publish Listing' }}
          </button>
          <button class="detail-more-button" aria-label="More actions">...</button>
        </div>
      </header>

      <div class="tour-detail-shell">
        <main class="tour-detail-main">
          <section class="tour-detail-hero">
            <div class="tour-detail-hero-shade"></div>
            <div class="tour-detail-hero-content">
              <div class="tour-detail-hero-copy">
                <span class="tour-status-pill">{{ tour.status === 'PUBLISHED' ? 'Live' : statusLabel(tour.status) }}</span>
                <h1>{{ tour.title }}</h1>
                <div class="tour-detail-meta">
                  <span>{{ tour.destinationName || 'No destination set' }}</span>
                  <span>ID: {{ tour.slug }}</span>
                </div>
              </div>

              <div class="tour-detail-thumbs">
                <span v-for="item in 5" :key="item" class="detail-image-placeholder tour-thumb"></span>
                <button class="tour-more-photos">
                  <img :src="icon('media')" alt="" />
                  +5
                </button>
              </div>
            </div>
          </section>

          <section class="tour-detail-stats">
            <div class="tour-rating">
              <span aria-hidden="true">★★★★★</span>
              <b>5.0</b>
            </div>
            <div class="tour-stat-item">
              <img :src="icon('duration')" alt="" />
              {{ durationLabel }}
            </div>
            <div class="tour-stat-item">
              <img :src="icon('group-size')" alt="" />
              {{ paxLabel }}
            </div>
            <div class="tour-stat-item tour-price-stat">
              <img :src="icon('retail-price')" alt="" />
              {{ priceLabel }} <span>/pax</span>
            </div>
            <div class="tour-stat-item">
              <span class="detail-calendar-icon"></span>
              {{ tour.status }}
            </div>
          </section>

          <nav class="tour-detail-tabs" aria-label="Tour detail sections">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tour-detail-tab"
              :class="{ 'tour-detail-tab-active': active === tab.id }"
              @click="active = tab.id"
            >
              <img :src="icon(tab.icon)" alt="" />
              {{ tab.label }}
            </button>
          </nav>

          <section class="tour-detail-content">
            <div v-if="active === 'overview'" class="overview-panel">
              <article class="detail-card detail-card-wide">
                <h2><img :src="icon('tour-desc')" alt="" />Tour Description</h2>
                <p class="detail-copy">
                  {{ tour.description || 'No description has been added yet.' }}
                </p>
              </article>

              <article class="detail-card detail-card-wide">
                <h2><img :src="icon('key-highlights')" alt="" />Key Highlights</h2>
                <div class="highlight-list">
                  <p v-for="(item, index) in highlights" :key="item">
                    <span>{{ index + 1 }}</span>
                    {{ item }}
                  </p>
                </div>
              </article>

              <div class="included-grid">
                <article class="detail-card">
                  <h2><img :src="icon('check')" alt="" />What's Included</h2>
                  <p v-for="item in included" :key="item" class="mini-line positive"><span></span>{{ item }}</p>
                </article>
                <article class="detail-card">
                  <h2><img :src="icon('warn')" alt="" />Not Included</h2>
                  <p v-for="item in excluded" :key="item" class="mini-line negative"><span></span>{{ item }}</p>
                </article>
              </div>

              <article class="operator-card">
                <div class="operator-avatar">G</div>
                <div>
                  <b>{{ tour.partnerName || 'No partner set' }}</b>
                  <p>Official Tour Operator · Verified Partner</p>
                </div>
                <span>Verified</span>
              </article>
            </div>

            <div v-else-if="active === 'itinerary'">
              <div class="itinerary-header">
                <div>
                  <h2>Day-by-Day Schedule</h2>
                  <p>7 Days · 6 Nights · Japan</p>
                </div>
                <button class="detail-edit-button"><img :src="icon('edit')" alt="" />Edit Itinerary</button>
              </div>

              <div class="itinerary-timeline">
                <article v-for="(day, index) in days" :key="day.title" class="itinerary-row">
                  <div class="day-badge"><span>DAY</span>{{ index + 1 }}</div>
                  <div class="itinerary-card">
                    <h3>{{ day.title }}</h3>
                    <p>{{ day.description }}</p>
                    <span class="detail-image-placeholder itinerary-image"></span>
                  </div>
                </article>
              </div>
            </div>

            <article v-else-if="active === 'pricing'" class="pricing-card">
                <h2>{{ firstPackage?.name || 'Package Pricing' }}</h2>
              <div class="pricing-grid pricing-head">
                <span>Package</span>
                <span>Price</span>
                <span>Inventory</span>
                <span>Min buy</span>
                <span>Max buy</span>
              </div>
              <div v-for="row in tour.packages || []" :key="row.id" class="pricing-grid pricing-row">
                <input class="detail-input" :value="row.name" readonly />
                <input class="detail-input" :value="`${row.currency} ${row.adultPrice}`" readonly />
                <input class="detail-input" :value="row.inventory ?? '-'" readonly />
                <input class="detail-input" :value="tour.minPax ?? '-'" readonly />
                <input class="detail-input" :value="tour.maxPax ?? '-'" readonly />
              </div>
              <p v-if="!tour.packages?.length" class="py-6 text-sm text-slate-500">No packages have been saved for this tour.</p>
            </article>

            <div v-else-if="active === 'media'" class="media-panel">
              <div class="media-heading">
                <h2>Media Assets</h2>
                <button class="detail-action-button"><img :src="icon('media')" alt="" />Upload More</button>
              </div>
              <div class="detail-image-placeholder media-hero"><span>Main Photo</span></div>
              <div class="media-grid">
                <div v-for="item in 4" :key="item" class="detail-image-placeholder media-thumb"><span>Photo {{ item + 1 }}</span></div>
                <button class="media-add-card"><img :src="icon('media')" alt="" />Add Photo</button>
              </div>
            </div>

            <div v-else class="analytics-panel">
              <article class="analytics-alert">
                <img :src="icon('analytics')" alt="" />
                <div>
                  <h2>Analytics will be available after publishing.</h2>
                  <p>Once this listing goes live, you'll see views, clicks, booking conversion rates, and revenue metrics here.</p>
                </div>
                <button class="btn-primary" @click="publishCurrentTour">Publish Now</button>
              </article>

              <div class="analytics-grid">
                <article><img :src="icon('preview')" alt="" /><b>—</b><p>Total Views</p></article>
                <article><img :src="icon('pricing')" alt="" /><b>—</b><p>Booking Inquiries</p></article>
                <article><img :src="icon('analytics')" alt="" /><b>—</b><p>Conversion Rate</p></article>
              </div>
            </div>
          </section>
        </main>

        <aside class="tour-detail-sidebar">
          <div class="draft-card" :class="{ 'draft-card-live': tour.status === 'PUBLISHED' }">
            <div class="draft-title">
              <img :src="icon(tour.status === 'PUBLISHED' ? 'check' : 'warn')" alt="" />
              <b>{{ tour.status === 'PUBLISHED' ? 'Published' : `${statusLabel(tour.status)} — Not Published` }}</b>
            </div>
            <p>This listing is saved as a draft. Publish it to make it visible to customers.</p>
            <button class="detail-publish-button w-full" :disabled="publishing" @click="publishCurrentTour">
              <img :src="icon('publish')" alt="" />
              {{ publishing ? 'Publishing...' : 'Publish Listing' }}
            </button>
          </div>

          <section class="side-section">
            <h2>Quick Details</h2>
            <div class="quick-details-list">
              <article v-for="detail in quickDetails" :key="detail.title" class="quick-detail-card">
                <span><img :src="icon(detail.icon)" alt="" /></span>
                <div>
                  <p>{{ detail.title }}</p>
                  <b>{{ detail.value }}</b>
                </div>
              </article>
            </div>
          </section>

          <section class="side-section">
            <h2>Listing Info</h2>
            <div class="listing-info-card">
              <p><span>Tour ID</span><b>{{ tour.slug }}</b></p>
              <p><span>Brand</span><b>{{ tour.partnerName || '-' }}</b></p>
              <p><span>Category</span><b>International</b></p>
              <p><span>AI Generated</span><b class="text-bluebrand">Yes</b></p>
              <p><span>Created</span><b>Apr 7, 2026</b></p>
            </div>
          </section>

          <section class="side-section">
            <h2>Listing Checklist</h2>
            <div class="checklist">
              <p v-for="item in checklistDone" :key="item">
                <img :src="icon('check')" alt="" />
                <span>{{ item }}</span>
              </p>
              <p v-for="item in checklistTodo" :key="item" class="checklist-muted">
                <span class="empty-check"></span>
                <span>{{ item }}</span>
              </p>
            </div>
            <div class="completion-row">
              <span>Completeness</span>
              <b>75%</b>
            </div>
            <div class="completion-bar"><span></span></div>
          </section>

          <button class="delete-listing-button" @click="deleted = true">Delete Listing</button>
        </aside>
      </div>
      </template>
    </div>

    <div v-if="showPreview" class="detail-modal" @click.self="showPreview = false">
      <div class="detail-modal-card">
        <h3>Customer Preview</h3>
        <p>This dummy preview keeps the listing detail layout intact while showing the preview action state.</p>
        <button class="btn-primary mt-5" @click="showPreview = false">Close Preview</button>
      </div>
    </div>

    <div v-if="deleted" class="detail-toast">Listing deleted in dummy UI.</div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import { getTour, publishTour } from '../api/admin'
import type { Tour, TourStatus } from '../api/types'

type TabId = 'overview' | 'itinerary' | 'pricing' | 'media' | 'analytics'

const active = ref<TabId>('overview')
const showPreview = ref(false)
const deleted = ref(false)
const route = useRoute()
const tour = ref<Tour | null>(null)
const loading = ref(false)
const publishing = ref(false)
const error = ref('')
const icon = (name: string) => `/assets/icons/ic-${name}.png`

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'preview' },
  { id: 'itinerary', label: 'Itinerary', icon: 'itinerary' },
  { id: 'pricing', label: 'Pricing & Offers', icon: 'pricing' },
  { id: 'media', label: 'Media', icon: 'media' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
]

const firstPackage = computed(() => tour.value?.packages?.[0])
const durationLabel = computed(() => {
  const daysCount = tour.value?.durationDays ?? 0
  const nightsCount = tour.value?.durationNights ?? 0
  if (!daysCount && !nightsCount) return '-'
  return `${daysCount} Days ${nightsCount} Nights`
})
const paxLabel = computed(() => {
  const min = tour.value?.minPax ?? 0
  const max = tour.value?.maxPax ?? 0
  if (!min && !max) return '-'
  return `${min}-${max} Pax`
})
const priceLabel = computed(() => {
  if (!firstPackage.value) return '-'
  return `${firstPackage.value.currency} ${Number(firstPackage.value.adultPrice).toLocaleString()}`
})
const quickDetails = computed(() => [
  { icon: 'retail-price', title: 'Retail Price', value: priceLabel.value },
  { icon: 'duration', title: 'Duration', value: durationLabel.value },
  { icon: 'group-size', title: 'Group Size', value: paxLabel.value },
  { icon: 'destination', title: 'Destination', value: tour.value?.destinationName || '-' },
])

function statusLabel(status: TourStatus) {
  return status === 'PUBLISHED' ? 'Live' : status[0] + status.slice(1).toLowerCase()
}

async function loadTour() {
  const tourId = String(route.params.id || '')
  loading.value = true
  error.value = ''

  try {
    tour.value = await getTour(tourId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load tour'
  } finally {
    loading.value = false
  }
}

async function publishCurrentTour() {
  if (!tour.value) return
  publishing.value = true
  error.value = ''

  try {
    tour.value = await publishTour(tour.value.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to publish tour'
  } finally {
    publishing.value = false
  }
}

const checklistDone = [
  'Tour Name & Description',
  'Day-by-Day Itinerary',
  'Pricing & Offers',
  'Hero Image',
  'Gallery Photos (5+)',
  'Inclusions & Exclusions',
]
const checklistTodo = ['Departure Dates Set', 'Booking Form Linked']

const highlights = [
  "Witness stunning cherry blossoms in Tokyo's Ueno Park and Shinjuku Gyoen.",
  'Explore the historic temples and vermilion shrines of Kyoto (Kinkaku-ji, Fushimi Inari).',
  'Experience the high-speed Shinkansen (Bullet Train) cross-country.',
  'Authentic Japanese culinary experiences including sushi, ramen, and Kaiseki.',
  'Guided tour of the iconic Mount Fuji area and Hakone Lake Ashi cruise.',
]

const included = [
  'Round-trip international airfare (Economy Class)',
  '6 nights accommodation in 4-star hotels (twin-sharing)',
  'Daily breakfast + 3 special dinners (Welcome, Kaiseki farewell & Mt.Fuji)',
  'All ground transport including Shinkansen tickets',
  'English-speaking licensed tour guide throughout',
  'All entrance fees as per itinerary',
  'Japan travel insurance',
]

const excluded = [
  'Personal expenses & souvenirs',
  'Optional tours not mentioned in itinerary',
  'Visa fees (if applicable)',
  'Single room supplement (+USD 450)',
]

const days = [
  { title: 'Arrival in Tokyo & Welcome Dinner', description: 'Arrive at Narita or Haneda Airport. Meet your English-speaking guide and transfer to your centrally located hotel in Tokyo. Evening welcome dinner in the vibrant Shinjuku district.' },
  { title: 'Tokyo City Tour & Sakura Viewing', description: 'Visit the historic Asakusa area and Senso-ji Temple. Enjoy cherry blossom viewing at Ueno Park. Afternoon high-end shopping and exploration in the Ginza district.' },
  { title: 'Mount Fuji & Hakone Excursion', description: 'Full day trip to Mount Fuji 5th Station (weather permitting) and a scenic pirate ship cruise on Lake Ashi in Hakone. Ride the Komagatake Ropeway for panoramic views.' },
  { title: 'Bullet Train to Kyoto & Fushimi Inari', description: 'Experience the world-famous Shinkansen (Bullet Train) ride to Kyoto. Afternoon visit to the iconic Fushimi Inari Shrine, famous for its thousands of vermilion torii gates.' },
  { title: 'Kyoto Cultural Heritage', description: 'Explore Kinkaku-ji (The Golden Pavilion), stroll through the Arashiyama Bamboo Grove, and experience an authentic traditional Japanese tea ceremony.' },
]

onMounted(loadTour)
</script>
