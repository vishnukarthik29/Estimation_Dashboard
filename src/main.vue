<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderComponent />
    <main class="min-h-[calc(100vh-73px)]">
      <router-view />
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue'
import FooterComponent from '@/components/Footer.vue'

export default {
  name: 'MainLayout',
  components: {
    HeaderComponent,
    FooterComponent,
  },
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
