<template>
    <VList>
        <VListItem
            v-for="category in categories"
            :key="category.value"
            @click="emit('selected', category)">
            <VListItemTitle>{{ category.title }}</VListItemTitle>
        </VListItem>
    </VList>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

// =================
//
// defined
//

const emit = defineEmits<{
    selected: [{
        title: string
        value: string
    }]
}>()

// =================
//
// store
//

const store = useStore()

// =================
//
// state
//

const items = [
    {
        title: '西洽版',
        value: 'C_Chat'
    },
    {
        title: '大氣版',
        value: 'TY_Research'
    },
    {
        title: '棒球版',
        value: 'Baseball'
    },
    {
        title: 'NBA板',
        value: 'NBA'
    },
    {
        title: '英雄聯盟版',
        value: 'LoL'
    },
    {
        title: '省錢板',
        value: 'Lifeismoney'
    },
    {
        title: '政黑版',
        value: 'HatePolitics'
    },
    {
        title: '韓星版',
        value: 'KoreaStar'
    },
    {
        title: '電影版',
        value: 'movie'
    },
    {
        title: '房版',
        value: 'home-sale'
    },
    {
        title: '汽車版',
        value: 'car'
    },
    {
        title: '西斯版',
        value: 'sex'
    },
    {
        title: '科技版',
        value: 'Tech_Job'
    },
    {
        title: '軍事版',
        value: 'Military'
    },
    {
        title: '表特版',
        value: 'Beauty'
    },
    {
        title: '籃球版',
        value: 'basketballTW'
    },
    {
        title: '媽寶版',
        value: 'BabyMother'
    },
    {
        title: '電蝦版',
        value: 'PC_Shopping'
    },
    {
        title: '理財版',
        value: 'creditcard'
    },
    {
        title: '女孩版',
        value: 'WomenTalk'
    },
    {
        title: 'AV女優板',
        value: 'japanavgirls'
    },
    {
        title: '男女版',
        value: 'Boy-Girl'
    },
    {
        title: '韓劇版',
        value: 'KoreaDrama'
    },
    {
        title: '台劇版',
        value: 'TaiwanDrama'
    },
    {
        title: '韓綜版',
        value: 'KR_Entertain'
    },
    {
        title: '運彩版',
        value: 'SportLottery'
    },
    {
        title: 'iOS版',
        value: 'iOS'
    },
    {
        title: '中劇版',
        value: 'China-Drama'
    },
    {
        title: '心情版',
        value: 'Marginalman'
    },
    {
        title: '網購版',
        value: 'e-shopping'
    },
    {
        title: '驚悚版',
        value: 'marvel'
    },
    {
        title: '娛樂版',
        value: 'joke'
    }
]

// =================
//
// computed
//

const categories = computed(() => {
    return items.filter((item) => {
        return !store.categories.find((category) => {
            return category.value === item.value
        })
    })
})

</script>
