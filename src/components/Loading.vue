<script setup lang="ts">
  import { ref } from 'vue'
  import { ILog } from "../models/log.model";

  const messages = ref<Array<ILog>>([]);

  window.addEventListener("message", (event) => {
    if (event.data && event.data.message === "log_message") {
      pushMessage(event.data.log)
    }
  })

  function pushMessage(message: ILog) {
    if (messages.value.length >= 3) {
      messages.value.shift()
    }

    messages.value.push(message)
  }
</script>

<template>
  <div>
    <div v-for="(msg, index) in messages" :key="index">{{ msg }}</div>
  </div>
</template>

<style scoped>
</style>