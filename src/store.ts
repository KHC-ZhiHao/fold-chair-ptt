import { useStorage } from './storage'
import { defineStore } from 'pinia'
import { computed, reactive, watch } from 'vue'
import { fetchPTTArticles } from '@/ptt'
import { PromiseResponseType } from 'power-helper/types/pick'

type Article = PromiseResponseType<typeof fetchPTTArticles>['articles'][0]

export const useStore = defineStore('main', () => {
    const storage = useStorage()

    // =================
    //
    // state
    //

    const state = reactive({
        opacity: storage.get('opacity'),
        messageSpeed: storage.get('messageSpeed'),
        refreshTime: storage.get('refreshTime'),
        hideImage: storage.get('hideImage'),
        categories: storage.get('categories'),
        articles: {} as Record<string, {
            articles: Article[]
            next: string | null
            prev: string | null
        }>
    })

    watch(() => state.opacity, () => {
        storage.set('opacity', state.opacity)
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
        refreshArticles,
        fetchArticles,
        refreshTime,
        messageSpeed
    }
})
