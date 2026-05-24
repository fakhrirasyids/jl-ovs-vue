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
        <div v-if="loading" class="px-6 py-10 text-sm text-slate-500">Loading staff...</div>
        <div v-else-if="error" class="px-6 py-10 text-sm text-red-600">{{ error }}</div>
        <div v-else-if="!staffs.length" class="px-6 py-10 text-sm text-slate-500">No staff accounts found.</div>
        <div v-for="staff in staffs" v-else :key="staff.id" class="staff-grid staff-row">
          <div class="staff-name">
            <span>{{ initial(staff.name) }}</span>
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
          <span class="staff-status" :class="staff.status === 'ACTIVE' ? 'staff-active' : 'staff-inactive'">{{ staff.status }}</span>
          <span>{{ staff.lastLoginAt ? new Date(staff.lastLoginAt).toLocaleDateString() : '-' }}</span>
          <div class="row-actions staff-actions">
            <button aria-label="Toggle staff status" @click="toggleStatus(staff)"><img :src="icon('edit')" alt="" /></button>
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
          <select v-model="newStaff.role">
            <option value="ADMIN">ADMIN</option>
            <option value="EDITOR">EDITOR</option>
            <option value="VIEWER">VIEWER</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </label>
        <label>
          <span>Password</span>
          <input v-model="newStaff.password" type="password" placeholder="Admin123!" />
        </label>
        <p v-if="modalError" class="text-sm text-red-600">{{ modalError }}</p>
        <div class="staff-modal-actions">
          <button type="submit" :disabled="saving">{{ saving ? 'Saving...' : 'Add Staff' }}</button>
          <button type="button" @click="showAddModal = false">Cancel</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { createStaff, listStaff, updateStaff } from '../api/admin'
import type { AdminRole, AdminUser } from '../api/types'

const icon = (name: string) => `/assets/icons/ic-${name}.png`
const showAddModal = ref(false)
const staffs = ref<AdminUser[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const modalError = ref('')
const newStaff = reactive({ name: '', email: '', role: 'VIEWER' as AdminRole, password: '' })

function initial(name: string) {
  return name.trim()[0]?.toUpperCase() || '?'
}

function roleClass(role: string) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN' ? 'role-admin' : role === 'EDITOR' ? 'role-editor' : 'role-viewer'
}

async function toggleStatus(staff: AdminUser) {
  const status = staff.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  const previous = staff.status
  staff.status = status

  try {
    const updated = await updateStaff(staff.id, { status })
    Object.assign(staff, updated)
  } catch (err) {
    staff.status = previous
    error.value = err instanceof Error ? err.message : 'Failed to update staff'
  }
}

async function submitStaff() {
  modalError.value = ''
  saving.value = true

  try {
    const created = await createStaff({
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      password: newStaff.password,
      role: newStaff.role,
    })
    staffs.value.push(created)
    newStaff.name = ''
    newStaff.email = ''
    newStaff.password = ''
    newStaff.role = 'VIEWER'
    showAddModal.value = false
  } catch (err) {
    modalError.value = err instanceof Error ? err.message : 'Failed to create staff'
  } finally {
    saving.value = false
  }
}

async function loadStaff() {
  loading.value = true
  error.value = ''

  try {
    staffs.value = await listStaff()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load staff'
  } finally {
    loading.value = false
  }
}

onMounted(loadStaff)
</script>
