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
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">Grand Total</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-700">Actions</th>
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
                <td class="px-4 py-3 text-gray-800">{{ getSpecName(calc.specId) }}</td>
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
                  ₹{{ formatNumber(getMaterialAmount(calc)) }}
                </td>
                <td class="px-4 py-3 text-right text-gray-800">
                  ₹{{ formatNumber(calc.labourAmount) }}
                </td>
                <td class="px-4 py-3 text-right text-gray-800">
                  ₹{{ formatNumber(calc.transportAmount) }}
                </td>
                <td class="px-4 py-3 text-right text-gray-800">
                  ₹{{ formatNumber(calculatePMCSafety(calc)) }}
                </td>
                <td class="px-4 py-3 text-right font-semibold text-blue-600">
                  ₹{{ formatNumber(calculateGrandTotal(calc)) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="viewCalculation(calc)"
                      class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="View Details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteCalculation(calc._id)"
                      class="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="calculations.length === 0 && !loading">
                <td colspan="11" class="px-4 py-12 text-center text-gray-500">
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

    <!-- View Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-300 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Estimation Details</h3>
            <button @click="closeDetailsModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="selectedCalculation" class="p-6">
          <!-- Basic Information -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Basic Information
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Category:</span>
                <span class="ml-2 font-medium text-gray-800">{{
                  getCategoryName(selectedCalculation.categoryId)
                }}</span>
              </div>
              <div>
                <span class="text-gray-600">Subcategory:</span>
                <span class="ml-2 font-medium text-gray-800">{{
                  getSubcategoryName(selectedCalculation.subcategoryId)
                }}</span>
              </div>
              <div>
                <span class="text-gray-600">Specification:</span>
                <span class="ml-2 font-medium text-gray-800">{{
                  getSpecName(selectedCalculation.specId)
                }}</span>
              </div>
              <div>
                <span class="text-gray-600">Type:</span>
                <span
                  :class="[
                    'ml-2 px-2 py-1 rounded text-xs font-medium',
                    selectedCalculation.type === 'material'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700',
                  ]"
                >
                  {{ selectedCalculation.type }}
                </span>
              </div>
            </div>
          </div>

          <!-- Material Line Items -->
          <div
            v-if="
              selectedCalculation.materialCalculationMode === 'calculated' &&
              selectedCalculation.materialLines?.length > 0
            "
            class="mb-6"
          >
            <h4 class="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Material Line Items
            </h4>
            <div class="border border-gray-300 rounded overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700">Material</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-700">Quantity</th>
                    <th class="px-3 py-2 text-center text-xs font-medium text-gray-700">UOM</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-700">Rate</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(line, index) in selectedCalculation.materialLines"
                    :key="index"
                    class="border-b border-gray-200"
                  >
                    <td class="px-3 py-2 text-gray-800">{{ line.name }}</td>
                    <td class="px-3 py-2 text-right text-gray-800">{{ line.quantity }}</td>
                    <td class="px-3 py-2 text-center text-gray-800">{{ line.uom }}</td>
                    <td class="px-3 py-2 text-right text-gray-800">₹{{ line.rate.toFixed(2) }}</td>
                    <td class="px-3 py-2 text-right font-medium text-gray-800">
                      ₹{{ (line.quantity * line.rate).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Cost Summary -->
          <div class="bg-gray-50 border border-gray-200 rounded p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Cost Summary
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">
                  Material
                  {{
                    selectedCalculation.materialCalculationMode === 'manual'
                      ? '(Manual):'
                      : '(Calculated):'
                  }}
                </span>
                <span class="font-medium text-gray-800"
                  >₹{{ formatNumber(getMaterialAmount(selectedCalculation)) }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Labour:</span>
                <span class="font-medium text-gray-800"
                  >₹{{ formatNumber(selectedCalculation.labourAmount) }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Transport:</span>
                <span class="font-medium text-gray-800"
                  >₹{{ formatNumber(selectedCalculation.transportAmount) }}</span
                >
              </div>
              <div class="border-t border-gray-300 pt-2 flex justify-between">
                <span class="text-gray-600"
                  >PMC Safety ({{ selectedCalculation.pmcSafetyPercentage }}%):</span
                >
                <span class="font-medium text-gray-800"
                  >₹{{ formatNumber(calculatePMCSafety(selectedCalculation)) }}</span
                >
              </div>
              <div class="border-t border-gray-300 mt-3 pt-3 flex justify-between">
                <span class="font-semibold text-gray-800">Grand Total:</span>
                <span class="font-bold text-lg text-blue-600"
                  >₹{{ formatNumber(calculateGrandTotal(selectedCalculation)) }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-300 px-6 py-4 flex justify-end">
          <button
            @click="closeDetailsModal"
            class="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
          >
            Close
          </button>
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
      showDetailsModal: false,
      selectedCalculation: null,
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
    // CALCULATION METHODS
    // ==========================================
    getMaterialAmount(calc) {
      if (calc.materialCalculationMode === 'manual') {
        return calc.manualMaterialAmount || 0
      }
      return (
        calc.materialLines?.reduce(
          (sum, line) => sum + (line.quantity || 0) * (line.rate || 0),
          0,
        ) || 0
      )
    },

    calculatePMCSafety(calc) {
      const subtotal =
        this.getMaterialAmount(calc) + (calc.labourAmount || 0) + (calc.transportAmount || 0)
      return (subtotal * (calc.pmcSafetyPercentage || 0)) / 100
    },

    calculateGrandTotal(calc) {
      const subtotal =
        this.getMaterialAmount(calc) + (calc.labourAmount || 0) + (calc.transportAmount || 0)
      return subtotal + this.calculatePMCSafety(calc)
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
    viewCalculation(calc) {
      this.selectedCalculation = calc
      this.showDetailsModal = true
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedCalculation = null
    },

    async deleteCalculation(id) {
      if (!confirm('Are you sure you want to delete this estimation?')) return

      try {
        this.loading = true
        await calculationAPI.delete(id)
        await this.fetchCalculations()
      } catch (error) {
        console.error('Error deleting calculation:', error)
        alert('Failed to delete estimation')
      } finally {
        this.loading = false
      }
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
