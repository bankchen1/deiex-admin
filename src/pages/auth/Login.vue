<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>DEIEX Admin</h1>
        <p>Sign in to your account</p>
      </div>

      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        class="login-form"
        @finish="handleLogin"
      >
        <a-form-item label="Username" name="username">
          <a-input
            v-model:value="formState.username"
            placeholder="Enter any username"
            size="large"
            :disabled="loading"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="Password" name="password">
          <a-input-password
            v-model:value="formState.password"
            placeholder="Enter any password"
            size="large"
            :disabled="loading"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block :loading="loading">
            Sign In
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-footer">
        <a-alert
          v-if="mockMode"
          message="Mock Mode Active"
          description="You can login with any username and password. All data is mocked."
          type="info"
          show-icon
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const mockMode = computed(() => import.meta.env.VITE_USE_MOCK === 'true')
const loading = ref(false)

const formState = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: 'Please enter username' }],
  password: [{ required: true, message: 'Please enter password' }],
}

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login({
      username: formState.username,
      password: formState.password,
    })

    message.success('Login successful!')

    // Redirect to the page user was trying to access or dashboard
    const redirect = (route.query.redirect as string) || '/admin/dashboard'
    router.push(redirect)
  } catch (error) {
    message.error('Login failed. Please try again.')
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-form {
  margin-bottom: 16px;
}

.login-footer {
  margin-top: 24px;
}
</style>
