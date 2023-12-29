<template>
    <VMenu
        v-model="state.show"
        class="context-menu"
        :style="{
            left: state.x + 'px',
            top: state.y + 'px'
        }">
        <div
            ref="menu"
            class="elevation-3 rounded-lg overflow-hidden"
            style="width: fit-content; height: fit-content;">
            <slot name="menu"></slot>
        </div>
    </VMenu>
    <slot :switch-show="switchShow"></slot>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive } from 'vue'

const menu = ref<HTMLElement>()

// =================
//
// state
//

const state = reactive({
    x: 0,
    y: 0,
    show: false
})

// =================
//
// methods
//

const switchShow = (event: MouseEvent) => {
    state.show = true
    nextTick(() => {
        if (menu.value) {
            const { width, height } = (menu.value as HTMLElement).getBoundingClientRect()
            state.x = event.clientX + width > window.innerWidth
                ? event.clientX - width
                : event.clientX
            state.y = event.clientY + height > window.innerHeight
                ? event.clientY - height
                : event.clientY
        }
    })
}
</script>

<style scoped>
.context-menu {
    position: fixed;
    z-index: 100;
}

</style>
