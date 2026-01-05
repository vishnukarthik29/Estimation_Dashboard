<template>
  <header class="bg-white border-b border-gray-300 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo/Brand -->
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-semibold text-gray-800">Procurement System</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center space-x-6">
          <router-link
            to="/estimation-entry"
            class="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            active-class="text-blue-600"
          >
            Estimation Entry
          </router-link>
          <router-link
            to="/estimation-list"
            class="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            active-class="text-blue-600"
          >
            Estimation List
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
