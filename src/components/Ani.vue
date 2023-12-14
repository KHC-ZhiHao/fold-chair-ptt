<template>
    <div :class="classString" :style="styleString">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
/** @see https://animate.style */
import { StyleString } from 'power-helper'
import { PropType, computed } from 'vue'

export type Modes =
    'bounce' |
    'flash' |
    'pulse' |
    'rubberBand' |
    'shakeX' |
    'shakeY' |
    'headShake' |
    'swing' |
    'tada' |
    'wobble' |
    'jello' |
    'heartBeat' |
    'backInDown' |
    'backInLeft' |
    'backInRight' |
    'backInUp' |
    'backOutDown' |
    'backOutLeft' |
    'backOutRight' |
    'backOutUp' |
    'bounceIn' |
    'bounceInDown' |
    'bounceInLeft' |
    'bounceInRight' |
    'bounceInUp' |
    'bounceOut' |
    'bounceOutDown' |
    'bounceOutLeft' |
    'bounceOutRight' |
    'bounceOutUp' |
    'fadeIn' |
    'fadeInDown' |
    'fadeInDownBig' |
    'fadeInLeft' |
    'fadeInLeftBig' |
    'fadeInRight' |
    'fadeInRightBig' |
    'fadeInUp' |
    'fadeInUpBig' |
    'fadeInTopLeft' |
    'fadeInTopRight' |
    'fadeInBottomLeft' |
    'fadeInBottomRight' |
    'fadeOut' |
    'fadeOutDown' |
    'fadeOutDownBig' |
    'fadeOutLeft' |
    'fadeOutLeftBig' |
    'fadeOutRight' |
    'fadeOutRightBig' |
    'fadeOutUp' |
    'fadeOutUpBig' |
    'fadeOutTopLeft' |
    'fadeOutTopRight' |
    'fadeOutBottomRight' |
    'fadeOutBottomLeft' |
    'flip' |
    'flipInX' |
    'flipInY' |
    'flipOutX' |
    'flipOutY' |
    'lightSpeedInRight' |
    'lightSpeedInLeft' |
    'lightSpeedOutRight' |
    'lightSpeedOutLeft' |
    'rotateIn' |
    'rotateInDownLeft' |
    'rotateInDownRight' |
    'rotateInUpLeft' |
    'rotateInUpRight' |
    'rotateOut' |
    'rotateOutDownLeft' |
    'rotateOutDownRight' |
    'rotateOutUpLeft' |
    'rotateOutUpRight' |
    'hinge' |
    'jackInTheBox' |
    'rollIn' |
    'rollOut' |
    'zoomIn' |
    'zoomInDown' |
    'zoomInLeft' |
    'zoomInRight' |
    'zoomInUp' |
    'zoomOut' |
    'zoomOutDown' |
    'zoomOutLeft' |
    'zoomOutRight' |
    'zoomOutUp' |
    'slideInDown' |
    'slideInLeft' |
    'slideInRight' |
    'slideInUp' |
    'slideOutDown' |
    'slideOutLeft' |
    'slideOutRight' |
    'slideOutUp'

// =================
//
// define
//

const props = defineProps({
    mode: {
        type: String as PropType<Modes>,
        required: true
    },
    delay: {
        type: String as PropType<'1s' | '2s' | '3s' | '4s' | '5s' | '.5s' | '.25s' | '.75s'>,
        required: false,
        default: () => undefined
    },
    duration: {
        type: String as PropType<'slow' | 'slower' | 'fast' | 'faster' | 'super-faster'>,
        required: false,
        default: () => undefined
    },
    repeat: {
        type: String as PropType<'1' | '2' | '3' | 'infinite'>,
        required: false,
        default: () => undefined
    }
})

// =================
//
// computed
//

const styleString = computed(() => {
    let ss = new StyleString()
    if (props.delay) {
        ss.set('animationDelay', props.delay)
    }
    if (props.duration === 'super-faster') {
        ss.set('animationDuration', '.25s')
    }
    return ss.join()
})

const classString = computed(() => {
    let outputs = ['animate__animated', `animate__${props.mode}`]
    if (props.duration && props.duration !== 'super-faster') {
        outputs.push(`animate__${props.duration}`)
    }
    if (props.repeat) {
        outputs.push(`animate__repeat-${props.repeat}`)
    }
    return outputs.join(' ')
})

</script>
