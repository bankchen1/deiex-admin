import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

// Ant Design Vue locale imports
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import type { Locale } from 'ant-design-vue/es/locale'

export interface LocaleOption {
  value: string
  label: string
  antdLocale: Locale
  dayjsLocale: string
}

export function useLocale() {
  const { locale, t } = useI18n()
  const appStore = useAppStore()

  const currentLocale = computed(() => locale.value)

  const availableLocales: LocaleOption[] = [
    {
      value: 'en',
      label: 'English',
      antdLocale: enUS,
      dayjsLocale: 'en',
    },
    {
      value: 'zh',
      label: '中文',
      antdLocale: zhCN,
      dayjsLocale: 'zh-cn',
    },
  ]

  const currentLocaleOption = computed(() => {
    return availableLocales.find((l) => l.value === locale.value) || availableLocales[0]
  })

  const antdLocale = computed(() => currentLocaleOption.value.antdLocale)

  function changeLocale(newLocale: string) {
    const localeOption = availableLocales.find((l) => l.value === newLocale)
    if (!localeOption) {
      console.warn(`Locale ${newLocale} not found`)
      return
    }

    // Update vue-i18n locale
    locale.value = newLocale

    // Update app store
    appStore.setLocale(newLocale)

    // Persist to localStorage
    localStorage.setItem('locale', newLocale)

    // Update dayjs locale
    dayjs.locale(localeOption.dayjsLocale)

    console.log(`Locale changed to: ${newLocale}`)
  }

  // Initialize dayjs locale on composable creation
  const initLocale = currentLocaleOption.value
  dayjs.locale(initLocale.dayjsLocale)

  return {
    currentLocale,
    availableLocales,
    currentLocaleOption,
    antdLocale,
    changeLocale,
    t,
  }
}
