<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Category Management</h1>
        <p class="text-gray-600 mt-2">Manage categories, subcategories, and specifications</p>
      </div>

      <!-- Add Category Button -->
      <div class="mb-4">
        <button
          @click="startAddCategory"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <i class="bi bi-plus-lg mr-2"></i>
          Add Category
        </button>
      </div>

      <!-- Add Category Form -->
      <div v-if="addingCategory" class="bg-white border border-blue-300 rounded-lg p-4 mb-4">
        <div class="flex gap-2">
          <input
            v-model="newCategory.name"
            class="flex-1 px-3 py-2 border rounded-lg"
            placeholder="Category name"
            autofocus
          />
          <button @click="saveNewCategory" class="text-green-600">
            <i class="bi bi-check-lg"></i>
          </button>
          <button @click="cancelAddCategory" class="text-gray-600">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- Categories -->
      <div class="space-y-4">
        <div v-for="category in categories" :key="category._id" class="bg-white border rounded-lg">
          <!-- Category Header -->
          <div class="p-4 flex justify-between items-center">
            <div class="flex items-center flex-1">
              <button @click="toggleCategory(category._id)" class="mr-3 text-gray-500">
                <i
                  v-if="!expandedCategories.includes(category._id)"
                  class="bi bi-chevron-right"
                ></i>
                <i v-else class="bi bi-chevron-down"></i>
              </button>

              <!-- Edit Category -->
              <div v-if="editingCategory === category._id" class="flex-1 flex gap-2">
                <input
                  v-model="editForm.name"
                  class="flex-1 px-3 py-2 border rounded-lg"
                  autofocus
                />
                <button @click="saveCategory(category._id)" class="text-green-600">
                  <i class="bi bi-check-lg"></i>
                </button>
                <button @click="cancelEdit" class="text-gray-600">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>

              <h3 v-else class="text-lg font-semibold">
                {{ category.name }}
              </h3>
            </div>

            <div v-if="editingCategory !== category._id" class="flex gap-2">
              <button
                @click="startAddSubcategory(category._id)"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded"
              >
                <i class="bi bi-plus-lg mr-1"></i> Subcategory
              </button>
              <button @click="startEditCategory(category)" class="text-blue-600">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="deleteCategory(category._id)" class="text-red-600">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <!-- Subcategories -->
          <div v-if="expandedCategories.includes(category._id)" class="border-t p-4 pl-12">
            <!-- Add Subcategory -->
            <div v-if="addingSubcategory === category._id" class="flex gap-2 mb-3">
              <input
                v-model="newSubcategory.name"
                class="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Subcategory name"
                autofocus
              />
              <button @click="saveNewSubcategory" class="text-green-600">
                <i class="bi bi-check-lg"></i>
              </button>
              <button @click="cancelAddSubcategory" class="text-gray-600">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div
              v-for="subcategory in getSubcategoriesByCategory(category._id)"
              :key="subcategory._id"
              class="bg-gray-50 rounded mb-2"
            >
              <!-- Subcategory Header -->
              <div class="p-3 flex justify-between items-center">
                <div class="flex items-center flex-1">
                  <button @click="toggleSubcategory(subcategory._id)" class="mr-2">
                    <i
                      v-if="!expandedSubcategories.includes(subcategory._id)"
                      class="bi bi-chevron-right"
                    ></i>
                    <i v-else class="bi bi-chevron-down"></i>
                  </button>

                  <div v-if="editingSubcategory === subcategory._id" class="flex-1 flex gap-2">
                    <input
                      v-model="editForm.name"
                      class="flex-1 px-2 py-1 border rounded"
                      autofocus
                    />
                    <button @click="saveSubcategory(subcategory._id)" class="text-green-600">
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button @click="cancelEdit" class="text-gray-600">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>

                  <span v-else class="font-medium">
                    {{ subcategory.name }}
                  </span>
                </div>

                <div v-if="editingSubcategory !== subcategory._id" class="flex gap-2">
                  <button @click="startAddSpec(subcategory._id)" class="text-green-600">
                    <i class="bi bi-plus-lg"></i>
                  </button>
                  <button @click="startEditSubcategory(subcategory)" class="text-blue-600">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="deleteSubcategory(subcategory._id)" class="text-red-600">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Specs -->
              <div v-if="expandedSubcategories.includes(subcategory._id)" class="border-t p-3 pl-8">
                <!-- Add Spec -->
                <div v-if="addingSpec === subcategory._id" class="flex gap-2 mb-2">
                  <input
                    v-model="newSpec.name"
                    class="flex-1 px-2 py-1 border rounded"
                    placeholder="Specification name"
                    autofocus
                  />
                  <button @click="saveNewSpec" class="text-green-600">
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button @click="cancelAddSpec" class="text-gray-600">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>

                <!-- Spec list -->
                <div
                  v-for="spec in getSpecsBySubcategory(subcategory._id)"
                  :key="spec._id"
                  class="flex justify-between items-center p-2 bg-white rounded mb-1"
                >
                  <!-- EDIT MODE -->
                  <div v-if="editingSpec === spec._id" class="flex flex-1 gap-2">
                    <input
                      v-model="editForm.name"
                      class="flex-1 px-2 py-1 border rounded"
                      autofocus
                    />
                    <button @click="saveSpec(spec._id)" class="text-green-600">
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button @click="cancelEdit" class="text-gray-600">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>

                  <!-- VIEW MODE -->
                  <template v-else>
                    <span>{{ spec.name }}</span>
                    <div class="flex gap-2">
                      <button @click="startEditSpec(spec)" class="text-blue-600">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button @click="deleteSpec(spec._id)" class="text-red-600">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="categories.length === 0" class="text-center text-gray-500 py-10">
          No categories found
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { categoryAPI, subcategoryAPI, specAPI } from '@/services/api'

export default {
  name: 'CategoryManagement',

  data() {
    return {
      categories: [],
      subcategories: [],
      specs: [],

      expandedCategories: [],
      expandedSubcategories: [],

      addingCategory: false,
      addingSubcategory: null,
      addingSpec: null,

      editingCategory: null,
      editingSubcategory: null,
      editingSpec: null,

      newCategory: { name: '' },
      newSubcategory: { name: '', categoryId: null },
      newSpec: { name: '', subcategoryId: null },
      editForm: { name: '' },
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    async loadData() {
      const [c, s, sp] = await Promise.all([
        categoryAPI.getAll(),
        subcategoryAPI.getAll(),
        specAPI.getAll(),
      ])
      this.categories = c.data
      this.subcategories = s.data
      this.specs = sp.data
    },

    toggleCategory(id) {
      this.expandedCategories.includes(id)
        ? this.expandedCategories.splice(this.expandedCategories.indexOf(id), 1)
        : this.expandedCategories.push(id)
    },

    toggleSubcategory(id) {
      this.expandedSubcategories.includes(id)
        ? this.expandedSubcategories.splice(this.expandedSubcategories.indexOf(id), 1)
        : this.expandedSubcategories.push(id)
    },

    startAddCategory() {
      this.addingCategory = true
      this.newCategory.name = ''
    },

    cancelAddCategory() {
      this.addingCategory = false
      this.newCategory.name = ''
    },

    async saveNewCategory() {
      if (!this.newCategory.name.trim()) return
      await categoryAPI.create(this.newCategory)
      await this.loadData()
      this.cancelAddCategory()
    },

    startEditCategory(cat) {
      this.editingCategory = cat._id
      this.editForm.name = cat.name
    },

    async saveCategory(id) {
      await categoryAPI.update(id, this.editForm)
      await this.loadData()
      this.cancelEdit()
    },

    async deleteCategory(id) {
      if (!confirm('Delete category and all children?')) return
      await categoryAPI.delete(id)
      await this.loadData()
    },

    startAddSubcategory(categoryId) {
      if (!this.expandedCategories.includes(categoryId)) {
        this.expandedCategories.push(categoryId)
      }
      this.addingSubcategory = categoryId
      this.newSubcategory = { name: '', categoryId }
    },

    cancelAddSubcategory() {
      this.addingSubcategory = null
      this.newSubcategory = { name: '', categoryId: null }
    },

    async saveNewSubcategory() {
      if (!this.newSubcategory.name.trim()) return
      await subcategoryAPI.create(this.newSubcategory)
      await this.loadData()
      this.cancelAddSubcategory()
    },

    startEditSubcategory(sub) {
      this.editingSubcategory = sub._id
      this.editForm.name = sub.name
    },

    async saveSubcategory(id) {
      await subcategoryAPI.update(id, this.editForm)
      await this.loadData()
      this.cancelEdit()
    },

    async deleteSubcategory(id) {
      if (!confirm('Delete subcategory and specs?')) return
      await subcategoryAPI.delete(id)
      await this.loadData()
    },

    startAddSpec(subcategoryId) {
      if (!this.expandedSubcategories.includes(subcategoryId)) {
        this.expandedSubcategories.push(subcategoryId)
      }
      this.addingSpec = subcategoryId
      this.newSpec = { name: '', subcategoryId }
    },

    cancelAddSpec() {
      this.addingSpec = null
      this.newSpec = { name: '', subcategoryId: null }
    },

    async saveNewSpec() {
      if (!this.newSpec.name.trim()) return
      await specAPI.create(this.newSpec)
      await this.loadData()
      this.cancelAddSpec()
    },

    startEditSpec(spec) {
      this.editingSpec = spec._id
      this.editForm.name = spec.name
    },

    async saveSpec(id) {
      if (!this.editForm.name.trim()) return
      await specAPI.update(id, this.editForm)
      await this.loadData()
      this.cancelEdit()
    },

    async deleteSpec(id) {
      if (!confirm('Delete specification?')) return
      await specAPI.delete(id)
      await this.loadData()
    },

    cancelEdit() {
      this.editingCategory = null
      this.editingSubcategory = null
      this.editingSpec = null
      this.editForm.name = ''
    },

    getSubcategoriesByCategory(id) {
      return this.subcategories.filter((s) => s.categoryId === id)
    },

    getSpecsBySubcategory(id) {
      return this.specs.filter((s) => s.subcategoryId === id)
    },
  },
}
</script>
