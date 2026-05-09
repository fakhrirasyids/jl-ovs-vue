<template>
  <AdminLayout>
    <section class="content-wrap management-page">
      <div class="management-header staff-header">
        <div>
          <h1 class="staff-title">Staff Management</h1>
          <p class="staff-subtitle">Manage admin staff members and their permissions</p>
        </div>
        <button class="staff-add-button" @click="showAddModal = true">
          <span>＋</span>
          Add Staff
        </button>
      </div>

      <div class="staff-table-card">
        <div class="staff-grid staff-head">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Join Date</span>
          <span>Actions</span>
        </div>
        <div v-for="(staff, index) in staffs" :key="staff.email" class="staff-grid staff-row">
          <div class="staff-name">
            <span>{{ staff.initial }}</span>
            <b>{{ staff.name }}</b>
          </div>
          <div class="staff-email">
            <img src="/assets/ic-email.png" alt="" />
            {{ staff.email }}
          </div>
          <div class="staff-role">
            <img src="/assets/ic-role.png" alt="" />
            <span :class="roleClass(staff.role)">{{ staff.role }}</span>
          </div>
          <span class="staff-status" :class="staff.status === 'active' ? 'staff-active' : 'staff-inactive'">{{ staff.status }}</span>
          <span>{{ staff.date }}</span>
          <div class="row-actions staff-actions">
            <button aria-label="Toggle staff status" @click="toggleStatus(staff)"><img :src="icon('edit')" alt="" /></button>
            <button aria-label="Delete staff" @click="staffs.splice(index, 1)"><img :src="icon('delete')" alt="" /></button>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showAddModal" class="staff-modal" @click.self="showAddModal = false">
      <form class="staff-modal-card" @submit.prevent="submitStaff">
        <h2>Add New Staff Member</h2>
        <label>
          <span>Name</span>
          <input v-model="newStaff.name" placeholder="John Doe" />
        </label>
        <label>
          <span>Email</span>
          <input v-model="newStaff.email" placeholder="john@tourapp.com" />
        </label>
        <label>
          <span>Role</span>
          <input v-model="newStaff.role" />
        </label>
        <label>
          <span>Status</span>
          <input v-model="newStaff.status" />
        </label>
        <div class="staff-modal-actions">
          <button type="submit">Add Staff</button>
          <button type="button" @click="showAddModal = false">Cancel</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'

type Staff = { initial: string; name: string; email: string; role: string; status: string; date: string }

const icon = (name: string) => `/assets/icons/ic-${name}.png`
const showAddModal = ref(false)
const staffs = ref<Staff[]>([
  { initial: 'A', name: 'Admin User', email: 'admin@tourapp.com', role: 'admin', status: 'active', date: '15/1/2024' },
  { initial: 'J', name: 'John Doe', email: 'john@tourapp.com', role: 'editor', status: 'active', date: '20/2/2024' },
  { initial: 'J', name: 'Jane Smith', email: 'jane@tourapp.com', role: 'viewer', status: 'inactive', date: '10/3/2024' },
])
const newStaff = reactive({ name: '', email: '', role: '', status: '' })

function roleClass(role: string) {
  return role === 'admin' ? 'role-admin' : role === 'editor' ? 'role-editor' : 'role-viewer'
}

function toggleStatus(staff: Staff) {
  staff.status = staff.status === 'active' ? 'inactive' : 'active'
}

function submitStaff() {
  const name = newStaff.name.trim() || 'John Doe'
  staffs.value.push({
    initial: name[0]?.toUpperCase() || 'J',
    name,
    email: newStaff.email.trim() || 'john@tourapp.com',
    role: newStaff.role.trim() || 'viewer',
    status: newStaff.status.trim() || 'active',
    date: '1/5/2024',
  })
  newStaff.name = ''
  newStaff.email = ''
  newStaff.role = ''
  newStaff.status = ''
  showAddModal.value = false
}
</script>
