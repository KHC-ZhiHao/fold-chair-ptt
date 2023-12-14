import { LocalStorage } from 'power-helper'

export const useStorage = () => {
    const service = 'float-ptt'
    const storage = new LocalStorage(service, {
        defaultColumns: {
            theme: () => 'light' as 'light' | 'dark',
            opacity: () => 100,
            hideImage: () => false,
            categories: () => [] as { title: string, value: string }[],
            messageSpeed: () => 2,
            realtime: () => false,
            histories: () => {
                return [] as {
                    title: string
                    url: string
                    createdAt: number
                }[]
            }
        }
    })
    return storage
}
