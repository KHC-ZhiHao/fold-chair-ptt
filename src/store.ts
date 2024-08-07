import dayjs from 'dayjs'
import { useStorage } from './storage'
import { defineStore } from 'pinia'
import { computed, reactive, watch } from 'vue'
import { fetchPTTArticles } from '@/ptt'
import { TPick } from 'power-helper'
import { makeHttpsRequest } from '@/request'

type Article = TPick.PromiseResponseType<typeof fetchPTTArticles>['articles'][0]

export const useStore = defineStore('main', () => {
    const storage = useStorage()

    // =================
    //
    // state
    //

    const state = reactive({
        reloadKey: 0,
        version: '1.1.1',
        newVersion: '1.1.1',
        opacity: storage.get('opacity'),
        messageSpeed: storage.get('messageSpeed'),
        refreshTime: storage.get('refreshTime'),
        hideImage: storage.get('hideImage'),
        categories: storage.get('categories'),
        writelist: storage.get('whitelist'),
        pages: storage.get('pages'),
        blacklist: storage.get('blacklist'),
        keywords: storage.get('keywords'),
        pageHistory: storage.get('pageHistory'),
        webPages: [] as {
            id: string
            positionLeft: number
        }[],
        articles: {} as Record<string, {
            articles: Article[]
            next: string | null
            prev: string | null
        }>
    })

    // =================
    //
    // version
    //

    makeHttpsRequest('https://raw.githubusercontent.com/KHC-ZhiHao/fold-chair-ptt/main/package.json').then(raw => {
        const data = JSON.parse(raw)
        state.newVersion = data.version
    })

    // =================
    //
    // watch
    //

    watch(() => state.opacity, () => {
        storage.set('opacity', state.opacity)
    }, { deep: true })

    watch(() => state.writelist, () => {
        storage.set('whitelist', state.writelist)
    }, { deep: true })

    watch(() => state.blacklist, () => {
        storage.set('blacklist', state.blacklist)
    }, { deep: true })

    watch(() => state.hideImage, () => {
        storage.set('hideImage', state.hideImage)
    }, { deep: true })

    watch(() => state.refreshTime, () => {
        storage.set('refreshTime', state.refreshTime)
    }, { deep: true })

    watch(() => state.messageSpeed, () => {
        storage.set('messageSpeed', state.messageSpeed)
    }, { deep: true })

    watch(() => state.categories, () => {
        storage.set('categories', state.categories)
    }, { deep: true })

    watch(() => state.keywords, () => {
        storage.set('keywords', state.keywords)
    }, { deep: true })

    watch(() => state.pageHistory, () => {
        storage.set('pageHistory', state.pageHistory)
    }, { deep: true })

    watch(() => state.pages, () => {
        storage.set('pages', state.pages)
    }, { deep: true })

    // =================
    //
    // methods
    //

    const refreshArticles = async(category: string, search?: string) => {
        state.articles[category] = null as unknown as any
        await fetchArticles(category, search ? `https://www.ptt.cc/bbs/${category}/search?q=${search}` : category)
    }

    const fetchArticles = async(category: string, url: string) => {
        let firstLoad = false
        if (state.articles[category] == null) {
            state.articles[category] = {
                articles: [],
                next: '',
                prev: ''
            }
            firstLoad = true
        }
        const res = await fetchPTTArticles(url || category)
        state.articles[category].next = res.next
        state.articles[category].prev = res.prev
        state.articles[category].articles = [
            ...state.articles[category].articles,
            ...res.articles
        ]
        if (firstLoad && res.prev && state.articles[category].articles.length < 8) {
            await fetchArticles(category, res.prev)
        }
    }

    const newWebPage = () => {
        const id = Math.random().toString(36).substring(7)
        state.webPages.push({
            id,
            positionLeft: 0
        })
    }

    const closeWebPage = (id: string) => {
        state.webPages = state.webPages.filter(page => page.id !== id)
    }

    const addPageHistory = (params: {
        url: string
        title: string
    }) => {
        state.pageHistory.unshift({
            ...params,
            createdAt: dayjs().valueOf()
        })
        if (state.pageHistory.length >= 20) {
            state.pageHistory.pop()
        }
    }

    const removePageHistory = (index: number) => {
        state.pageHistory.splice(index, 1)
    }

    // =================
    //
    // getters
    //

    const opacity = computed(() => {
        return state.opacity / 100
    })

    const hideImage = computed(() => {
        return state.hideImage
    })

    const refreshTime = computed(() => {
        return state.refreshTime
    })

    const messageSpeed = computed(() => {
        return state.messageSpeed
    })

    const categories = computed(() => {
        return state.categories
    })

    return {
        state,
        opacity,
        hideImage,
        categories,
        newWebPage,
        removePageHistory,
        addPageHistory,
        closeWebPage,
        refreshArticles,
        fetchArticles,
        refreshTime,
        messageSpeed
    }
})
