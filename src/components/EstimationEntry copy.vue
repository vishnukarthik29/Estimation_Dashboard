<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 border-b border-gray-300 pb-4">
        <h1 class="text-2xl font-semibold text-gray-800">Procurement Console</h1>
        <p class="text-sm text-gray-600 mt-1">Category Management & Cost Calculator</p>
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

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
      >
        <div class="flex justify-between items-center">
          <span>{{ errorMessage }}</span>
          <button @click="errorMessage = ''" class="text-red-700 hover:text-red-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative"
      >
        <div class="flex justify-between items-center">
          <span>{{ successMessage }}</span>
          <button @click="successMessage = ''" class="text-green-700 hover:text-green-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <!-- Main Console -->
      <div class="bg-white border border-gray-300 rounded shadow-sm p-6">
        <!-- Cascading Dropdowns Section -->
        <div class="mb-8">
          <h2 class="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
            Catalog Structure
          </h2>

          <div class="grid grid-cols-3 gap-4">
            <!-- Category Dropdown -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Category</label>
              <div class="flex gap-2">
                <select
                  v-model="selectedCategory"
                  @change="onCategoryChange"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                    {{ cat.name }}
                  </option>
                </select>
                <button
                  @click="showAddDialog('category')"
                  class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  <svg
                    class="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Subcategory Dropdown -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Subcategory</label>
              <div class="flex gap-2">
                <select
                  v-model="selectedSubcategory"
                  @change="onSubcategoryChange"
                  :disabled="!selectedCategory"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Subcategory</option>
                  <option v-for="sub in filteredSubcategories" :key="sub._id" :value="sub._id">
                    {{ sub.name }}
                  </option>
                </select>
                <button
                  @click="showAddDialog('subcategory')"
                  :disabled="!selectedCategory"
                  class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    class="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Specs Dropdown -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Specification</label>
              <div class="flex gap-2">
                <select
                  v-model="selectedSpec"
                  :disabled="!selectedSubcategory"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Spec</option>
                  <option
                    v-for="spec in filteredSpecs"
                    :key="spec._id"
                    :value="spec._id"
                    :title="spec.name"
                  >
                    <!-- {{ spec.name }} -->
                    {{ spec.name.length > 40 ? spec.name.slice(0, 40) + '…' : spec.name }}
                  </option>
                </select>
                <button
                  @click="showAddDialog('spec')"
                  :disabled="!selectedSubcategory"
                  class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    class="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Selected Spec Full Name -->
        <div v-if="selectedSpecObject" class="mt-2 text-xs text-gray-600">
          <span class="font-medium text-gray-700">Selected Spec:</span>
          <span class="ml-1">{{ selectedSpecObject.name }}</span>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-6"></div>

        <!-- Cost Calculation Section -->
        <div>
          <h2 class="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
            Cost Calculation
          </h2>

          <!-- Material / Subcontractor Toggle -->
          <div class="mb-6">
            <label class="block text-xs font-medium text-gray-600 mb-2">Type</label>
            <div class="flex gap-3">
              <button
                @click="setType('material')"
                :class="[
                  'px-6 py-2 border rounded text-sm font-medium transition',
                  calculationType === 'material'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                ]"
              >
                Material
              </button>
              <button
                @click="setType('subcontractor')"
                :class="[
                  'px-6 py-2 border rounded text-sm font-medium transition',
                  calculationType === 'subcontractor'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                ]"
              >
                Subcontractor
              </button>
            </div>
          </div>

          <!-- Material Calculation Mode -->
          <div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <label class="block text-xs font-medium text-gray-600 mb-2"
              >Material Calculation Mode</label
            >
            <div class="flex gap-4">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="materialCalculationMode"
                  value="calculated"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Calculate from Line Items</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="materialCalculationMode"
                  value="manual"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Manual Entry</span>
              </label>
            </div>
          </div>

          <!-- Manual Material Amount Input -->
          <div v-if="materialCalculationMode === 'manual'" class="mb-6">
            <label class="block text-xs font-medium text-gray-600 mb-2">Material Amount</label>
            <input
              type="number"
              v-model.number="manualMaterialAmount"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <!-- Material Line Items -->
          <div v-if="materialCalculationMode === 'calculated'" class="mb-6">
            <div class="flex justify-between items-center mb-3">
              <label class="block text-xs font-medium text-gray-600">Material Line Items</label>
              <button
                @click="addMaterialLine"
                class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
              >
                + Add Material
              </button>
            </div>

            <!-- Material Table -->
            <div class="border border-gray-300 rounded overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[30%]">
                      Material Name
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[15%]">
                      Quantity
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[15%]">
                      UOM
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[20%]">
                      Rate
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[15%]">
                      Amount
                    </th>
                    <th class="px-3 py-2 w-[5%]"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(line, index) in materialLines"
                    :key="index"
                    class="border-b border-gray-200"
                  >
                    <td class="px-3 py-2">
                      <input
                        type="text"
                        v-model="line.name"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter material name"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input
                        type="number"
                        v-model.number="line.quantity"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <select
                        v-model="line.uom"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Kg">Kg</option>
                        <option value="Ton">Ton</option>
                        <option value="Bag">Bag</option>
                        <option value="Nos">Nos</option>
                        <option value="Sqm">Sqm</option>
                        <option value="Cum">Cum</option>
                        <option value="Rmt">Rmt</option>
                        <option value="Ltr">Ltr</option>
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <input
                        type="number"
                        v-model.number="line.rate"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <span class="text-gray-800 font-medium"
                        >₹{{ lineAmount(line).toFixed(2) }}</span
                      >
                    </td>
                    <td class="px-3 py-2 text-center">
                      <button
                        @click="removeMaterialLine(index)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="materialLines.length === 0">
                    <td colspan="6" class="px-3 py-6 text-center text-gray-500 text-sm">
                      No materials added. Click "+ Add Material" to begin.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Total Materials -->
            <div class="mt-2 flex justify-end">
              <div class="text-sm">
                <span class="text-gray-600">Total Materials: </span>
                <span class="font-semibold text-gray-800"
                  >₹{{ totalMaterialAmount.toFixed(2) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Cost Inputs -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Labour Amount</label>
              <input
                type="number"
                v-model.number="labourAmount"
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Transport Amount</label>
              <input
                type="number"
                v-model.number="transportAmount"
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">PMC Safety (%)</label>
              <input
                type="number"
                v-model.number="pmcSafetyPercentage"
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <!-- Calculation Summary -->
          <div class="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 class="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">Summary</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">
                  {{
                    materialCalculationMode === 'calculated'
                      ? 'Total Materials (Calculated):'
                      : 'Material Amount (Manual):'
                  }}
                </span>
                <span class="font-medium text-gray-800">₹{{ totalMaterialAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Labour:</span>
                <span class="font-medium text-gray-800">₹{{ labourAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Transport:</span>
                <span class="font-medium text-gray-800">₹{{ transportAmount.toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-300 pt-2 flex justify-between text-xs text-gray-500">
                <span>Subtotal (for PMC Safety calc):</span>
                <span>₹{{ subtotalForPMC.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">PMC Safety ({{ pmcSafetyPercentage }}%):</span>
                <span class="font-medium text-gray-800">₹{{ pmcSafetyAmount.toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-300 mt-3 pt-3 flex justify-between">
                <span class="font-semibold text-gray-800">Grand Total:</span>
                <span class="font-bold text-lg text-blue-600">₹{{ grandTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="mt-6 flex justify-end">
            <button
              @click="saveCalculation"
              :disabled="!canSaveCalculation"
              class="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Calculation
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Entry Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-white/10"
    >
      <div class="bg-white rounded shadow-lg w-96 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Add New {{ dialogType }}</h3>
        <input
          v-model="newEntryName"
          @keyup.enter="addNewEntry"
          class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
          :placeholder="`Enter ${dialogType} name`"
          autofocus
        />
        <div class="flex justify-end gap-2">
          <button
            @click="closeDialog"
            class="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="addNewEntry"
            :disabled="!newEntryName.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { categoryAPI, subcategoryAPI, specAPI, calculationAPI } from '@/services/api'

export default {
  name: 'ProcurementConsole',

  data() {
    return {
      // Data from backend
      categories: [],
      subcategories: [],
      specs: [],

      // Current cascade selections
      selectedCategory: '',
      selectedSubcategory: '',
      selectedSpec: '',

      // Calculation state
      calculationType: 'material',
      materialCalculationMode: 'calculated',
      manualMaterialAmount: 0,
      materialLines: [],
      labourAmount: 0,
      transportAmount: 0,
      pmcSafetyPercentage: 0,

      // Dialog state
      showDialog: false,
      dialogType: '',
      newEntryName: '',

      // UI state
      loading: false,
      errorMessage: '',
      successMessage: '',
    }
  },

  computed: {
    filteredSubcategories() {
      console.log(this.selectedCategory)
      if (!this.selectedCategory) return []
      return this.subcategories.filter((sub) => sub.categoryId === this.selectedCategory)
    },

    filteredSpecs() {
      if (!this.selectedSubcategory) return []
      return this.specs.filter((spec) => spec.subcategoryId === this.selectedSubcategory)
    },

    totalMaterialAmount() {
      if (this.materialCalculationMode === 'manual') {
        return this.manualMaterialAmount
      }
      return this.materialLines.reduce((sum, line) => sum + this.lineAmount(line), 0)
    },

    subtotalForPMC() {
      return this.totalMaterialAmount + this.labourAmount + this.transportAmount
    },

    pmcSafetyAmount() {
      return (this.subtotalForPMC * this.pmcSafetyPercentage) / 100
    },

    grandTotal() {
      return this.subtotalForPMC + this.pmcSafetyAmount
    },

    canSaveCalculation() {
      return this.selectedCategory && this.selectedSubcategory && this.selectedSpec
    },
    selectedSpecObject() {
      return this.specs.find((s) => s._id === this.selectedSpec) || null
    },
  },

  methods: {
    // ==========================================
    // DATA FETCHING
    // ==========================================
    async fetchCategories() {
      try {
        this.loading = true
        const response = await categoryAPI.getAll()
        this.categories = response.data
      } catch (error) {
        this.showError('Failed to load categories')
        console.error('Error fetching categories:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchSubcategories() {
      try {
        const response = await subcategoryAPI.getAll()
        this.subcategories = response.data
      } catch (error) {
        this.showError('Failed to load subcategories')
        console.error('Error fetching subcategories:', error)
      }
    },

    async fetchSpecs() {
      try {
        const response = await specAPI.getAll()
        this.specs = response.data
      } catch (error) {
        this.showError('Failed to load specifications')
        console.error('Error fetching specs:', error)
      }
    },

    // ==========================================
    // CASCADE HANDLERS
    // ==========================================
    async onCategoryChange() {
      this.selectedSubcategory = ''
      this.selectedSpec = ''

      // Optionally fetch filtered subcategories
      if (this.selectedCategory) {
        try {
          const response = await subcategoryAPI.getAll(this.selectedCategory)
          this.subcategories = response.data
          console.log('This subcateogires', this.subcategories)
        } catch (error) {
          console.error('Error fetching filtered subcategories:', error)
        }
      }
    },

    async onSubcategoryChange() {
      this.selectedSpec = ''

      // Optionally fetch filtered specs
      if (this.selectedSubcategory) {
        try {
          const response = await specAPI.getAll(this.selectedSubcategory)
          this.specs = response.data
        } catch (error) {
          console.error('Error fetching filtered specs:', error)
        }
      }
    },

    // ==========================================
    // CALCULATION METHODS
    // ==========================================
    setType(type) {
      this.calculationType = type
    },

    addMaterialLine() {
      this.materialLines.push({
        name: '',
        quantity: 0,
        uom: '',
        rate: 0,
      })
    },

    removeMaterialLine(index) {
      this.materialLines.splice(index, 1)
    },

    lineAmount(line) {
      return (line.quantity || 0) * (line.rate || 0)
    },

    async saveCalculation() {
      if (!this.canSaveCalculation) {
        this.showError('Please select Category, Subcategory, and Specification')
        return
      }

      try {
        this.loading = true

        const calculationData = {
          categoryId: this.selectedCategory,
          subcategoryId: this.selectedSubcategory,
          specId: this.selectedSpec,
          type: this.calculationType,
          materialCalculationMode: this.materialCalculationMode,
          manualMaterialAmount: this.manualMaterialAmount,
          materialLines: this.materialLines,
          labourAmount: this.labourAmount,
          transportAmount: this.transportAmount,
          pmcSafetyPercentage: this.pmcSafetyPercentage,
        }

        const response = await calculationAPI.create(calculationData)

        if (response.success) {
          this.showSuccess('Calculation saved successfully!')
          // Optionally reset the form
          this.resetCalculationForm()
        }
      } catch (error) {
        this.showError(error.response?.data?.message || 'Failed to save calculation')
        console.error('Error saving calculation:', error)
      } finally {
        this.loading = false
      }
    },

    // ==========================================
    // DIALOG METHODS
    // ==========================================
    showAddDialog(type) {
      this.dialogType = type
      this.showDialog = true
      this.newEntryName = ''
    },

    closeDialog() {
      this.showDialog = false
      this.newEntryName = ''
    },

    async addNewEntry() {
      const name = this.newEntryName.trim()
      if (!name) return

      try {
        this.loading = true

        if (this.dialogType === 'category') {
          const response = await categoryAPI.create({ name })
          if (response.success) {
            this.categories.push(response.data)
            this.showSuccess('Category added successfully')
          }
        } else if (this.dialogType === 'subcategory') {
          const response = await subcategoryAPI.create({
            name,
            categoryId: this.selectedCategory,
          })
          if (response.success) {
            this.subcategories.push(response.data)
            this.showSuccess('Subcategory added successfully')
          }
        } else if (this.dialogType === 'spec') {
          const response = await specAPI.create({
            name,
            subcategoryId: this.selectedSubcategory,
          })
          if (response.success) {
            this.specs.push(response.data)
            this.showSuccess('Specification added successfully')
          }
        }

        this.closeDialog()
      } catch (error) {
        this.showError(error.response?.data?.message || `Failed to add ${this.dialogType}`)
        console.error(`Error adding ${this.dialogType}:`, error)
      } finally {
        this.loading = false
      }
    },

    // ==========================================
    // UTILITY METHODS
    // ==========================================
    showError(message) {
      this.errorMessage = message
      setTimeout(() => {
        this.errorMessage = ''
      }, 5000)
    },

    showSuccess(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
    },

    resetCalculationForm() {
      this.materialCalculationMode = 'calculated'
      this.manualMaterialAmount = 0
      this.materialLines = []
      this.labourAmount = 0
      this.transportAmount = 0
      this.pmcSafetyPercentage = 0
    },
  },

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================
  async mounted() {
    // Fetch initial data from backend
    await Promise.all([this.fetchCategories(), this.fetchSubcategories(), this.fetchSpecs()])
  },
}
</script>

<style scoped>
/* Additional custom styles if needed beyond Tailwind */
</style>
