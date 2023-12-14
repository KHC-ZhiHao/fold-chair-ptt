<template>
    <v-app>
        <VSystemBar style="-webkit-app-region: drag; cursor: move;">
            <v-spacer></v-spacer>
            <div class="text-center">折凳 PTT</div>
            <v-spacer></v-spacer>
        </VSystemBar>
        <VAppBar density="compact" class="pl-2">
            <div
                id="header-title"
                :style="{
                    'width': '70%'
                }">
            </div>
            <VSpacer></VSpacer>
            <VBtn
                size="x-small"
                icon="mdi-github"
                variant="text"
                @click="openGithub">
            </VBtn>
            <VDialog>
                <template #activator="{ props }">
                    <VBtn
                        v-bind="props"
                        class="mx-1"
                        size="x-small"
                        icon="mdi-cog"
                        variant="text">
                    </VBtn>
                </template>
                <template #default>
                    <VCard class="pa-4">
                        <Setting></Setting>
                    </VCard>
                </template>
            </VDialog>
            <VBtn
                size="x-small"
                icon="mdi-close"
                variant="text"
                @click="close">
            </VBtn>
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

</script>
