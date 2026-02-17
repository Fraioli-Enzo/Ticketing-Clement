<template>
  <section class="filters-section">
    <div class="filter-group">
      <label class="filter-label">Filtrer par statut:</label>
      <div class="filter-buttons">
        <button
          @click="emit('update:modelValue', null)"
          :class="['filter-btn', { active: modelValue === null }]"
        >
          Tous
        </button>
        <button
          @click="emit('update:modelValue', 'open')"
          :class="['filter-btn', { active: modelValue === 'open' }]"
        >
          Ouverts
        </button>
        <button
          @click="emit('update:modelValue', 'in-progress')"
          :class="['filter-btn', { active: modelValue === 'in-progress' }]"
        >
          En cours
        </button>
        <button
          @click="emit('update:modelValue', 'closed')"
          :class="['filter-btn', { active: modelValue === 'closed' }]"
        >
          Fermés
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();
</script>

<style scoped>
.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-label {
  font-weight: 600;
  color: #374151;
}

.filter-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #d1d5db;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.filter-btn.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

@media (max-width: 768px) {
  .filter-buttons {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }
}
</style>
