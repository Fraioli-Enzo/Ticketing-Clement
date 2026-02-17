<template>
  <div class="ticket-card" :class="`priority-${ticket.priority}`">
    <div class="ticket-header">
      <h3 class="ticket-title">{{ ticket.title }}</h3>
      <span class="ticket-status" :class="`status-${ticket.status}`">
        {{ getStatusLabel(ticket.status) }}
      </span>
    </div>

    <p class="ticket-description">{{ ticket.description }}</p>

    <div class="ticket-meta">
      <span class="priority-badge" :class="`priority-${ticket.priority}`">
        {{ getPriorityLabel(ticket.priority) }}
      </span>
      <span class="ticket-date">{{ formatDate(ticket.createdAt) }}</span>
    </div>

    <div class="ticket-actions">
      <button
        @click="emit('edit', ticket)"
        class="btn btn-small btn-secondary"
      >
        ✏️ Modifier
      </button>
      <button
        @click="emit('delete', ticket._id)"
        class="btn btn-small btn-danger"
        :disabled="loading"
      >
        🗑️ Supprimer
      </button>
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
  ticket: Ticket;
  loading?: boolean;
}>();

const emit = defineEmits<{
  edit: [ticket: Ticket];
  delete: [id: string | undefined];
}>();

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'open': 'Ouvert',
    'in-progress': 'En cours',
    'closed': 'Fermé'
  };
  return labels[status] || status;
};

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    'low': 'Basse',
    'medium': 'Moyenne',
    'high': 'Haute'
  };
  return labels[priority] || priority;
};

const formatDate = (date: any) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR');
};
</script>

<style scoped>
.ticket-card {
  background: white;
  border-left: 4px solid #d1d5db;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.ticket-card.priority-high {
  border-left-color: #ef4444;
}

.ticket-card.priority-medium {
  border-left-color: #f59e0b;
}

.ticket-card.priority-low {
  border-left-color: #10b981;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.ticket-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
}

.ticket-status {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.ticket-status.status-open {
  background: #dbeafe;
  color: #0369a1;
}

.ticket-status.status-in-progress {
  background: #fef08a;
  color: #854d0e;
}

.ticket-status.status-closed {
  background: #dcfce7;
  color: #15803d;
}

.ticket-description {
  color: #4b5563;
  line-height: 1.5;
  font-size: 0.95rem;
}

.ticket-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-badge.priority-high {
  background: #fee2e2;
  color: #991b1b;
}

.priority-badge.priority-medium {
  background: #fef3c7;
  color: #92400e;
}

.priority-badge.priority-low {
  background: #ecfdf5;
  color: #065f46;
}

.ticket-date {
  color: #999;
  font-size: 0.875rem;
}

.ticket-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
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

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .ticket-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
