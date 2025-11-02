<!--
  RBACGuard Component Demo Page
  
  This page demonstrates the usage of the RBACGuard component
  with various permission scenarios.
-->

<template>
  <div class="rbac-guard-demo">
    <a-card title="RBACGuard Component Demo" style="margin: 24px">
      <a-space direction="vertical" :size="24" style="width: 100%">
        <!-- Example 1: Single Permission -->
        <a-card type="inner" title="Example 1: Single Permission Check">
          <p>Only users with 'kyc.review' permission can see the button below:</p>
          <RBACGuard permissions="kyc.review">
            <a-button type="primary">Review KYC</a-button>
          </RBACGuard>
        </a-card>

        <!-- Example 2: Multiple Permissions with 'any' mode -->
        <a-card type="inner" title="Example 2: Multiple Permissions (any mode)">
          <p>Users with either 'kyc.review' OR 'kyc.approve' permission can see the button:</p>
          <RBACGuard :permissions="['kyc.review', 'kyc.approve']" mode="any">
            <a-button type="primary">KYC Actions</a-button>
          </RBACGuard>
        </a-card>

        <!-- Example 3: Multiple Permissions with 'all' mode -->
        <a-card type="inner" title="Example 3: Multiple Permissions (all mode)">
          <p>Users must have BOTH 'kyc.review' AND 'kyc.approve' permissions:</p>
          <RBACGuard :permissions="['kyc.review', 'kyc.approve']" mode="all">
            <a-button type="primary">Approve KYC</a-button>
          </RBACGuard>
        </a-card>

        <!-- Example 4: With Fallback Content -->
        <a-card type="inner" title="Example 4: With Fallback Content">
          <p>Shows different content based on permission:</p>
          <RBACGuard permissions="admin.settings">
            <a-button type="primary">Edit Settings</a-button>
            <template #fallback>
              <a-button disabled>Edit Settings (No Permission)</a-button>
            </template>
          </RBACGuard>
        </a-card>

        <!-- Example 5: With Tooltip Fallback -->
        <a-card type="inner" title="Example 5: With Tooltip Fallback">
          <p>Shows a tooltip when user lacks permission:</p>
          <RBACGuard permissions="user.delete">
            <a-button danger>Delete User</a-button>
            <template #fallback>
              <a-tooltip title="You don't have permission to delete users">
                <a-button disabled danger>Delete User</a-button>
              </a-tooltip>
            </template>
          </RBACGuard>
        </a-card>

        <!-- Example 6: Nested Content -->
        <a-card type="inner" title="Example 6: Nested Content">
          <p>Guard can wrap complex content:</p>
          <RBACGuard
            :permissions="['config.instruments.view', 'config.instruments.edit']"
            mode="any"
          >
            <a-space>
              <a-button type="primary">View Instruments</a-button>
              <a-button>Edit Instruments</a-button>
              <a-button danger>Delete Instruments</a-button>
            </a-space>
          </RBACGuard>
        </a-card>

        <!-- Current User Permissions -->
        <a-card type="inner" title="Current User Permissions">
          <p><strong>Your Permissions:</strong></p>
          <a-tag v-for="permission in userPermissions" :key="permission" color="blue">
            {{ permission }}
          </a-tag>
          <a-empty v-if="userPermissions.length === 0" description="No permissions loaded" />
        </a-card>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import RBACGuard from '@/shared/RBACGuard.vue'

const authStore = useAuthStore()

const userPermissions = computed(() => authStore.userPermissions)
</script>

<style scoped>
.rbac-guard-demo {
  min-height: 100vh;
  background-color: #f0f2f5;
}
</style>
