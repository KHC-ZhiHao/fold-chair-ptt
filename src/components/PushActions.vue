<template>
    <VList lines="one">
        <VListItem
            prepend-icon="mdi-content-copy"
            @click="copy()">
            複製
        </VListItem>
        <slot></slot>
        <VListItem
            v-if="push.link"
            prepend-icon="mdi-open-in-new"
            @click="openToBrowser(push.link)">
            另開視窗
        </VListItem>
        <VListItem
            prepend-icon="mdi-account-remove"
            :class="{
                'text-primary': inBlackList
            }"
            @click="toBlackList()">
            {{ inBlackList ? '移出黑名單' : '加入黑名單' }}
        </VListItem>
        <VListItem
            prepend-icon="mdi-account-check"
            :class="{
                'text-primary': inWhiteList
            }"
            @click="toWhiteList()">
            {{ inWhiteList ? '移出白名單' : '加入白名單' }}
        </VListItem>
    </VList>
</template>

<script setup lang="ts">
import { Push } from '@/ptt'
import { useStore } from '@/store'
import { openToBrowser } from '@/utils'
import { PropType, computed } from 'vue'

const store = useStore()

// =================
//
// defined
//

const props = defineProps({
    push: {
        type: Object as PropType<Push>,
        required: true
    }
})

// =================
//
// computed
//

const inWhiteList = computed(() => store.state.writelist.includes(props.push.user))
const inBlackList = computed(() => store.state.blacklist.includes(props.push.user))

// =================
//
// methods
//

const copy = () => {
    const clipboard = navigator.clipboard
    if (props.push.linkIsImage) {
        const img = new Image()
        img.src = props.push.link
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(img, 0, 0)
                canvas.toBlob(blob => {
                    if (blob) {
                        clipboard.write([
                            new ClipboardItem({
                                [blob.type]: blob
                            })
                        ])
                    }
                })
            }
        }
    } else {
        const clipboard = navigator.clipboard
        clipboard.writeText(`${props.push.user}: ${props.push.message}`)
    }
}

const toWhiteList = () => {
    if (inWhiteList.value) {
        store.state.writelist = store.state.writelist.filter(e => e !== props.push.user)
    } else {
        store.state.writelist.push(props.push.user)
    }
}

const toBlackList = () => {
    if (inBlackList.value) {
        store.state.blacklist = store.state.blacklist.filter(e => e !== props.push.user)
    } else {
        store.state.blacklist.push(props.push.user)
    }
}

</script>
