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
                        @click="openToBrowser(url)">
                        {{ state.content.attrs.title }}
                    </div>
                </VRow>
            </Teleport>
            <VCard v-if="state.messages.length === 0" class="pa-6 my-1 text-center bg-white text-grey">現在沒有留言 :(</VCard>
            <ContextMenu>
                <template #menu>
                    <PushActions
                        v-if="focusMessage"
                        :push="focusMessage">
                        <VListItem
                            v-if="!state.hideMessages.includes(state.nowFocusMessageId)"
                            prepend-icon="mdi-eye-off-outline"
                            @click="hide()">
                            隱藏
                        </VListItem>
                        <VListItem
                            v-else
                            prepend-icon="mdi-eye-outline"
                            class="text-primary"
                            @click="show()">
                            顯示
                        </VListItem>
                    </PushActions>
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
                                :color="getMessageColor(message)"
                                @click.right="(event: any) => {
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
                                        <span class="mx-2">{{ getMessageName(message) }}:</span>
                                    </div>
                                    <VSpacer></VSpacer>
                                    <div>{{ message.date }} {{ message.time }}</div>
                                </v-row>
                                <!-- 內容 -->
                                <div v-if="state.hideMessages.includes(message.uid)" class="py-1 text-grey">
                                    訊息已隱藏
                                </div>
                                <div v-else-if="message.linkIsImage && store.hideImage === false">
                                    <img
                                        class="py-1 d-block"
                                        style="width: 100%;"
                                        :src="message.link"
                                        @load="moveToBottom(true)"
                                        @click="isActived ? () => null : viewImage(message.link)"
                                    >
                                    <div class="text-caption text-center text-grey">{{ message.link }}</div>
                                </div>
                                <div v-else-if="message.link">
                                    <a :href="message.link" target="_blank"></a>
                                </div>
                                <Mark v-else>
                                    <pre class="py-1">{{ message.message.trim() }}</pre>
                                </Mark>
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
                :disabled="!!state.messageBuffers.length || state.reloading || store.refreshTime === 1"
                @click="reload()">
                <div v-if="!!state.messageBuffers.length">
                    New Messages: {{ state.messageBuffers.length }}
                </div>
                <div v-else-if="store.refreshTime === 1">即時更新模式</div>
                <div v-else-if="state.reloading">載入中...</div>
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
import Mark from '@/components/Mark.vue'
import PushActions from '@/components/PushActions.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import ToBottom from '@/components/ToBottom.vue'
import { useStore } from '@/store'
import { useTheme } from 'vuetify'
import { useStorage } from '@/storage'
import { VBtn } from 'vuetify/components'
import { Timer, Schedule, calc } from 'power-helper'
import { readPTTArticle, getFakeData, Push } from '@/ptt'
import { computed, ref, nextTick, onMounted, reactive, watch, onUnmounted } from 'vue'
import { openToBrowser } from '@/utils'

const theme = useTheme()
const store = useStore()
const storage = useStorage()
const maxMessage = 500

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

onUnmounted(() => {
    timer.close()
    schedule.close()
})

// =================
//
// watch
//

watch(() => store.messageSpeed, () => {
    reloadSchedule()
})

watch([
    () => store.state.writelist.length,
    () => store.state.blacklist.length
], () => {
    computedMessage()
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
    return state.toBottomBtn && state.messages.length > 10
})

const focusMessage = computed(() => {
    return state.messages.find(e => e.uid === state.nowFocusMessageId)
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
        state.messages = state.content.pushs.slice(-maxMessage)
        timer.play()
        let histories = storage.get('histories')
        histories = histories.filter(e => e.url !== url.value)
        histories.unshift({
            title: state.content.attrs.title,
            url: url.value,
            createdAt: dayjs().valueOf()
        })
        storage.set('histories', histories)
        computedMessage()
        nextTick(() => {
            state.inited = true
            setTimeout(() => {
                reload(true)
                reloadSchedule()
                observer.observe(reloadBtn.value?.$el)
                moveToBottom(true)
            }, 150)
        })
    } catch (error) {
        alert(error)
    }
}

const getMessageColor = (message: Push) => {
    if (store.state.writelist.includes(message.user)) {
        return theme.global.name.value === 'dark' ? `rgba(0, 0, 125, ${store.opacity})` : `rgba(240, 240, 255, ${store.opacity})`
    }
    return theme.global.name.value === 'dark' ? `rgba(0, 0, 0, ${store.opacity})` : `rgba(255, 255, 255, ${store.opacity})`
}

const getMessageName = (message: Push) => {
    let name = message.user
    if (store.state.writelist.includes(name)) {
        name += ' (白名單)'
    }
    if (store.state.blacklist.includes(name)) {
        name += ' (黑名單)'
    }
    return name
}

const reloadSchedule = () => {
    if (schedule.has('push')) {
        schedule.remove('push')
    }
    schedule.add('push', store.messageSpeed * 1000, async() => {
        if (state.toBottomBtn) {
            return
        }
        if (state.messageBuffers.length > 0) {
            let message = state.messageBuffers.shift()
            if (message) {
                state.messages.push(message)
                computedMessage()
                moveToBottom()
            }
        }
    })
}

const reload = async(quick = false) => {
    state.reloading = true
    timer.setTime(calc.toMs('s', store.refreshTime))
    try {
        let pushs = await state.content.findNewest()
        if (quick) {
            state.messages.push(...pushs.slice(-maxMessage))
        } else {
            // 過濾重複的留言
            pushs = pushs.filter(e => !state.messages.find(m => `${m.user}/${m.message}` === `${e.user}/${e.message}`))
            state.messageBuffers.push(...pushs)
        }
        computedMessage()
    } catch (error) {
        state.content = await readPTTArticle(url.value)
    }
    state.reloading = false
}

const moveToBottom = (quick = false) => {
    setTimeout(() => {
        if (quick) {
            reloadBtn.value?.$el.scrollIntoView({
                block: 'end'
            })
        } else {
            reloadBtn.value?.$el.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }
    }, 150)
}

const cancel = () => {
    router.go(-1)
}

const hide = (messageId: string = state.nowFocusMessageId) => {
    state.hideMessages.push(messageId)
}

const show = (messageId: string = state.nowFocusMessageId) => {
    state.hideMessages = state.hideMessages.filter(e => e !== messageId)
}

const viewImage = (src: string) => {
    window.open(src, '_blank', 'title=image viewer')
}

const computedMessage = () => {
    if (state.messages.length > maxMessage) {
        state.messages.splice(0, state.messages.length - maxMessage)
    }
    state.hideMessages = state.hideMessages.filter(e => state.messages.find(m => m.uid === e))
    state.messages.forEach(e => {
        if (store.state.blacklist.includes(e.user)) {
            state.hideMessages.push(e.uid)
        }
    })
}

</script>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
