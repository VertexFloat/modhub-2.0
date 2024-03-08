import "./style.css"
import App from "./App.vue"
import { createApp } from "vue"
import { log } from "./core/log";
import { scrapData } from "./core/data";
import { Page, getCurrentPage } from "./core/page";

function init() {
  const page: Page | null = getCurrentPage()

  if (page === null) {
    console.log("MODHUB 2.0: Current page is unsupported!")
    return
  }

  window.addEventListener("DOMContentLoaded", async () => {
    initApp(page)

    log.info("Starting scraping data")

    const [data, error] = await scrapData(page)

    if (error !== null) {
      log.error(error.message, "internal")
      return
    }

    if (data !== null) {
      log.info("Data scraped successfully!")

      window.postMessage({ message: "scraped_data", data: data })
    }
  })
}

function initApp(page: Page) {
  const root = document.createElement("div");
  root.setAttribute("id", "app");

  document.body.appendChild(root);

  createApp(App, {
    page: page
  }).mount("#app");
}

init()