<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 border-b border-gray-300 pb-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">Edit Calculation</h1>
            <p class="text-sm text-gray-600 mt-1">Modify rates and quantities</p>
          </div>
          <button
            @click="goBack"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm"
          >
            ← Back
          </button>
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

      <!-- Main Content -->
      <div v-if="calculation" class="bg-white border border-gray-300 rounded shadow-sm p-6">
        <!-- Load Rates Panel -->

        <!-- Calculation Info -->
        <div class="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h2 class="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
            Current Calculation Details
          </h2>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Category:</span>
              <span class="ml-2 font-medium text-gray-800">{{
                calculation.categoryId.name || 'N/A'
              }}</span>
            </div>
            <div>
              <span class="text-gray-600">Subcategory:</span>
              <span class="ml-2 font-medium text-gray-800">{{
                calculation.subcategoryId?.name || 'N/A'
              }}</span>
            </div>
            <div>
              <span class="text-gray-600">Specification:</span>
              <span class="ml-2 font-medium text-gray-800">{{
                calculation.specId?.name || 'N/A'
              }}</span>
            </div>
          </div>
          <div class="mt-2 text-sm">
            <span class="text-gray-600">Type:</span>
            <span class="ml-2 font-medium text-gray-800 capitalize">{{ calculation.type }}</span>
          </div>
        </div>

        <!-- Material Section -->
        <div class="mb-8">
          <h2 class="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
            Material Cost
          </h2>

          <!-- Material Mode Toggle -->
          <div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <label class="block text-xs font-medium text-gray-600 mb-2"
              >Material Calculation Mode</label
            >
            <div class="flex gap-4">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="calculation.materialCalculationMode"
                  value="calculated"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Calculate from Line Items</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="calculation.materialCalculationMode"
                  value="manual"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Manual Entry</span>
              </label>
            </div>
          </div>

          <!-- Manual Material Input -->
          <div v-if="calculation.materialCalculationMode === 'manual'" class="mb-6">
            <label class="block text-xs font-medium text-gray-600 mb-2">Material Amount</label>
            <input
              type="number"
              v-model.number="calculation.manualMaterialAmount"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <!-- Material Line Items -->
          <div v-if="calculation.materialCalculationMode === 'calculated'">
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
                    v-for="(line, index) in calculation.materialLines"
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
                        <option value="Sqft">Sqft</option>
                        <option value="Sqm">Sqm</option>
                        <option value="Cum">Cum</option>
                        <option value="Rft">Rft</option>
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
                        >₹{{ calculateLineAmount(line).toFixed(2) }}</span
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
                  <tr v-if="calculation.materialLines.length === 0">
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
                  >₹{{ calculatedMaterialTotal.toFixed(2) }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-6"></div>

        <!-- Labour Section -->
        <div class="mb-8">
          <h2 class="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
            Labour Cost
          </h2>

          <!-- Labour Mode Toggle -->
          <div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <label class="block text-xs font-medium text-gray-600 mb-2"
              >Labour Calculation Mode</label
            >
            <div class="flex gap-4">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="calculation.labourCalculationMode"
                  value="calculated"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Calculate from Line Items</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="calculation.labourCalculationMode"
                  value="manual"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Manual Entry</span>
              </label>
            </div>
          </div>

          <!-- Manual Labour Input -->
          <div v-if="calculation.labourCalculationMode === 'manual'" class="mb-6">
            <label class="block text-xs font-medium text-gray-600 mb-2">Labour Amount</label>
            <input
              type="number"
              v-model.number="calculation.manualLabourAmount"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <!-- Labour Line Items -->
          <div v-if="calculation.labourCalculationMode === 'calculated'">
            <div class="flex justify-between items-center mb-3">
              <label class="block text-xs font-medium text-gray-600">Labour Line Items</label>
              <button
                @click="addLabourLine"
                class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
              >
                + Add Labour
              </button>
            </div>

            <!-- Labour Table -->
            <div class="border border-gray-300 rounded overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[40%]">
                      Description
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[20%]">
                      Quantity
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
                    v-for="(line, index) in calculation.labourLines"
                    :key="index"
                    class="border-b border-gray-200"
                  >
                    <td class="px-3 py-2">
                      <input
                        type="text"
                        v-model="line.description"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter description"
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
                        >₹{{ calculateLabourLineAmount(line).toFixed(2) }}</span
                      >
                    </td>
                    <td class="px-3 py-2 text-center">
                      <button
                        @click="removeLabourLine(index)"
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
                  <tr v-if="calculation.labourLines.length === 0">
                    <td colspan="5" class="px-3 py-6 text-center text-gray-500 text-sm">
                      No labour items added. Click "+ Add Labour" to begin.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Total Labour -->
            <div class="mt-2 flex justify-end">
              <div class="text-sm">
                <span class="text-gray-600">Total Labour: </span>
                <span class="font-semibold text-gray-800"
                  >₹{{ calculatedLabourTotal.toFixed(2) }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-6"></div>

        <!-- Other Costs -->
        <div class="mb-8">
          <h2 class="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
            Additional Costs
          </h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Transport Amount</label>
              <input
                type="number"
                v-model.number="calculation.transportAmount"
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
                v-model.number="calculation.pmcSafetyPercentage"
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2"
                >Administrative Cost (%)</label
              >
              <input
                type="number"
                v-model.number="calculation.adminCostPercentage"
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-6"></div>

        <!-- Summary -->
        <div class="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
          <h3 class="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
            Updated Summary
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">
                {{
                  calculation.materialCalculationMode === 'calculated'
                    ? 'Total Materials (Calculated):'
                    : 'Material Amount (Manual):'
                }}
              </span>
              <span class="font-medium text-gray-800"
                >₹{{ calculatedMaterialTotal.toFixed(2) }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">
                {{
                  calculation.labourCalculationMode === 'calculated'
                    ? 'Total Labour (Calculated):'
                    : 'Labour Amount (Manual):'
                }}
              </span>
              <span class="font-medium text-gray-800">₹{{ calculatedLabourTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Transport:</span>
              <span class="font-medium text-gray-800"
                >₹{{ (calculation.transportAmount || 0).toFixed(2) }}</span
              >
            </div>
            <div class="border-t border-gray-300 pt-2 flex justify-between text-xs text-gray-500">
              <span>Subtotal (for PMC Safety calc):</span>
              <span>₹{{ calculatedSubtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600"
                >PMC Safety ({{ calculation.pmcSafetyPercentage || 0 }}%):</span
              >
              <span class="font-medium text-gray-800">₹{{ calculatedPMCSafety.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600"
                >Administrative Cost ({{ calculation.adminCostPercentage || 0 }}%):</span
              >
              <span class="font-medium text-gray-800">₹{{ calculatedAdminCost.toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-300 mt-3 pt-3 flex justify-between">
              <span class="font-semibold text-gray-800">Grand Total:</span>
              <span class="font-bold text-lg text-blue-600"
                >₹{{ calculatedGrandTotal.toFixed(2) }}</span
              >
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <label class="block text-xs font-medium text-gray-600 mb-2">Notes (Optional)</label>
          <textarea
            v-model="calculation.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Add any additional notes..."
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <button
            @click="goBack"
            class="px-6 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="saveChanges"
            class="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!loading" class="bg-white border border-gray-300 rounded shadow-sm p-12">
        <div class="text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Calculation not found</h3>
          <p class="mt-1 text-sm text-gray-500">
            The calculation you're looking for doesn't exist.
          </p>
          <div class="mt-6">
            <button
              @click="goBack"
              class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculationAPI, categoryAPI, subcategoryAPI, specAPI } from '@/services/api'

export default {
  name: 'CalculationEdit',

  data() {
    return {
      calculation: null,
      loading: false,
      errorMessage: '',
      successMessage: '',
      calculationId: null,

      // For dropdown selection
      categories: [],
      subcategories: [],
      specs: [],
      selectedCategory: '',
      selectedSubcategory: '',
      selectedSpec: '',
      showSelectionPanel: false,
    }
  },

  computed: {
    calculatedMaterialTotal() {
      if (!this.calculation) return 0

      if (this.calculation.materialCalculationMode === 'manual') {
        return this.calculation.manualMaterialAmount || 0
      }

      return (this.calculation.materialLines || []).reduce(
        (sum, line) => sum + this.calculateLineAmount(line),
        0,
      )
    },

    calculatedLabourTotal() {
      if (!this.calculation) return 0

      if (this.calculation.labourCalculationMode === 'manual') {
        return this.calculation.manualLabourAmount || 0
      }

      return (this.calculation.labourLines || []).reduce(
        (sum, line) => sum + this.calculateLabourLineAmount(line),
        0,
      )
    },

    calculatedSubtotal() {
      return (
        this.calculatedMaterialTotal +
        this.calculatedLabourTotal +
        (this.calculation?.transportAmount || 0)
      )
    },

    calculatedPMCSafety() {
      return (this.calculatedSubtotal * (this.calculation?.pmcSafetyPercentage || 0)) / 100
    },

    calculatedAdminCost() {
      return (this.calculatedSubtotal * (this.calculation?.adminCostPercentage || 0)) / 100
    },

    calculatedGrandTotal() {
      return this.calculatedSubtotal + this.calculatedPMCSafety + this.calculatedAdminCost
    },

    filteredSubcategories() {
      if (!this.selectedCategory) return []
      return this.subcategories.filter((sub) => sub.categoryId === this.selectedCategory)
    },

    filteredSpecs() {
      if (!this.selectedSubcategory) return []
      return this.specs.filter((spec) => spec.subcategoryId === this.selectedSubcategory)
    },
  },

  methods: {
    async fetchCalculation() {
      try {
        this.loading = true
        const response = await calculationAPI.getById(this.calculationId)
        console.log(`Fetched calculation response:`, response)

        if (response.success) {
          this.calculation = response.data

          // Ensure arrays exist
          if (!this.calculation.materialLines) {
            this.calculation.materialLines = []
          }
          if (!this.calculation.labourLines) {
            this.calculation.labourLines = []
          }

          // Set default calculation modes if not present
          if (!this.calculation.materialCalculationMode) {
            this.calculation.materialCalculationMode = 'calculated'
          }
          if (!this.calculation.labourCalculationMode) {
            this.calculation.labourCalculationMode = 'calculated'
          }
        }
      } catch (error) {
        this.showError('Failed to load calculation')
        console.error('Error fetching calculation:', error)
      } finally {
        this.loading = false
      }
    },

    calculateLineAmount(line) {
      return (line.quantity || 0) * (line.rate || 0)
    },

    calculateLabourLineAmount(line) {
      return (line.quantity || 0) * (line.rate || 0)
    },

    addMaterialLine() {
      this.calculation.materialLines.push({
        name: '',
        quantity: 0,
        uom: '',
        rate: 0,
      })
    },

    removeMaterialLine(index) {
      this.calculation.materialLines.splice(index, 1)
    },

    addLabourLine() {
      this.calculation.labourLines.push({
        description: '',
        quantity: 0,
        rate: 0,
      })
    },

    removeLabourLine(index) {
      this.calculation.labourLines.splice(index, 1)
    },

    // ==========================================
    // CASCADE & RATE LOADING
    // ==========================================
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

    async onCategoryChange() {
      this.selectedSubcategory = ''
      this.selectedSpec = ''

      if (this.selectedCategory) {
        try {
          const response = await subcategoryAPI.getAll(this.selectedCategory)
          this.subcategories = response.data
        } catch (error) {
          console.error('Error fetching filtered subcategories:', error)
        }
      }
    },

    async onSubcategoryChange() {
      this.selectedSpec = ''

      if (this.selectedSubcategory) {
        try {
          const response = await specAPI.getAll(this.selectedSubcategory)
          this.specs = response.data
        } catch (error) {
          console.error('Error fetching filtered specs:', error)
        }
      }
    },

    async onSpecChange() {
      // Spec selected - ready to load
    },

    async loadRatesFromSelection() {
      if (!this.selectedSpec) {
        this.showError('Please select a specification')
        return
      }

      try {
        this.loading = true

        // Fetch the most recent calculation for this spec
        const response = await calculationAPI.getAll({ specId: this.selectedSpec })

        if (response.success && response.data.length > 0) {
          // Get the most recent calculation (assuming sorted by date)
          const sourceCalculation = response.data[0]

          // Load material data
          this.calculation.materialCalculationMode = sourceCalculation.materialCalculationMode
          this.calculation.manualMaterialAmount = sourceCalculation.manualMaterialAmount || 0
          this.calculation.materialLines = JSON.parse(
            JSON.stringify(sourceCalculation.materialLines || []),
          )

          // Load labour data
          this.calculation.labourCalculationMode = sourceCalculation.labourCalculationMode
          this.calculation.manualLabourAmount = sourceCalculation.manualLabourAmount || 0
          this.calculation.labourLines = JSON.parse(
            JSON.stringify(sourceCalculation.labourLines || []),
          )

          // Load other costs
          this.calculation.transportAmount = sourceCalculation.transportAmount || 0
          this.calculation.pmcSafetyPercentage = sourceCalculation.pmcSafetyPercentage || 0
          this.calculation.adminCostPercentage = sourceCalculation.adminCostPercentage || 0

          this.showSuccess('Rates loaded successfully from selected specification!')
          this.showSelectionPanel = false
        } else {
          this.showError('No existing calculation found for this specification')
        }
      } catch (error) {
        this.showError('Failed to load rates')
        console.error('Error loading rates:', error)
      } finally {
        this.loading = false
      }
    },

    async saveChanges() {
      try {
        this.loading = true

        // Prepare update data
        const updateData = {
          materialCalculationMode: this.calculation.materialCalculationMode,
          manualMaterialAmount: this.calculation.manualMaterialAmount || 0,
          materialLines: this.calculation.materialLines,
          labourCalculationMode: this.calculation.labourCalculationMode,
          manualLabourAmount: this.calculation.manualLabourAmount || 0,
          labourLines: this.calculation.labourLines,
          transportAmount: this.calculation.transportAmount || 0,
          pmcSafetyPercentage: this.calculation.pmcSafetyPercentage || 0,
          adminCostPercentage: this.calculation.adminCostPercentage || 0,
          notes: this.calculation.notes || '',
        }

        const response = await calculationAPI.update(this.calculationId, updateData)

        if (response.success) {
          this.showSuccess('Calculation updated successfully!')
          // Optionally redirect after a delay
          setTimeout(() => {
            this.goBack()
          }, 1500)
        }
      } catch (error) {
        this.showError(error.response?.data?.message || 'Failed to update calculation')
        console.error('Error updating calculation:', error)
      } finally {
        this.loading = false
      }
    },

    goBack() {
      // Use Vue Router to go back
      this.$router.back()
      // Or navigate to a specific route:
      // this.$router.push('/procurement-console')
    },

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
  },

  mounted() {
    // Get calculation ID from route query (not params)
    this.calculationId = this.$route.query.id

    if (!this.calculationId) {
      this.showError('Invalid calculation ID')
      return
    }

    // Fetch calculation and dropdown data
    Promise.all([
      this.fetchCalculation(),
      this.fetchCategories(),
      this.fetchSubcategories(),
      this.fetchSpecs(),
    ])
  },
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
