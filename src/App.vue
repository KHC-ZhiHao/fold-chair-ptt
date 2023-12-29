<template>
    <v-app>
        <VSystemBar class="px-4">
            <div class="w-100 text-left" style="-webkit-app-region: drag; cursor: move;">折凳 PTT</div>
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
            <VDialog>
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('electron').shell.openExternal('https://github.com/KHC-ZhiHao/fold-chair-ptt')
}

const openMetalsheep = () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('electron').shell.openExternal('https://metalsheep.com')
}

</script>
