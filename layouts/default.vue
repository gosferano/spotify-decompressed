<template>
  <span>
    <nav
      class="header is-vcentered"
      role="navigation"
      aria-label="main navigation"
    >
      <level>
        <h1 class="level-item is-size-4 has-text-weight-semibold">
          <span class="icon is-small"
            ><i class="fas fa-image" aria-hidden="true"></i></span
          >Spotify Decompressed
        </h1>
        <o-field class="level-item">
          <o-switch
            v-model="colorMode.preference"
            true-value="dark"
            false-value="light"
          >
            {{ colorMode.preference }}
          </o-switch>
        </o-field>
      </level>
    </nav>
    <slot />
  </span>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script>
