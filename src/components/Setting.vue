<template>
    <div>
        <div class="text-h6">設定</div>
        <VSwitch
            v-model="state.theme"
            false-value="light"
            hide-details
            color="primary"
            true-value="dark"
            label="黑夜模式">
        </VSwitch>
        <VSwitch
            v-model="store.state.hideImage"
            hide-details
            color="primary"
            label="隱藏圖片">
        </VSwitch>
        <v-slider
            v-model="store.state.opacity"
            hide-details
            color="primary"
            label="半透明度"
            :min="0"
            :max="100"
        ></v-slider>
        <VRadioGroup
            v-model="store.state.refreshTime"
            color="primary"
            class="my-4"
            hide-details
            label="刷新速度">
            <VRadio label="180秒" :value="180"></VRadio>
            <VRadio label="60秒" :value="60"></VRadio>
            <VRadio label="30秒" :value="30"></VRadio>
            <VRadio label="5秒" :value="5"></VRadio>
            <VRadio label="1秒" :value="1"></VRadio>
        </VRadioGroup>
        <VRadioGroup
            v-model="store.state.messageSpeed"
            color="primary"
            class="my-4"
            hide-details
            label="訊息滾動速度">
            <VRadio label="0秒" :value="0"></VRadio>
            <VRadio label="0.5秒" :value="0.5"></VRadio>
            <VRadio label="1秒" :value="1"></VRadio>
            <VRadio label="2秒" :value="2"></VRadio>
            <VRadio label="3秒" :value="3"></VRadio>
            <VRadio label="4秒" :value="4"></VRadio>
        </VRadioGroup>
        <div class="text-grey text-center text-body-2">變更訊息滾動速度後需重新載入文章</div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { useTheme } from 'vuetify'
import { useStorage } from '@/storage'
import { watch, reactive } from 'vue'

const theme = useTheme()
const store = useStore()
const storage = useStorage()

// =================
//
// state
//

const state = reactive({
    theme: theme.global.name.value as 'light' | 'dark'
})

// =================
//
// watch
//

watch(() => state.theme, () => {
    storage.set('theme', state.theme)
    theme.global.name.value = state.theme
})

</script>
