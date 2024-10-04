<template>
  <header class="absolute inset-x-0 top-0">
    <nav class="mx-auto flex max-w-7xl items-center justify-center p-6 lg:px-8" aria-label="Global">
      <div class="flex items-center gap-x-3">
        <a href="" class="-m-1.5 p-1.5">
          <object class="h-8 w-auto pointer-events-none" :data="logoImage" type="image/svg+xml"></object>
        </a>
        <!-- <span class="text-lg font-extralight text-gray-600">sleep&me</span> -->
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      logoImage: require('../assets/logo.svg'),
    }
  },
  methods: {},
}
</script>