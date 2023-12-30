<template>
    <div>
        <div v-if="state.inited === false" class="py-1">
            <Teleport to="#header-title">
                <VBtn
                    size="x-small"
                    icon="mdi-arrow-left"
                    variant="text"
                    @click="cancel">
                </VBtn>
            </Teleport>
            <v-card class="pa-4 text-center">
                <VProgressCircular indeterminate></VProgressCircular>
            </v-card>
        </div>
        <div v-else>
            <ToBottom v-if="showToBottomBtn" @click="moveToBottom"></ToBottom>
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
                        class="text-body-2 pa-2 ellipsis"
                        style="cursor: pointer;"
                        color="primary"
                        @click="openToBrowser">
                        {{ state.content.attrs.title }}
                    </div>
                </VRow>
            </Teleport>
            <VCard v-if="state.messages.length === 0" class="pa-6 my-1 text-center bg-white text-grey">現在沒有留言 :(</VCard>
            <ContextMenu>
                <template #menu>
                    <VList lines="one">
                        <VListItem prepend-icon="mdi-content-copy" @click="copy()">複製</VListItem>
                        <VListItem v-if="!state.hideMessages.includes(state.nowFocusMessageId)" prepend-icon="mdi-eye-off-outline" @click="hide()">隱藏</VListItem>
                        <VListItem v-else prepend-icon="mdi-eye-outline" @click="show()">顯示</VListItem>
                    </VList>
                </template>
                <template #default="{ switchShow, isActived }">
                    <div v-for="message of state.messages" :key="message.uid">
                        <Ani
                            class="w-100"
                            mode="fadeInUp"
                            duration="super-faster">
                            <v-card
                                class="my-1 pa-1"
                                elevation="0"
                                :color="theme.global.name.value === 'dark' ? `rgba(0, 0, 0, ${store.opacity})` : `rgba(255, 255, 255, ${store.opacity})`"
                                @click.right="(event) => {
                                    state.nowFocusMessageId = message.uid
                                    switchShow(event)
                                }">
                                <!-- 作者 -->
                                <v-row no-gutters class="flex-nowrap">
                                    <div>
                                        <span
                                            :style="{
                                                color: message.tag === '推' ? 'green' : message.tag === '噓' ? 'red' : 'gray'
                                            }">
                                            {{ message.tag }}
                                        </span>
                                        <span class="mx-2">{{ message.user }}:</span>
                                    </div>
                                    <VSpacer></VSpacer>
                                    <div>{{ message.date }} {{ message.time }}</div>
                                </v-row>
                                <!-- 內容 -->
                                <div v-if="state.hideMessages.includes(message.uid)" class="py-1 text-grey">
                                    訊息已隱藏
                                </div>
                                <img
                                    v-else-if="message.link && store.hideImage === false"
                                    class="py-1 d-block"
                                    style="width: 100%;"
                                    :src="message.link"
                                    @load="moveToBottom"
                                    @click="isActived ? () => null : viewImage(message.link)"
                                >
                                <pre v-else class="py-1">{{ message.message }}</pre>
                            </v-card>
                        </Ani>
                    </div>
                </template>
            </ContextMenu>
            <VBtn
                ref="reloadBtn"
                block
                size="small"
                variant="flat"
                :style="{
                    opacity: store.opacity
                }"
                :loading="state.reloading"
                :disabled="!!state.messageBuffers.length"
                @click="reload">
                <div v-if="!!state.messageBuffers.length">
                    New Messages: {{ state.messageBuffers.length }}
                </div>
                <div v-else>
                    <v-icon>mdi-refresh</v-icon>
                    <span class="text-body-2" style="vertical-align: middle;">
                        {{ state.refreshTime }}s
                    </span>
                </div>
            </VBtn>
        </div>
    </div>
</template>

<script setup lang="ts">
import Ani from '@/components/Ani.vue'
import dayjs from 'dayjs'
import router from '@/router'
import ContextMenu from '@/components/ContextMenu.vue'
import ToBottom from '@/components/ToBottom.vue'
import { useStore } from '@/store'
import { useTheme } from 'vuetify'
import { useStorage } from '@/storage'
import { VBtn } from 'vuetify/components'
import { Timer, Schedule, calc } from 'power-helper'
import { readPTTArticle, getFakeData } from '@/ptt'
import { computed, ref, nextTick, onMounted, reactive, watch, onUnmounted } from 'vue'

type Push = ReturnType<typeof getFakeData>['pushs'][0]

const theme = useTheme()
const store = useStore()
const storage = useStorage()
const maxMessage = 200

// =================
//
// refs
//

const reloadBtn = ref<InstanceType<typeof VBtn>>()

// =================
//
// observer
//

const observer = new IntersectionObserver((entries) => {
    for (let entry of entries) {
        if (entry.isIntersecting) {
            state.toBottomBtn = false
        } else {
            state.toBottomBtn = true
        }
    }
})

// =================
//
// state
//

const state = reactive({
    inited: false,
    refreshTime: store.refreshTime,
    toBottomBtn: false,
    reloading: false,
    content: getFakeData(),
    nowFocusMessageId: '',
    messageBuffers: [] as Push[],
    messages: [] as Push[],
    hideMessages: [] as string[]
})

// =================
//
// Schedule
//

const timer = new Timer()
const schedule = new Schedule()

timer.setTime(calc.toMs('s', store.refreshTime))
timer.setPositive(false)
timer.on('next', async() => {
    const time = timer.getTime()
    state.refreshTime = Math.floor(time / 1000)
    if (time === 0) {
        timer.setTime(calc.toMs('s', store.refreshTime))
        if (state.messageBuffers.length === 0 && state.toBottomBtn === false) {
            reload()
        }
    }
})

schedule.add('push', calc.toMs('s', store.messageSpeed), async() => {
    if (state.messageBuffers.length > 0) {
        let message = state.messageBuffers.shift()
        if (message) {
            state.messages.push(message)
            moveToBottom()
        }
    }
})

onUnmounted(() => {
    timer.close()
    schedule.close()
})

// =================
//
// messages
//

watch(() => state.content, () => {
    if (state.inited) {
        const lastMessage = state.messages.at(-1) ?? {
            date: '01/01',
            time: '00:00',
            tag: '',
            user: ''
        }
        const newMessages = state.content.pushs.filter(e => {
            const pushTime = dayjs(`${e.date} ${e.time}`, 'MM-DD HH:mm')
            const lastMessageTime = dayjs(`${lastMessage.date} ${lastMessage.time}`, 'MM-DD HH:mm')
            return pushTime.isAfter(lastMessageTime)
        })
        state.messageBuffers.push(...newMessages)
    }
}, {
    deep: true
})

watch(() => state.messages, () => {
    if (state.messages.length > maxMessage) {
        state.messages.splice(0, state.messages.length - maxMessage)
    }
}, {
    deep: true
})

// =================
//
// computed
//

const url = computed<string>(() => {
    const url = router.currentRoute.value.query?.url as string
    return url ?? ''
})

const showToBottomBtn = computed(() => {
    if (state.messageBuffers.length > 0) {
        return false
    }
    return state.toBottomBtn && state.messages.length > 10
})

// =================
//
// mounted
//

onMounted(() => {
    init()
})

onUnmounted(() => {
    observer.disconnect()
})

// =================
//
// methods
//

const init = async() => {
    try {
        state.content = await readPTTArticle(url.value)
        state.messages = [...state.content.pushs]
        timer.play()
        let histories = storage.get('histories')
        histories = histories.filter(e => e.url !== url.value)
        histories.unshift({
            title: state.content.attrs.title,
            url: url.value,
            createdAt: dayjs().valueOf()
        })
        storage.set('histories', histories)
        nextTick(() => {
            state.inited = true
            setTimeout(() => {
                reload(true)
                observer.observe(reloadBtn.value?.$el)
                moveToBottom()
            }, 150)
        })
    } catch (error) {
        alert(error)
    }
}

const reload = async(quick = false) => {
    state.reloading = true
    timer.setTime(calc.toMs('s', store.refreshTime))
    try {
        const pushs = await state.content.findNewest()
        if (quick) {
            state.messages.push(...pushs)
        } else {
            state.messageBuffers.push(...pushs)
        }
    } catch (error) {
        state.content = await readPTTArticle(url.value)
    }
    state.reloading = false
}

const moveToBottom = () => {
    setTimeout(() => {
        reloadBtn.value?.$el.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        })
    }, 150)
}

const cancel = () => {
    router.go(-1)
}

const openToBrowser = () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const shell = require('electron').shell
    shell.openExternal(url.value)
}

const hide = (messageId: string = state.nowFocusMessageId) => {
    state.hideMessages.push(messageId)
}

const show = (messageId: string = state.nowFocusMessageId) => {
    state.hideMessages = state.hideMessages.filter(e => e !== messageId)
}

const copy = (messageId: string = state.nowFocusMessageId) => {
    const message = state.messages.find(e => e.uid === messageId)
    if (message) {
        const clipboard = navigator.clipboard
        const isImg = message.link
        if (isImg) {
            const img = new Image()
            img.src = message.link
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
            clipboard.writeText(message.message)
        }
    }
}

const viewImage = (src: string) => {
    window.open(src, '_blank', 'title=image viewer')
}

</script>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
