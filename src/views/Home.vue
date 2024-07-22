<template>
    <div class="h-100">
        <VDialog v-model="state.categoryDialog">
            <Categories @selected="addCategory"></Categories>
        </VDialog>
        <v-card rounded="0" class="text-center" style="min-height: 100vh;">
            <Teleport to="#header-title">
                <div class="text-body-2 mx-2 ellipsis" color="primary">歡迎回來 板凳 PTT v{{ store.state.version }}</div>
            </Teleport>
            <div class="pa-4 pb-0">
                <VTextField
                    v-model="state.articleUrl"
                    placeholder="請輸入 PTT 文章網址"
                    hide-details
                    density="comfortable"
                    variant="outlined"
                    @keyup.enter="submit">
                    <template v-if="state.articleUrl" #append-inner>
                        <VBtn
                            size="small"
                            class="px-0"
                            color="primary"
                            rounded="pill"
                            @click="submit">
                            <VIcon>mdi-magnify</VIcon>
                        </VBtn>
                    </template>
                </VTextField>
                <VChipGroup column class="mt-1">
                    <VChip
                        v-for="category of state.categories" :key="category.value"
                        @click="toCategory(category.value)">
                        {{ category.title }}
                    </VChip>
                    <VChip
                        v-for="category of store.categories" :key="category.value"
                        closable
                        @click="toCategory(category.value)"
                        @click:close.stop="removeCategory(category.value)">
                        {{ category.title }}
                    </VChip>
                    <VChip @click="showCategory">
                        <VIcon>mdi-plus</VIcon>
                    </VChip>
                </VChipGroup>
            </div>
            <VDivider class="mt-1"></VDivider>
            <History @selected="clickHistory"></History>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import router from '@/router'
import History from '@/components/History.vue'
import Categories from '@/components/Categories.vue'
import { reactive } from 'vue'
import { useStore } from '@/store'

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
    articleUrl: '',
    categoryDialog: false,
    categories: [
        {
            title: '八卦版',
            value: 'Gossiping'
        },
        {
            title: '股版',
            value: 'Stock'
        }
    ]
})

// =================
//
// methods
//

const showCategory = () => {
    state.categoryDialog = true
}

const addCategory = (item: {
    title: string
    value: string
}) => {
    store.categories.push(item)
    state.categoryDialog = false
}

const toCategory = (category: string) => {
    router.push({
        name: 'Articles',
        query: {
            category
        }
    })
}

const submit = () => {
    const isUrl = /^https:\/\/www.ptt.cc\/bbs\/.+\/.+\.html$/.test(state.articleUrl)
    if (!isUrl) {
        alert('請輸入正確的 PTT 文章網址')
        return
    }
    router.push({
        name: 'View',
        query: {
            url: state.articleUrl
        }
    })
}

const clickHistory = (url: string) => {
    router.push({
        name: 'View',
        query: {
            url
        }
    })
}

const removeCategory = (category: string) => {
    store.state.categories = store.categories.filter(item => item.value !== category)
}

</script>
