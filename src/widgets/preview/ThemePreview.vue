<template>
  <a-card title="Theme Preview" class="theme-preview">
    <div class="preview-container" :class="{ 'dark-mode': theme.mode === 'dark' }">
      <!-- Header Preview -->
      <div class="preview-header" :style="{ backgroundColor: theme.primaryColor }">
        <div class="preview-logo">
          <img v-if="theme.logoUrl" :src="theme.logoUrl" alt="Logo" />
          <span v-else>{{ siteName }}</span>
        </div>
        <div class="preview-nav">
          <span>Dashboard</span>
          <span>Users</span>
          <span>Settings</span>
        </div>
      </div>

      <!-- Content Preview -->
      <div class="preview-content">
        <div class="preview-card">
          <div class="card-title">Sample Card</div>
          <div class="card-content">
            <p>This is a preview of how your theme will look.</p>
            <a-button
              type="primary"
              :style="{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }"
            >
              Primary Button
            </a-button>
          </div>
        </div>
      </div>

      <!-- Login Page Preview -->
      <div class="preview-login">
        <div class="login-box">
          <h2>{{ theme.loginPageText || 'Welcome Back' }}</h2>
          <div class="login-form">
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button
              :style="{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Preview -->
      <div class="preview-footer">
        {{ theme.copyright || '© 2024 DEIEX. All rights reserved.' }}
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeSettings } from '@/services/api/facade'

interface Props {
  theme: Partial<ThemeSettings>
  siteName?: string
}

const props = withDefaults(defineProps<Props>(), {
  siteName: 'DEIEX Admin',
})
</script>

<style scoped>
.theme-preview {
  height: 100%;
}

.preview-container {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f2f5;
  transition: all 0.3s;
}

.preview-container.dark-mode {
  background: #141414;
  color: rgba(255, 255, 255, 0.85);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  color: white;
  transition: background-color 0.3s;
}

.preview-logo {
  font-size: 18px;
  font-weight: 600;
}

.preview-logo img {
  height: 32px;
}

.preview-nav {
  display: flex;
  gap: 24px;
}

.preview-nav span {
  cursor: pointer;
  opacity: 0.9;
}

.preview-nav span:hover {
  opacity: 1;
}

.preview-content {
  padding: 24px;
  min-height: 200px;
}

.preview-card {
  background: white;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.dark-mode .preview-card {
  background: #1f1f1f;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.card-content p {
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.65);
}

.dark-mode .card-content p {
  color: rgba(255, 255, 255, 0.65);
}

.preview-login {
  padding: 24px;
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.dark-mode .preview-login {
  background: rgba(255, 255, 255, 0.02);
}

.login-box {
  background: white;
  padding: 32px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
}

.dark-mode .login-box {
  background: #1f1f1f;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-form input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.dark-mode .login-form input {
  background: #141414;
  border-color: #434343;
  color: rgba(255, 255, 255, 0.85);
}

.login-form button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.login-form button:hover {
  opacity: 0.9;
}

.preview-footer {
  padding: 16px 24px;
  text-align: center;
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid #d9d9d9;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.dark-mode .preview-footer {
  background: rgba(255, 255, 255, 0.02);
  border-top-color: #434343;
  color: rgba(255, 255, 255, 0.45);
}
</style>
