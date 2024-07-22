<template>
    <div>
        <div class="text-h6 mb-1">設定</div>
        <VTabs
            v-model="state.tab"
            grow
            color="primary"
            class="mb-1">
            <VTab value="general">設定</VTab>
            <VTab value="blacklist">名單</VTab>
        </VTabs>
        <div v-if="state.tab === 'general'">
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
                <VRadio label="即時更新" :value="1"></VRadio>
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
        </div>
        <div v-if="state.tab === 'blacklist'">
            <div>關鍵字</div>
            <div class="text-grey text-body-2">關鍵字的留言更顯眼</div>
            <div>
                <v-combobox
                    v-model="store.state.keywords"
                    class="my-4"
                    chips
                    clearable
                    placeholder="輸入關鍵字 並按下 Enter"
                    multiple
                    hide-details
                    variant="outlined">
                </v-combobox>
            </div>
            <div>白名單</div>
            <div class="text-grey text-body-2">白名單的留言更顯眼</div>
            <div>
                <v-combobox
                    v-model="store.state.writelist"
                    class="my-4"
                    chips
                    clearable
                    placeholder="輸入使用者 ID 並按下 Enter"
                    multiple
                    hide-details
                    variant="outlined">
                </v-combobox>
            </div>
            <div>黑名單</div>
            <div class="text-grey text-body-2">黑名單的留言會直接隱藏</div>
            <div>
                <v-combobox
                    v-model="store.state.blacklist"
                    class="my-4"
                    chips
                    clearable
                    placeholder="輸入使用者 ID 並按下 Enter"
                    multiple
                    hide-details
                    variant="outlined">
                </v-combobox>
            </div>
        </div>
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
    tab: 'general' as 'general' | 'blacklist',
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
