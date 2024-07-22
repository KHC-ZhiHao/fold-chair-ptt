import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import 'animate.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { useStorage } from './storage'

const app = createApp(App)
const storage = useStorage()
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        }
    },
    theme: {
        defaultTheme: storage.get('theme'),
        variations: {
            colors: ['primary', 'secondary', 'metalsheep'],
            lighten: 9,
            darken: 9
        },
        themes: {
            light: {
                colors: {
                    background: 'transparent',
                    metalsheep: '#EE8269'
                }
            }
        }
    }
})

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
