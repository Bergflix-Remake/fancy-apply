<template>
  <div
    class="flex flex-col lg:w-3/4 w-full p-5 bg-[#282c34] shadow-lg rounded-md space-y-4"
  >
    <div class="flex flex-row justify-start p-1 space-x-2">
      <div class="mr-auto flex flex-row space-x-2 justify-center">
        <svg
          @click="handleSubmit"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-neutral-400 hover:text-green-300 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          v-if="isForm"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3"
          />
        </svg>
        <h1 class="text-sm text-neutral-400 text-italic">{{ filename }}</h1>
      </div>
      <div class="ml-auto flex flex-row space-x-2">
        <div class="w-4 shadow-sm h-4 aspect-square rounded-full bg-yellow-500"></div>
        <div class="w-4 shadow-sm h-4 aspect-square rounded-full bg-green-500"></div>
        <div class="w-4 shadow-sm h-4 aspect-square rounded-full bg-red-500"></div>
      </div>
    </div>
    <Editor
      height="25vh"
      theme="vs-dark"
      :value="text"
      language="html"
      class-name="rounded-md"
      @mount="(editor) => (monacoRef = editor)"
      @update:value="(value) => (text = value as string)"
      :options="{ readOnly: !isForm }"
    />
    <Transition name="note">
      <p class="text-amber-400 animate-pulse">
        {{
          text != content
            ? isForm
              ? "Um die Aufgabe zu beenden, klicke auf das icon neben dem Dateinamen."
              : ""
            : ""
        }}
      </p>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import Editor from "@guolao/vue-monaco-editor";
import { defineProps, Ref, ref, watch } from "vue";
const emit = defineEmits(["submit"]);
const props = defineProps({
  isForm: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: "",
  },
  filename: {
    type: String,
    default: "",
  },
});

const text: Ref<string> = ref(props.content || "");
const monacoRef = ref();
watch(monacoRef, (v, o, c) => {});
const handleSubmit = () => {
  if (!monacoRef.value) return;
  console.log("Submitting with this data: \n", text.value);
  emit("submit", [text.value]);
};
</script>

<style>
.note-enter-from,
.note-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.note-enter-active,
.note-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}
</style>
