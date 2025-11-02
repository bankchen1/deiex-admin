import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

// Get locale from localStorage or default to 'en'
const savedLocale = localStorage.getItem('locale') || 'en'

export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
  globalInjection: true, // Enable global $t
})

export default i18n
