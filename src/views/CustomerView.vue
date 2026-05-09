<template>
  <AdminLayout>
    <section class="content-wrap">
      <div class="mb-5 flex items-center justify-between gap-4"><div><h1 class="page-title">Customer Management</h1><p class="page-subtitle">Manage all your customer information</p></div><button class="btn-primary" @click="addCustomer">＋ Add Customer</button></div>
      <div class="responsive-stats mb-4 grid grid-cols-3 gap-4"><div class="card h-20 p-4"><p class="text-sm text-slate-500">Total Customers</p><b class="text-2xl">{{ customers.length }}</b></div><div class="card h-20 p-4"><p class="text-sm text-slate-500">Completed Orders</p><b class="text-2xl text-emerald-700">63</b></div><div class="card h-20 p-4"><p class="text-sm text-slate-500">Cancelled Orders</p><b class="text-2xl text-red-600">7</b></div></div>
      <div class="mb-3 flex gap-3"><div class="input flex h-10 flex-1 items-center gap-3 text-slate-400">⌕<input v-model="search" class="flex-1 border-0 bg-transparent outline-none" placeholder="Search customer..." /></div><button class="btn-outline" @click="filtered = !filtered">☰ Filter</button><button class="btn-outline" @click="exportCsv">⇩ Export</button></div>
      <div class="card overflow-hidden">
        <div class="grid min-w-[1098px] table-grid-customers items-center bg-white px-5 py-3 text-sm font-bold text-slate-700"><span></span><span>ID Number</span><span>Name</span><span>Email</span><span>Phone Number</span><span>Joined Date</span><span>Total Orders</span><span>Actions</span></div>
        <div v-for="(customer, i) in visibleCustomers" :key="i" class="grid min-w-[1098px] table-grid-customers items-center border-t border-slate-100 px-5 py-3 text-sm text-slate-700">
          <span class="grid h-10 w-10 place-content-center overflow-hidden rounded-full bg-blue-50"><img class="h-10 w-10" src="/assets/icons/ic-dummy-cust.png" alt="" /></span><span>{{ customer.id }}</span><b>{{ customer.name }}</b><span>{{ customer.email }}</span><span>{{ customer.phone }}</span><span>{{ customer.date }}</span><b>{{ customer.orders }}</b><div class="row-actions"><button aria-label="Edit customer" @click="customer.orders++"><img src="/assets/icons/ic-edit.png" alt="" /></button><button aria-label="Delete customer" @click="customers.splice(i,1)"><img src="/assets/icons/ic-delete.png" alt="" /></button></div>
        </div>
      </div>
    </section>
  </AdminLayout>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
const search = ref('')
const filtered = ref(false)
type Customer = { id:string; name:string; email:string; phone:string; date:string; orders:number; photo?: string }
const customers = ref<Customer[]>([
  { id:'CST001', name:'Budi Santoso', email:'budi.santoso@email.com', phone:'+62 812345239', date:'2024-01-15', orders:12, photo:'👨🏽' },
  { id:'CST002', name:'Siti Nurhaliza', email:'siti.nur@email.com', phone:'+62 812345239', date:'2024-02-20', orders:8 },
  { id:'CST003', name:'Ahmad Wijaya', email:'ahmad.w@email.com', phone:'+62 812345239', date:'2024-03-10', orders:5 },
  { id:'CST003', name:'Budi Santoso', email:'budi.santoso@ema', phone:'+62 812345240', date:'2024-03-15', orders:5 },
  { id:'CST003', name:'Ahmad Wijaya', email:'ahmad.w@email.com', phone:'+62 812345239', date:'2024-03-10', orders:5 },
  { id:'CST004', name:'Ayu Lestari', email:'ayu.lestari@email.c', phone:'+62 812345241', date:'2024-04-10', orders:10 },
  { id:'CST003', name:'Ahmad Wijaya', email:'ahmad.w@email.com', phone:'+62 812345239', date:'2024-03-10', orders:5 },
  { id:'CST004', name:'Dewi Lestari', email:'dewi.lestari@email.com', phone:'+62 812345239', date:'2024-04-05', orders:15 },
  { id:'CST003', name:'Ahmad Wijaya', email:'ahmad.w@email.com', phone:'+62 812345239', date:'2024-03-10', orders:5 },
  { id:'CST004', name:'Dewi Lestari', email:'dewi.lestari@email.com', phone:'+62 812345239', date:'2024-04-05', orders:15 },
  { id:'CST004', name:'Dewi Lestari', email:'dewi.lestari@email.com', phone:'+62 812345239', date:'2024-04-05', orders:15 },
])
const visibleCustomers = computed(() => customers.value.filter(c => JSON.stringify(c).toLowerCase().includes(search.value.toLowerCase())).filter(c => !filtered.value || c.orders >= 10))
function addCustomer() { customers.value.unshift({ id:`CST${String(customers.value.length+1).padStart(3,'0')}`, name:'New Customer', email:'new.customer@email.com', phone:'+62 812345222', date:'2024-05-01', orders:0 }) }
function exportCsv() { const blob = new Blob([customers.value.map(c => Object.values(c).join(',')).join('\n')], {type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='customers.csv'; a.click() }
</script>
