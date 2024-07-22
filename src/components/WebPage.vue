<template>
    <div class="bg-surface h-100">
        <VRow class="flex-nowrap pa-1 px-2" align="center" no-gutters>
            <VBtn
                v-if="state.isView"
                icon="mdi-arrow-left"
                size="x-small"
                variant="text"
                @click="goBack">
            </VBtn>
            <div class="text-limit mx-2">{{ state.title || '網頁瀏覽器' }}</div>
            <VSpacer></VSpacer>
            <VBtn
                v-if="state.isView"
                icon="mdi-package-variant-closed-remove"
                size="x-small"
                variant="text"
                class="mx-2"
                @click="reset">
            </VBtn>
            <VBtn
                v-if="state.isView"
                icon="mdi-refresh"
                size="x-small"
                variant="text"
                class="mr-2"
                @click="refresh">
            </VBtn>
            <VBtn
                icon="mdi-close"
                size="x-small"
                variant="text"
                @click="close">
            </VBtn>
        </VRow>
        <VDivider></VDivider>
        <div v-if="state.isView">
            <component
                :is="'webview'"
                ref="webview"
                :src="state.url"
                class="w-100"
                style="height: calc(100vh - 113px)">
            </component>
        </div>
        <div v-else>
            <div class="pa-4 pb-0">
                <VTextField
                    v-model="state.url"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    placeholder="填入網頁連結">
                </VTextField>
                <VChipGroup column class="mt-1 mb-1">
                    <VChip
                        v-for="category of state.categories" :key="category.value"
                        @click="openUrl(category.value)">
                        {{ category.title }}
                    </VChip>
                </VChipGroup>
            </div>
            <VDivider></VDivider>
            <div v-if="store.state.pageHistory.length !== 0" class="mt-2">
                <VRow
                    class="px-4 pt-2"
                    no-gutters
                    align="center"
                    style="font-weight: 900;"
                    justify="space-between">
                    <div>歷史資料</div>
                    <VBtn
                        size="small"
                        variant="text"
                        color="grey"
                        @click="store.state.pageHistory.length = 0">
                        清除全部
                    </VBtn>
                </VRow>
                <div class="text-left">
                    <VList>
                        <VListItem
                            v-for="item, index of store.state.pageHistory"
                            :key="item.title"
                            :title="item.title"
                            :subtitle="dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')"
                            @click="openUrl(item.url)">
                            <template #append>
                                <v-btn
                                    size="small"
                                    variant="text"
                                    color="grey"
                                    icon="mdi-delete"
                                    @click.stop="store.removePageHistory(index)">
                                </v-btn>
                            </template>
                        </VListItem>
                    </VList>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useStore } from '@/store'
import { watch, ref, reactive } from 'vue'

const store = useStore()

// =================
//
// props
//

const props = defineProps({
    pageId: {
        type: String,
        required: true
    }
})

// =================
//
// refs
//

const webview = ref<Record<string, any> | null>()

// =================
//
// state
//

const state = reactive({
    url: '',
    title: '',
    isView: false,
    categories: [
        {
            title: 'Google',
            value: 'https://google.com'
        },
        {
            title: 'DCard',
            value: 'https://www.dcard.tw'
        },
        {
            title: 'Tradingview',
            value: 'https://tw.tradingview.com/'
        },
        {
            title: 'Youtube',
            value: 'https://www.youtube.com/'
        },
        {
            title: 'ChatGPT',
            value: 'https://chatgpt.com/'
        },
        {
            title: '股市同學會',
            value: 'https://www.cmoney.tw/forum'
        }
    ]
})

// =================
//
// watch
//

watch(webview, () => {
    if (webview.value) {
        webview.value.addEventListener('did-finish-load', () => {
            const url = webview.value?.getURL() || state.url
            const title = webview.value?.getTitle() || ''
            state.title = title || 'Untitled'
            store.addPageHistory({
                url,
                title: state.title
            })
        })
    }
})

// =================
//
// methods
//

const close = () => {
    store.closeWebPage(props.pageId)
}

const goBack = () => {
    if (webview.value) {
        if (webview.value.canGoBack()) {
            webview.value.goBack()
        } else {
            refresh()
        }
    }
}

const openUrl = (url: string) => {
    state.url = url
    state.isView = true
}

const reset = () => {
    state.url = ''
    state.title = ''
    state.isView = false
}

const refresh = () => {
    if (webview.value) {
        webview.value.reload()
    }
}

</script>

<style scoped>
.web-page {
    width: 100%;
    height: 100%;
    position: relative;
}
.text-limit {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
