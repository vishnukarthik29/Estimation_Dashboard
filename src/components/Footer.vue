<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-3">
        <!-- Left -->
        <div class="text-sm text-gray-600">© {{ currentYear }} Contributions by</div>

        <!-- Center Links -->

        <!-- Right Icons -->
        <div class="flex items-center gap-3 text-gray-600">
          <p>Pugal</p>
          <p>VK</p>
          <p>Chandru</p>
          <p>Naveen</p>
          <p>Nithish</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
