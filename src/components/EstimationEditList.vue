<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6 border-b border-gray-300 pb-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">Estimation List</h1>
            <p class="text-sm text-gray-600 mt-1">View and manage all cost calculations</p>
          </div>
          <router-link
            to="/estimation-entry"
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            + New Estimation
          </router-link>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 shadow-lg">
          <div class="flex items-center space-x-3">
            <svg
              class="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span class="text-gray-700">Loading...</span>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white border border-gray-300 rounded shadow-sm p-4 mb-6">
        <h2 class="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">Filters</h2>

        <div class="grid grid-cols-4 gap-4">
          <!-- Category Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Category</label>
            <select
              v-model="filters.categoryId"
              @change="onCategoryFilterChange"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Subcategory Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Subcategory</label>
            <select
              v-model="filters.subcategoryId"
              @change="onSubcategoryFilterChange"
              :disabled="!filters.categoryId"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">All Subcategories</option>
              <option v-for="sub in filteredSubcategories" :key="sub._id" :value="sub._id">
                {{ sub.name }}
              </option>
            </select>
          </div>

          <!-- Spec Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Specification</label>
            <select
              v-model="filters.specId"
              :disabled="!filters.subcategoryId"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">All Specifications</option>
              <option v-for="spec in filteredSpecs" :key="spec._id" :value="spec._id">
                {{ spec.name }}
              </option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Type</label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="material">Material</option>
              <option value="subcontractor">Subcontractor</option>
            </select>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="flex items-center justify-end gap-2 mt-4">
          <button
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
          >
            Clear Filters
          </button>
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Estimations Table -->
      <div class="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100 border-b border-gray-300">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Category</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Subcategory</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Specification</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Type</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">Material</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">Labour</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">Transport</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">PMC Safety</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">Admin Cost</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">Grand Total</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(calc, index) in calculations"
                :key="calc._id"
                class="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 text-gray-600">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-gray-800">{{ getCategoryName(calc.categoryId) }}</td>
                <td class="px-4 py-3 text-gray-800">
                  {{ getSubcategoryName(calc.subcategoryId) }}
                </td>
                <td class="px-4 py-3 text-gray-800">
                  <span class="inline-block max-w-xs truncate" :title="getSpecName(calc.specId)">
                    {{ getSpecName(calc.specId) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      calc.type === 'material'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700',
                    ]"
                  >
                    {{ calc.type }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right text-gray-800">
                  ₹{{ formatNumber(calc.totalMaterialAmount) }}
                </td>
                <td class="px-4 py-3 text-right text-gray-800">
                  ₹{{ formatNumber(calc.totalLabourAmount) }}
                </td>
                <td class="px-4 py-3 text-right text-gray-800">
                  ₹{{ formatNumber(calc.transportAmount) }}
                </td>
                <td class="px-4 py-3 text-right text-gray-800">
                  ₹{{ formatNumber(calc.pmcSafetyAmount) }}
                </td>
                <td class="px-4 py-3 text-right text-gray-800">
                  ₹{{ formatNumber(calc.adminCostAmount) }}
                </td>
                <td class="px-4 py-3 text-right font-semibold text-blue-600">
                  ₹{{ formatNumber(calc.grandTotal) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="editCalculation(calc._id)"
                    class="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="calculations.length === 0 && !loading">
                <td colspan="12" class="px-4 py-12 text-center text-gray-500">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p class="text-sm">No estimations found</p>
                  <p class="text-xs text-gray-400 mt-1">
                    Try adjusting your filters or create a new estimation
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculationAPI, categoryAPI, subcategoryAPI, specAPI } from '@/services/api'

export default {
  name: 'EstimationList',

  data() {
    return {
      // Data
      calculations: [],
      categories: [],
      subcategories: [],
      specs: [],

      // Filters
      filters: {
        categoryId: '',
        subcategoryId: '',
        specId: '',
        type: '',
      },

      // UI State
      loading: false,
    }
  },

  computed: {
    filteredSubcategories() {
      if (!this.filters.categoryId) return []
      return this.subcategories.filter((sub) => sub.categoryId === this.filters.categoryId)
    },

    filteredSpecs() {
      if (!this.filters.subcategoryId) return []
      return this.specs.filter((spec) => spec.subcategoryId === this.filters.subcategoryId)
    },
  },

  methods: {
    // ==========================================
    // DATA FETCHING
    // ==========================================
    async fetchCalculations() {
      try {
        this.loading = true
        const response = await calculationAPI.getAll(this.filters)
        this.calculations = response.data
      } catch (error) {
        console.error('Error fetching calculations:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await categoryAPI.getAll()
        this.categories = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },

    async fetchSubcategories() {
      try {
        const response = await subcategoryAPI.getAll()
        this.subcategories = response.data
      } catch (error) {
        console.error('Error fetching subcategories:', error)
      }
    },

    async fetchSpecs() {
      try {
        const response = await specAPI.getAll()
        this.specs = response.data
      } catch (error) {
        console.error('Error fetching specs:', error)
      }
    },

    // ==========================================
    // FILTER METHODS
    // ==========================================
    async onCategoryFilterChange() {
      this.filters.subcategoryId = ''
      this.filters.specId = ''

      if (this.filters.categoryId) {
        try {
          const response = await subcategoryAPI.getAll(this.filters.categoryId)
          this.subcategories = response.data
        } catch (error) {
          console.error('Error fetching filtered subcategories:', error)
        }
      }
    },

    async onSubcategoryFilterChange() {
      this.filters.specId = ''

      if (this.filters.subcategoryId) {
        try {
          const response = await specAPI.getAll(this.filters.subcategoryId)
          this.specs = response.data
        } catch (error) {
          console.error('Error fetching filtered specs:', error)
        }
      }
    },

    applyFilters() {
      this.fetchCalculations()
    },

    clearFilters() {
      this.filters = {
        categoryId: '',
        subcategoryId: '',
        specId: '',
        type: '',
      }
      this.fetchCalculations()
    },

    // ==========================================
    // LOOKUP METHODS
    // ==========================================
    getCategoryName(id) {
      return this.categories.find((c) => c._id === id)?.name || 'N/A'
    },

    getSubcategoryName(id) {
      return this.subcategories.find((s) => s._id === id)?.name || 'N/A'
    },

    getSpecName(id) {
      return this.specs.find((s) => s._id === id)?.name || 'N/A'
    },

    // ==========================================
    // ACTIONS
    // ==========================================
    editCalculation(id) {
      // Navigate to edit page with query parameter
      this.$router.push({
        name: 'EstimationEdit',
        query: { id: id },
      })
    },

    // ==========================================
    // UTILITY METHODS
    // ==========================================
    formatNumber(num) {
      return (num || 0).toFixed(2)
    },
  },

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================
  async mounted() {
    await Promise.all([
      this.fetchCategories(),
      this.fetchSubcategories(),
      this.fetchSpecs(),
      this.fetchCalculations(),
    ])
  },
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
