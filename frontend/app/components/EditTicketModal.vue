<template>
  <div v-if="ticket" class="modal-overlay" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Modifier le ticket</h2>
        <button @click="emit('close')" class="modal-close">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="form-group">
          <label class="form-label">Titre</label>
          <input
            v-model="editForm.title"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            v-model="editForm.description"
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Priorité</label>
            <select v-model="editForm.priority" class="form-select">
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Statut</label>
            <select v-model="editForm.status" class="form-select">
              <option value="open">Ouvert</option>
              <option value="in-progress">En cours</option>
              <option value="closed">Fermé</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            Sauvegarder
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="btn btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Ticket {
  _id?: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const props = defineProps<{
  ticket: Ticket | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [ticket: Ticket];
}>();

const editForm = reactive({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  status: 'open' as 'open' | 'in-progress' | 'closed'
});

watch(() => props.ticket, (newTicket) => {
  if (newTicket) {
    editForm.title = newTicket.title;
    editForm.description = newTicket.description;
    editForm.priority = newTicket.priority;
    editForm.status = newTicket.status;
  }
}, { immediate: true });

const handleSubmit = () => {
  if (!props.ticket) return;
  
  emit('submit', {
    ...props.ticket,
    ...editForm
  });
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #333;
}

.form-container {
  padding: 2rem;
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

.modal-actions {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .modal {
    width: 95%;
    max-height: 95vh;
  }
}
</style>
