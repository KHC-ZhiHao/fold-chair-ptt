<template>
    <div ref="main">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import Mark from 'mark.js'
import { useStore } from '@/store'
import { computed, PropType, onMounted, ref, watch } from 'vue'

const store = useStore()

// =================
//
// defined
//

const props = defineProps({
    keywords: {
        type: Array as PropType<string[]>,
        required: false,
        default: null
    }
})

// =================
//
// refs
//

const main = ref<HTMLElement>()

// =================
//
// watch
//

watch(() => props.keywords, () => {
    markKeyword()
}, {
    deep: true
})

watch(() => store.state.keywords, () => {
    markKeyword()
}, {
    deep: true
})

// =================
//
// monuted
//

onMounted(() => {
    markKeyword()
})

// =================
//
// computed
//

const keywords = computed(() => {
    return props.keywords ? props.keywords : store.state.keywords
})

// =================
//
// methods
//

const markKeyword = () => {
    if (main.value) {
        const instance = new Mark(main.value)
        instance.unmark({
            done: () => {
                keywords.value.forEach((keyword) => {
                    instance.mark(keyword)
                })
            }
        })
    }
}

</script>
