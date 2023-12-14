<template>
    <div v-if="state.histories.length">
        <VDivider class="mt-1 mb-2"></VDivider>
        <VRow no-gutters align="center" justify="space-between">
            <div>歷史資料</div>
            <VBtn
                size="small"
                variant="text"
                color="grey"
                @click="removeAll">
                清除全部
            </VBtn>
        </VRow>
        <div class="text-left">
            <VList>
                <VListItem
                    v-for="item of state.histories"
                    :key="item.title"
                    :title="item.title"
                    :subtitle="dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')"
                    @click="click(item.url)">
                    <template #append>
                        <v-btn
                            size="small"
                            variant="text"
                            color="grey"
                            icon="mdi-delete"
                            @click.stop="remove(item.url)">
                        </v-btn>
                    </template>
                </VListItem>
            </VList>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { reactive } from 'vue'
import { useStorage } from '@/storage'

const storage = useStorage()

// =================
//
// defined
//

const emit = defineEmits<{
    selected: [string]
}>()

// =================
//
// state
//

const state = reactive({
    histories: storage.get('histories')
})

// =================
//
// methods
//

const click = (url: string) => {
    emit('selected', url)
}

const remove = (url: string) => {
    state.histories = state.histories.filter((item) => item.url !== url)
    storage.set('histories', state.histories)
}

const removeAll = () => {
    state.histories = []
    storage.set('histories', state.histories)
}

</script>
