<template>
  <section class="create-section">
    <h2 class="section-title">Créer un nouveau ticket</h2>
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-group">
        <label for="title" class="form-label">Titre *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Entrez le titre du ticket"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Description *</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Décrivez le problème ou la demande"
          class="form-textarea"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="priority" class="form-label">Priorité</label>
          <select id="priority" v-model="form.priority" class="form-select">
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>

        <div class="form-group">
          <label for="status" class="form-label">Statut</label>
          <select id="status" v-model="form.status" class="form-select">
            <option value="open">Ouvert</option>
            <option value="in-progress">En cours</option>
            <option value="closed">Fermé</option>
          </select>
        </div>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Création...' : 'Créer le ticket' }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [ticket: { title: string; description: string; priority: string; status: string }];
}>();

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'open'
});

const handleSubmit = () => {
  if (!form.title.trim() || !form.description.trim()) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  emit('submit', { ...form });

  // Reset form
  form.title = '';
  form.description = '';
  form.priority = 'medium';
  form.status = 'open';
};
</script>

<style scoped>
.create-section {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4338ca;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
