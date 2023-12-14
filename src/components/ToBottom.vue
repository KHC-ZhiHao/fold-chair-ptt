<template>
    <div class="to-bottom">
        <Ani mode="bounceIn">
            <v-btn
                size="x-small"
                color="primary"
                icon="mdi-arrow-down-thick">
            </v-btn>
        </Ani>
    </div>
</template>

<script setup lang="ts">
import Ani from './Ani.vue'
</script>

<style scoped>
.to-bottom {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 1000;
}
</style>
