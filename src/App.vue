<template>
  <Suspense>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    <template #fallback> Loading... </template>
  </Suspense>
</template>

<script setup lang="ts">
import Tweet from "./components/Tweet.vue";
import Thread from "./components/Thread.vue";
</script>