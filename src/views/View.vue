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
                    <VDialog>
                        <template #activator="{ props }">
                            <div
                                v-ripple
                                v-bind="props"
                                class="text-body-2 pa-2 ellipsis"
                                style="cursor: pointer;"
                                color="primary">
                                {{ state.content.attrs.title }}
                            </div>
                        </template>
                        <template #default>
                            <VCard>
                                <VCardTitle>
                                    {{ state.content.attrs.title }}
                                </VCardTitle>
                                <VCardSubtitle>
                                    <VBtn
                                        variant="text"
                                        size="small"
                                        icon="mdi-open-in-new"
                                        @click="openToBrowser">
                                    </VBtn>
                                    {{ state.content.attrs.author }} {{ state.content.attrs.date }}
                                </VCardSubtitle>
                                <VCardText>
                                    {{ state.content.content }}
                                </VCardText>
                            </VCard>
                        </template>
                    </VDialog>
                </VRow>
            </Teleport>
            <div v-for="message of state.messages" :key="message.uid">
                <Ani
                    class="w-100"
                    mode="fadeInUp"
                    duration="super-faster">
                    <v-card
                        class="my-1 pa-1"
                        elevation="0"
                        :color="theme.global.name.value === 'dark' ? `rgba(0, 0, 0, ${store.opacity})` : `rgba(255, 255, 255, ${store.opacity})`">
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
                        <img
                            v-if="message.link && store.hideImage === false"
                            class="py-1 d-block"
                            style="width: 100%;"
                            :src="message.link"
                            @load="moveToBottom"
                        >
                        <div v-else class="py-1">{{ message.message }}</div>
                    </v-card>
                </Ani>
            </div>
            <VBtn
                ref="reloadBtn"
                block
                size="small"
                class="my-1"
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
import ToBottom from '@/components/ToBottom.vue'
import { useStore } from '@/store'
import { useTheme } from 'vuetify'
import { useStorage } from '@/storage'
import { VBtn, VCardSubtitle } from 'vuetify/components'
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
    messageBuffers: [] as Push[],
    messages: [] as Push[]
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
        if (state.messageBuffers.length === 0) {
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
        try {
            const pushs = await state.content.findNewest()
            state.messages.push(...pushs)
        } catch (error) {
            // nothing
        }
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
                observer.observe(reloadBtn.value?.$el)
                moveToBottom()
            }, 150)
        })
    } catch (error) {
        alert(error)
    }
}

const reload = async() => {
    state.reloading = true
    timer.setTime(calc.toMs('s', store.refreshTime))
    try {
        const pushs = await state.content.findNewest()
        state.messageBuffers.push(...pushs)
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

</script>
