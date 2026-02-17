<template>
  <section class="tickets-section">
    <h2 class="section-title">Mes Tickets</h2>
    
    <div v-if="tickets.length === 0" class="empty-state">
      <p class="empty-message">Aucun ticket trouvé</p>
    </div>

    <div v-else class="tickets-grid">
      <TicketCard
        v-for="ticket in tickets"
        :key="ticket._id"
        :ticket="ticket"
        :loading="loading"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </section>
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

defineProps<{
  tickets: Ticket[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  edit: [ticket: Ticket];
  delete: [id: string | undefined];
}>();
</script>

<style scoped>
.tickets-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.empty-state {
  background: white;
  padding: 3rem;
  border-radius: 0.75rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-message {
  color: #999;
  font-size: 1.1rem;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .tickets-grid {
    grid-template-columns: 1fr;
  }
}
</style>
