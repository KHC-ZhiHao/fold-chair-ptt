<template>
    <div>
        <Teleport to="#header-title">
            <VRow no-gutters class="flex-nowrap" align="center">
                <VBtn
                    size="x-small"
                    icon="mdi-arrow-left"
                    variant="text"
                    @click="cancel">
                </VBtn>
                <div
                    v-ripple
                    class="ellipsis text-body-2 pa-2"
                    color="primary"
                    style="cursor: pointer;"
                    @click="openToBrowser(`https://www.ptt.cc/bbs/${category}`)">
                    {{ category }}
                </div>
            </VRow>
        </Teleport>
        <VList style="min-height: 100vh;">
            <div class="py-2 px-2">
                <VTextField
                    v-model="state.search"
                    placeholder="搜尋標題"
                    hide-details
                    density="comfortable"
                    variant="outlined"
                    @keyup.enter="search">
                    <template v-if="state.search" #append-inner>
                        <VBtn
                            size="small"
                            class="px-0"
                            color="primary"
                            rounded="pill"
                            @click="search">
                            <VIcon>mdi-magnify</VIcon>
                        </VBtn>
                    </template>
                </VTextField>
            </div>
            <div v-for="item of articleData.articles" :key="item.url">
                <VListItem
                    class="px-0"
                    :title="item.title"
                    :subtitle="item.date + ' ' + item.author"
                    :class="{
                        'text-red': (item.assess === '爆' || Number(item.assess) >= 75)
                    }"
                    @click="toView(item.url)">
                    <template #prepend>
                        <div
                            class="text-center"
                            :style="{
                                color: getAssessColor(item.assess),
                                width: '48px'
                            }">
                            {{ item.assess }}
                        </div>
                    </template>
                    <template #append>
                        <VBtn
                            class="mx-2 text-grey"
                            icon="mdi-open-in-new"
                            size="small"
                            variant="text"
                            @click.stop="openToBrowser(item.url)">
                        </VBtn>
                    </template>
                </VListItem>
                <VDivider></VDivider>
            </div>
            <div v-if="state.loading" class="pa-4 text-center">
                <VProgressCircular indeterminate></VProgressCircular>
            </div>
            <div v-else class="my-4 text-center">
                <VBtn
                    v-if="articleData.prev"
                    size="small"
                    variant="flat"
                    block
                    @click="fetch(articleData.prev)">
                    獲取更多
                </VBtn>
                <VBtn
                    size="small"
                    variant="flat"
                    block
                    class="text-grey my-2"
                    @click="refreshArticles">
                    重新整理
                </VBtn>
            </div>
            <div ref="bottomBlock"></div>
        </VList>
    </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useStore } from '@/store'
import { ref, computed, reactive, onMounted } from 'vue'

const category = router.currentRoute.value.query.category as string

// =================
//
// ref
//

const bottomBlock = ref<HTMLDivElement>()

// =================
//
// store
//

const store = useStore()

// =================
//
// state
//

const state = reactive({
    loading: false,
    search: ''
})

// =================
//
// mounted
//

onMounted(() => {
    if (articleData.value.articles == null) {
        fetch(category)
    }
    moveToBottom()
})

// =================
//
// computed
//

const articleData = computed(() => {
    return store.state.articles[category] || {}
})

// =================
//
// methods
//

const search = async() => {
    state.loading = true
    await store.refreshArticles(category, state.search)
    state.loading = false
}

const getAssessColor = (assess: string) => {
    if (assess[0] === 'X') {
        return 'gray'
    }
    if (assess[0] === '爆') {
        return 'red'
    }
    return 'green'
}

const toView = (url: string) => {
    router.push({
        name: 'View',
        query: {
            url
        }
    })
}

const openToBrowser = (url: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const shell = require('electron').shell
    shell.openExternal(url)
}

const fetch = async(url: string) => {
    state.loading = true
    await store.fetchArticles(category, url)
    state.loading = false
}

const refreshArticles = async() => {
    state.loading = true
    state.search = ''
    await store.refreshArticles(category)
    state.loading = false
}

const cancel = () => {
    router.push({
        name: 'Home'
    })
}

const moveToBottom = () => {
    setTimeout(() => {
        bottomBlock.value?.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        })
    }, 150)
}
</script>
