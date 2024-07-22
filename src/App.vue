<template>
    <v-app>
        <VSystemBar class="px-4">
            <div class="w-100 text-left ellipsis" style="-webkit-app-region: drag; cursor: move;">折凳 PTT v{{ store.state.version }}</div>
            <VDialog v-if="store.state.newVersion !== store.state.version" max-width="260px">
                <template #activator="context">
                    <VIcon
                        v-bind="context.props"
                        size="small"
                        class="mr-2"
                        color="red">
                        mdi-bell
                    </VIcon>
                </template>
                <template #default>
                    <VCard class="pa-4">
                        新版本 {{ store.state.newVersion }} 已經推出，請至 GitHub 下載
                        <VBtn class="mt-4" color="primary" @click="openGithub">更新</VBtn>
                    </VCard>
                </template>
            </VDialog>
            <VDialog max-width="260px">
                <template #activator="{ props }">
                    <VIcon
                        v-bind="props"
                        size="small"
                        class="mr-2">
                        mdi-sheep
                    </VIcon>
                </template>
                <template #default>
                    <VCard class="pa-4 pt-2" rounded="lg">
                        <div class="text-h6 mb-1 pb-1">關於我們</div>
                        <VCard
                            rounded="lg"
                            variant="outlined"
                            class="pa-2 bg-metalsheep-lighten-4"
                            @click="openMetalsheep">
                            <VRow align="center" no-gutters>
                                <VIcon color="metalsheep">mdi-sheep</VIcon>
                                <span class="mx-2">Metalsheep 官方網站</span>
                            </VRow>
                        </VCard>
                        <VCard
                            rounded="lg"
                            variant="outlined"
                            class="pa-2 mt-4"
                            @click="openGithub">
                            <VRow align="center" no-gutters>
                                <VIcon>mdi-github</VIcon>
                                <span class="mx-2">GitHub</span>
                            </VRow>
                        </VCard>
                    </VCard>
                </template>
            </VDialog>
            <VIcon
                size="small"
                class="mr-2"
                @click="state.hideContent = !state.hideContent">
                {{ state.hideContent ? 'mdi-arrow-expand-vertical' : 'mdi-arrow-collapse-vertical' }}
            </VIcon>
            <VIcon
                size="small"
                class="mr-2"
                @click="store.newWebPage">
                mdi-view-split-vertical
            </VIcon>
            <VDialog max-width="480px">
                <template #activator="{ props }">
                    <VIcon
                        v-bind="props"
                        size="small"
                        class="mr-2">
                        mdi-cog
                    </VIcon>
                </template>
                <template #default>
                    <VCard class="pa-4 pt-2" rounded="lg">
                        <Setting></Setting>
                    </VCard>
                </template>
            </VDialog>
            <VIcon
                size="small"
                @click="close">
                mdi-close
            </VIcon>
        </VSystemBar>
        <VAppBar
            density="compact"
            class="pl-2"
            elevation="1"
            :class="{
                'no-display': state.hideContent
            }">
            <div
                id="header-title"
                :style="{
                    'width': '100%'
                }">
            </div>
        </VAppBar>
        <VMain
            style="height: 100vh;"
            :class="{
                'no-display': state.hideContent
            }">
            <RouterView
                v-if="state.show && store.state.webPages.length === 0"
                :key="store.state.reloadKey.toString()">
            </RouterView>
            <VRow
                v-if="state.show && store.state.webPages.length !== 0"
                no-gutters
                class="h-100 flex-nowrap">
                <div
                    class="w-100 h-100 overflow-auto"
                    :style="{
                        maxWidth: '360px'
                    }">
                    <RouterView :key="store.state.reloadKey.toString()"></RouterView>
                </div>
                <template v-for="page, index of store.state.webPages" :key="index">
                    <div class="page-wrapper w-100 h-100 overflow-auto">
                        <WebPage :page-id="page.id"></WebPage>
                    </div>
                </template>
            </VRow>
        </VMain>
    </v-app>
</template>

<script setup lang="ts">
import Setting from './components/Setting.vue'
import WebPage from './components/WebPage.vue'
import { useStore } from '@/store'
import { openToBrowser } from '@/utils'
import { reactive, onMounted } from 'vue'

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
    show: false,
    hideContent: false,
    eventListeners: [] as any[],
    windows: [] as {
        id: string
    }[]
})

// =================
//
// mounted
//

onMounted(() => {
    setTimeout(() => {
        state.show = true
    }, 100)
})

// =================
//
// methods
//

const close = () => {
    window.close()
}

const openGithub = () => {
    openToBrowser('https://github.com/KHC-ZhiHao/fold-chair-ptt')
}

const openMetalsheep = () => {
    openToBrowser('https://metalsheep.com')
}

</script>

<style scoped>
.no-display {
    display: none;
}
.pages-table {
    max-width: 100vw;
}
.page-wrapper {
    border-left: 3px solid rgba(214, 214, 214, 0);
}
</style>
