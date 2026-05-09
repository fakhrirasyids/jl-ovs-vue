<template>
  <AdminLayout>
    <section class="content-wrap management-page">
      <div class="management-header">
        <div>
          <h1 class="page-title">Purchase Orders</h1>
          <p class="page-subtitle">Manage all tour bookings and orders</p>
        </div>
        <button class="btn-primary management-primary" @click="$router.push('/create-tour')">
          <span>＋</span>
          New Tour
        </button>
      </div>

      <div class="purchase-metrics">
        <article v-for="metric in metrics" :key="metric.title" class="metric-card">
          <div>
            <p>{{ metric.title }}</p>
            <b>{{ metric.value }}</b>
            <span v-if="metric.subtitle">{{ metric.subtitle }}</span>
          </div>
          <span class="metric-icon" :class="`metric-${metric.tone}`">
            <img :src="icon(metric.icon)" alt="" />
          </span>
        </article>
      </div>

      <div class="order-tools">
        <label class="management-search">
          <span></span>
          <input v-model="search" placeholder="Search orders..." />
        </label>
        <button class="tool-button" @click="filter = !filter"><span class="filter-lines"></span>Filter</button>
        <button class="tool-button" @click="exportCsv"><span class="download-mark"></span>Export</button>
      </div>

      <div v-if="filter" class="filter-strip">
        <button>Paid</button>
        <button>Pending</button>
        <button>Cancelled</button>
      </div>

      <div class="management-table-card purchase-table-card">
        <div class="purchase-grid purchase-head">
          <input type="checkbox" aria-label="Select all orders" />
          <span>Order</span>
          <span>Customer</span>
          <span>Tour</span>
          <span>Status</span>
          <span>Payment<br />Method</span>
          <span>Total</span>
          <span>Tour Date</span>
          <span>Actions</span>
        </div>

        <div v-for="(order, index) in visibleOrders" :key="`${order.id}-${index}`" class="purchase-grid purchase-row">
          <input type="checkbox" :aria-label="`Select order ${order.id}`" />
          <div>
            <b>{{ order.id }}</b>
            <p>{{ order.date }}</p>
          </div>
          <div>
            <b>{{ order.customer }}</b>
            <p>{{ order.email }}</p>
          </div>
          <div>
            <b>{{ order.tour }}</b>
            <p>{{ order.place }}</p>
          </div>
          <span class="status-pill" :class="statusClass(order.status)">{{ order.status }}</span>
          <span>{{ order.method }}</span>
          <b>{{ order.total }}</b>
          <span>{{ order.tourDate }}</span>
          <div class="row-actions">
            <button aria-label="Edit order" @click="order.status = 'Paid'"><img :src="icon('edit')" alt="" /></button>
            <button aria-label="Delete order" @click="orders.splice(index, 1)"><img :src="icon('delete')" alt="" /></button>
          </div>
        </div>

        <div class="table-footer">
          <span>Showing {{ visibleOrders.length }} of {{ orders.length }} orders</span>
          <div>
            <button>Previous</button>
            <button class="active-page">1</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'

type Order = {
  id: string
  date: string
  customer: string
  email: string
  tour: string
  place: string
  status: string
  method: string
  total: string
  tourDate: string
}

const icon = (name: string) => `/assets/icons/ic-${name}.png`
const search = ref('')
const filter = ref(false)
const metrics = [
  { title: 'Total Orders', value: '6', icon: 'total-oder', tone: 'blue' },
  { title: 'Total Revenue', value: 'Rp 173.0M', icon: 'total-revenue', tone: 'green' },
  { title: 'Average Order Value', value: 'Rp 28.8M', icon: 'average-order', tone: 'purple' },
  { title: 'Paid Orders', value: '2', subtitle: '1 pending', icon: 'paid-order', tone: 'amber' },
]
const orders = ref<Order[]>([
  { id: '#TO183', date: 'Sep 20, 2026', customer: 'John Doe', email: 'john@email.com', tour: '4D 3N Dubai Trip', place: 'Dubai, UAE', status: 'Paid', method: 'QRIS', total: 'Rp 25.000.000', tourDate: '7-10 October 2026' },
  { id: '#TO182', date: 'Oct 1, 2026', customer: 'Jane Smith', email: 'jane@email.com', tour: '5D 4N Tokyo Adventure', place: 'Tokyo, Japan', status: 'Paid', method: 'Bank Transfer', total: 'Rp 32.000.000', tourDate: '15-19 November 2026' },
  { id: '#TO181', date: 'Sep 15, 2026', customer: 'Robert Johnson', email: 'robert@email.com', tour: '7D 6N Paris & Rome', place: 'Paris, France', status: 'Cancelled', method: 'QRIS', total: 'Rp 45.000.000', tourDate: '20-26 October 2026' },
  { id: '#TO180', date: 'Aug 5, 2026', customer: 'Sarah Williams', email: 'sarah@email.com', tour: '3D 2N Singapore City', place: 'Singapore', status: 'Pending', method: 'Virtual Account', total: 'Rp 15.000.000', tourDate: '1-3 September 2026' },
  { id: '#TO180', date: 'Aug 5, 2026', customer: 'Sarah Williams', email: 'sarah@email.com', tour: '3D 2N Singapore City', place: 'Singapore', status: 'Pending', method: 'Virtual Account', total: 'Rp 15.000.000', tourDate: '1-3 September 2026' },
  { id: '#TO180', date: 'Aug 5, 2026', customer: 'Sarah Williams', email: 'sarah@email.com', tour: '3D 2N Singapore City', place: 'Singapore', status: 'Pending', method: 'Virtual Account', total: 'Rp 15.000.000', tourDate: '1-3 September 2026' },
])

const visibleOrders = computed(() => orders.value.filter(order => JSON.stringify(order).toLowerCase().includes(search.value.toLowerCase())))

function statusClass(status: string) {
  return status === 'Paid' ? 'status-paid' : status === 'Cancelled' ? 'status-cancelled' : 'status-pending'
}

function exportCsv() {
  const blob = new Blob([orders.value.map(order => Object.values(order).join(',')).join('\n')], { type: 'text/csv' })
  const anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(blob)
  anchor.download = 'orders.csv'
  anchor.click()
}

</script>
