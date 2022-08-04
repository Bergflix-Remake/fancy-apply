<template>
  <main v-if="tasks.isSuccess" class="flex flex-col items-center justify-start w-full h-full min-h-screen lg:flex-row">
    <div id="task" class="flex flex-col items-center justify-center min-h-screen text-center lg:w-1/2">
      <h1 class="text-xl font-bold text-neutral-800">
        {{ task.attributes?.title }} ({{ index + 1 }}/{{ tasks.data?.length }})
      </h1>
      <p class="max-w-md text-md text-neutral-600">
        {{ task.attributes?.description }}
      </p>
      <p v-if="index + 1 == tasks.data?.length" class="text-green-500">
        Nach dem Beantworten dieser Frage wird das Formular abgeschickt.
      </p>
      <button @click="
        index = 0;
      tasks.refetch();
      " class="p-2 mt-10 text-white bg-red-500 rounded-full shadow-md hover:bg-red-700">
        Vom Anfang neustarten
      </button>
    </div>
    <Thread>
      <TransitionGroup name="list">
        <div v-for="item in task.attributes?.items" :key="item?.id" class="flex items-center justify-center w-full">
          <Image v-if="item?.__component == 'application.image'" :src="item.src" :alt="item.alt" />
          <Codesnippet v-if="item?.__component == 'application.codeblock'" :filename="item.filename"
            :content="item.content" :is-form="item.editable" @submit="handleSubmit" />
          <Tweet v-if="item?.__component == 'application.tweet'" :is-form="false" :avatar="item.avatar"
            :handle="item.handle" :username="item.username" :content="item.content" />
        </div>
      </TransitionGroup>
      <Tweet v-if="session.data?.field?.id == 1" @submit="handleSubmit" :is-form="true"
        avatar="https://cdn.bergflix.de/logo/light_bg.png" username="Bergflix." handle="BergflixToGo" />
    </Thread>
  </main>
  <div v-else-if="tasks.isLoading" class="flex flex-col items-center justify-center w-full min-h-screen">
    <h1 class="text-indigo-500 animate-pulse">Loading...</h1>
    <p class="cursor-pointer delay text-lime-500" @click="tasks.refetch()">
      Es scheint als würde das länger dauern als erwartet... Klicke
      <span class="font-bold underline">hier</span> um es noch einmal zu versuchen.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Thread from "../components/Thread.vue";
import Tweet from "../components/Tweet.vue";
import Codesnippet from "../components/Codesnippet.vue";

import { useStrapi, useStrapiSession, useStrapiMutation, strapi } from "../main";
import { ApplicationQuestionEntity, ApplicationSession } from "../models/types";
import { useStore } from "vuex";
import Image from "../components/atoms/Image/Image.vue";

const route = useRoute();
const router = useRouter();

const index = ref(0);
const task: Ref<ApplicationQuestionEntity> = ref({});
const store = useStore();

const identifier = String(route.params.identifier);
const session = useStrapiSession([identifier]);

const resetTask = () => {
  task.value = {};
  console.log("task", tasks.data![index.value], index.value);
  task.value = tasks.data![index.value];
};

const tasks = useStrapi<ApplicationQuestionEntity[]>(
  [
    "application-questions",
    {
      populate: "*",
      filters: {
        field: {
          id: computed(() => session.data?.field?.id),
        },
      },
    },
  ],
  {
    enabled: computed(() => !!session.data?.field?.id),
    onSuccess: (data) => {
      console.log("task", tasks.data![index.value], index.value);
      task.value = data[index.value];
    },
  }
);

const handleSubmit = (data: any) => {
  console.log("Saving data for index", index.value, "\n", data);
  store.commit("setFormData", {
    [tasks.data![index.value].attributes!.title]: data,
  });
  console.log("Last task?", index.value + 1 == tasks.data?.length);
  if (index.value + 1 == tasks.data!.length) {
    strapi.request("PUT", "/current-session", {
      data: {
        identifier: identifier,
        data: {
          response: store.state.formData,
          completed: true,
        },
      },
    });
    router.push(`/${identifier}/done`);
  } else {
    index.value++;
    resetTask();
  }
  tasks.refetch();
};
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.delay {
  opacity: 1;
  animation: fadein 5s steps(1);
}

@keyframes fadein {
  from {
    opacity: 0;
    cursor: default;
  }

  to {
    opacity: 1;
  }
}
</style>
