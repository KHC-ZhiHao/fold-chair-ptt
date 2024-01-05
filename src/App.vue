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
            <VIcon
                size="small"
                class="mr-2"
                @click="openMetalsheep">
                mdi-sheep
            </VIcon>
            <VIcon
                size="small"
                class="mr-2"
                @click="openGithub">
                mdi-github
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
                    <VCard class="pa-4" rounded="lg">
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
        <VAppBar density="compact" class="pl-2" elevation="1">
            <div
                id="header-title"
                :style="{
                    'width': '100%'
                }">
            </div>
        </VAppBar>
        <VMain style="height: 100vh;">
            <RouterView v-if="state.show"></RouterView>
        </VMain>
    </v-app>
</template>

<script setup lang="ts">
import Setting from './components/Setting.vue'
import { reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import { openToBrowser } from '@/utils'

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
    show: false
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
