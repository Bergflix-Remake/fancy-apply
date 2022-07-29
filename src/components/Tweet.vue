<template>
  <div
    class="flex flex-col lg:w-3/4 w-full p-5 bg-neutral-50 shadow-lg rounded-md space-y-4"
  >
    <div class="flex flex-row justify-start h-14 p-1 space-x-2">
      <img
        :src="avatar || 'https://picsum.photos/500'"
        :alt="handle"
        class="h-full rounded-full aspect-square"
      />
      <div class="flex flex-col justify-center h-full m-0">
        <h1 class="font-bold text-lg text-neutral-900">{{ username }}</h1>
        <h2 class="text-neutral-600">@{{ handle }}</h2>
      </div>
    </div>
    <h3 class="text-neutral-600" v-if="reply">
      Reply to <span class="text-[#1DA1F2]">{{ reply }}</span>
    </h3>
    <form
      v-if="showForm"
      class="flex flex-col justify-center items-center h-full space-y-2"
      @submit.prevent="submit"
    >
      <textarea
        v-model="contentHtml"
        class="w-full p-2 border-none resize-none h-full rounded-md focus:bg-neutral-100 outline-0"
        placeholder="What's happening?"
        maxlength="256"
      ></textarea>
      <div class="flex flex-row items-center justify-end w-full space-x-5">
        <p class="text-neutral-600">{{ contentHtml.length }} / 256</p>
        <input
          class="p-2 rounded-full border-neutral-300 w-min bg-[#1DA1F2] h-min text-white cursor-pointer hover:bg-[#1DA1D1]"
          type="submit"
          @click="$emit('submit', [contentHtml])"
          value="Tweet"
        />
      </div>
    </form>
    <p v-else class="font-medium leading-wide text-lg" v-html="contentHtml" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  isForm: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "https://picsum.photos/500",
  },
  handle: {
    type: String,
    default: "",
  },
  reply: {
    type: String,
    default: "",
  },
});

let showForm = ref(props.isForm);
let contentHtml = ref(props.content);

defineEmits(["submit"]);

// Find every word that starts with an @ in contentHtml.value and wrap it in a <span class="text-[#1DA1F2]"> tag.
contentHtml.value = contentHtml.value.replace(
  /@([a-zA-Z0-9_]+)/g,
  '<span class="text-[#1DA1F2]">@$1</span>'
);

const submit = () => {
  // contentHtml.value = contentHtml.value.replace(/@([a-zA-Z0-9_]+)/g, '<span class="text-[#1DA1F2]">@$1</span>')
  contentHtml.value = props.content || "";
};
</script>
