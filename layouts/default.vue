<template>
  <span>
    <nav
      class="navbar is-transparent"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <h1 class="level-item is-size-4 has-text-weight-semibold">
          <span class="icon is-small"
            ><i class="fas fa-image" aria-hidden="true"></i></span
          >Spotify Decompressed
        </h1>
      </div>
    </nav>

    <span id="main-content">
      <slot />
    </span>

    <footer class="footer">
      <div class="content has-text-centered">
        <o-field>
          <o-switch
            v-model="colorMode.preference"
            true-value="dark"
            false-value="light"
          >
            {{ colorMode.preference }}
          </o-switch>
        </o-field>
        <p>
          <strong>Spotify Decompressed</strong> by
          <NuxtLink to="https://github.com/gosferano">gosferano</NuxtLink>
        </p>
        <p>
          <NuxtLink
            to="https://github.com/gosferano/spotify-decompressed"
            target="blank"
          >
            <o-icon icon="github"> </o-icon>
          </NuxtLink>
        </p>
      </div>
    </footer>
  </span>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script>
