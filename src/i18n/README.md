# Internationalization (i18n) Implementation

This directory contains the internationalization setup for the DEIEX Admin application using vue-i18n.

## Structure

```
i18n/
├── index.ts           # i18n configuration and setup
├── locales/
│   ├── en.json       # English translations
│   └── zh.json       # Chinese translations
└── README.md         # This file
```

## Usage

### In Components (Composition API)

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>
    <h1>{{ t('dashboard.title') }}</h1>
    <p>{{ t('common.loading') }}</p>
  </div>
</template>
```

### Using the useLocale Composable

```vue
<script setup lang="ts">
import { useLocale } from '@/composables'

const { currentLocale, availableLocales, changeLocale, t } = useLocale()

function switchLanguage(locale: string) {
  changeLocale(locale)
}
</script>

<template>
  <a-select :value="currentLocale" @change="switchLanguage">
    <a-select-option 
      v-for="locale in availableLocales" 
      :key="locale.value" 
      :value="locale.value"
    >
      {{ locale.label }}
    </a-select-option>
  </a-select>
</template>
```

### Global $t Function

The i18n instance is configured with `globalInjection: true`, so you can also use `$t` in templates:

```vue
<template>
  <div>{{ $t('common.save') }}</div>
</template>
```

## Supported Locales

- **English (en)**: Default locale
- **Chinese (zh)**: Simplified Chinese

## Message Structure

The translation files are organized by module:

- `common`: Common UI elements (buttons, labels, etc.)
- `nav`: Navigation menu items
- `dashboard`: Dashboard module
- `kyc`: KYC module
- `users`: User management module
- `assets`: Asset management module
- `orders`: Order management module
- `config`: Configuration modules
- `risk`: Risk management module
- `ops`: Operations module
- `reports`: Reports module
- `settings`: Settings module
- `validation`: Form validation messages
- `messages`: System messages and notifications

## Adding New Translations

1. Add the key-value pair to both `en.json` and `zh.json`
2. Use the translation key in your component with `t('module.key')`

Example:

```json
// en.json
{
  "myModule": {
    "myKey": "My English Text"
  }
}

// zh.json
{
  "myModule": {
    "myKey": "我的中文文本"
  }
}
```

```vue
<template>
  <div>{{ t('myModule.myKey') }}</div>
</template>
```

## Locale Switching

The locale preference is automatically:
- Persisted to localStorage
- Applied to Ant Design Vue components
- Applied to dayjs date formatting

When the locale changes:
1. Vue i18n updates all `t()` calls
2. Ant Design Vue components update their locale
3. dayjs updates its locale for date formatting
4. The preference is saved to localStorage

## Integration with Ant Design Vue

The App.vue component wraps the application with `ConfigProvider` to apply the Ant Design Vue locale:

```vue
<template>
  <ConfigProvider :locale="antdLocale">
    <router-view />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import { useLocale } from '@/composables'

const { antdLocale } = useLocale()
</script>
```

## Best Practices

1. **Always use translation keys**: Never hardcode user-facing text
2. **Organize by module**: Keep translations organized by feature/module
3. **Use descriptive keys**: Make translation keys self-documenting
4. **Provide context**: Add comments in JSON files for complex translations
5. **Test both locales**: Always verify translations in all supported languages
6. **Keep keys consistent**: Use the same structure across all locale files

## Troubleshooting

### Translation not updating
- Check that the key exists in both locale files
- Verify the key path is correct (e.g., `common.save` not `common/save`)
- Ensure the component is using `useI18n()` or `$t`

### Locale not persisting
- Check browser localStorage for the `locale` key
- Verify the `useLocale` composable is being used correctly
- Check that the app store's `setLocale` method is being called

### Ant Design components not translating
- Verify `ConfigProvider` is wrapping the app in App.vue
- Check that `antdLocale` is being passed correctly
- Ensure the locale files are imported in `useLocale.ts`
