import { LocalStorage } from 'power-helper'

export const useStorage = () => {
    const service = 'Fold-Chair-PTT'
    const storage = new LocalStorage(service, {
        defaultColumns: {
            theme: () => 'light' as 'light' | 'dark',
            opacity: () => 100,
            hideImage: () => false,
            categories: () => [] as { title: string, value: string }[],
            messageSpeed: () => 2,
            refreshTime: () => 60,
            keywords: () => [] as string[],
            whitelist: () => [] as string[],
            blacklist: () => [] as string[],
            pageHistory: () => [] as {
                url: string
                title: string
                createdAt: number
            }[],
            histories: () => {
                return [] as {
                    url: string
                    title: string
                    createdAt: number
                }[]
            }
        }
    })
    return storage
}
