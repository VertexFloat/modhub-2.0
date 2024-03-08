<template>
  <div class="header-container">
    <img class="farming-logo" src="https://www.farming-simulator.com/img/page/logo-main_en.png" alt="Farming Simulator logo"/>

    <div class="header-links-container">
      <a class="header-link" href="/about">GAMES</a>
      <a class="header-link" href="/about">DLC</a>
      <a class="header-link" href="/about">BLOG</a>
      <a class="header-link" href="/about">FORUM</a>
      <a class="header-link" href="/about">MODS</a>
      <a class="header-link" href="/about">TUTORIALS</a>
      <a class="header-link login-link" href="/login">LOGIN</a>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--color-background3);
}
.header-container .header-link:not(:nth-last-child(1)):after {
  content: "·";
  margin: 0 8px;
}
.farming-logo {
  max-width: 252px;
  max-height: 50px;
}
.header-links-container {
  display: flex;
}
.header-link {
  font-size: 18px;
  font-weight: 400;
}
.login-link {
  color: var(--color-accent)
}
</style>