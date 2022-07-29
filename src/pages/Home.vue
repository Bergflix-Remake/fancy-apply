<template>
  <main
    class="
      text-neutral-600 text-lg
      w-full
      h-full
      min-h-screen
      flex flex-col
      items-center
      justify-center
      bg-neutral-100
      text-center
    "
  >
    <h2 class="font-bold text-[#000000] text-5xl mb-5">
      Bergflix<span class="text-[#FF0230]">.</span>
    </h2>
    <h1 class="text-2xl font-black text-neutral-800">
      Willkommen bei deiner Bewerbung!
    </h1>
    <div class="max-w-md" v-if="session.isSuccess">
      <p>
        Hallo {{ session.data.name }}! Willkommen bei deiner Bewerbung als
        Teammitglied im Bereich
        {{ session.data.field?.name }}.<br />
        {{ session.data.field?.description }}
      </p>
      <p v-if="session.data.completed" class="text-amber-500 mb-10">
        Du hast bereits eine Antwort abgegeben. Wenn du das Formular neu
        abschickst, wird deine bisherige Antwort überschrieben.
      </p>
      <router-link
        class="p-2 bg-[#FF0230] rounded-md shadow-lg text-white mt-5"
        :to="`/${session.data.identifier}/tasks`"
        >Formular starten</router-link
      >
    </div>
    <p v-else class="max-w-md">
      Hier kannst du dich fürs Team von Bergflix bewerben. Bitte melde dich auf
      dem Discord, dort wirst du einen personalisierten Link bekommen.
    </p>
  </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useStrapiSession } from "../main";

const route = useRoute()

const identifier = String(route.params.identifier)
const session = useStrapiSession([identifier])
</script>