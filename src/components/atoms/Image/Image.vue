<template>
    <div class="lg:w-3/4 w-full bg-[#282c34] p-5 shadow-lg rounded-md flex flex-col">
        <p class="italic text-gray-500">{{ alt }} (Image)</p>
        <img :src="src" class="" :alt="alt">
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    src: string;
    alt: string;
}>()
</script>

<style>
</style>
