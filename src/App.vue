<script setup lang="ts">
import { ref } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Loading from "./components/Loading.vue";

const isLoading = ref(true)

window.addEventListener("message", (event) => {
  if (event.data && event.data.message === "scraped_data") {
    setTimeout(() => {
      isLoading.value = false
    }, 250)
  }
})
</script>

<template>
  <Header>
    <div></div>
  </Header>
  <Loading v-if="isLoading"/>
  <Footer/>
</template>

<style scoped>
</style>