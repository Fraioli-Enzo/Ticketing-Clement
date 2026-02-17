<template>
  <div class="app-container">
    <NuxtRouteAnnouncer />
    
    <AppHeader :tickets-count="tickets.length" />

    <main class="main-content">
      <TicketForm :loading="loading" @submit="createTicket" />
      
      <StatusFilter v-model="filterStatus" />
      
      <TicketList 
        :tickets="filteredTickets" 
        :loading="loading"
        @edit="openEditModal"
        @delete="deleteTicket"
      />
    </main>

    <EditTicketModal 
      :ticket="editingTicket"
      :loading="loading"
      @close="editingTicket = null"
      @submit="updateTicket"
    />
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

const tickets = ref<Ticket[]>([]);
const loading = ref(false);
const filterStatus = ref<string | null>(null);
const editingTicket = ref<Ticket | null>(null);

// Fetch tickets on mount
onMounted(async () => {
  await fetchTickets();
});

// Fetch all tickets
const fetchTickets = async () => {
  try {
    loading.value = true;
    const response = await $fetch('/api/tickets');
    tickets.value = (response as any).data || [];
  } catch (error: any) {
    console.error('Erreur lors du chargement:', error);
  } finally {
    loading.value = false;
  }
};

// Create new ticket
const createTicket = async (ticketData: { title: string; description: string; priority: string; status: string }) => {
  try {
    loading.value = true;
    await $fetch('/api/tickets', {
      method: 'POST',
      body: ticketData
    });
    await fetchTickets();
  } catch (error: any) {
    console.error('Erreur lors de la création:', error);
    alert('Erreur lors de la création du ticket');
  } finally {
    loading.value = false;
  }
};

// Update ticket
const updateTicket = async (ticket: Ticket) => {
  if (!ticket._id) return;
  
  try {
    loading.value = true;
    await $fetch(`/api/tickets/${ticket._id}`, {
      method: 'PUT',
      body: {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status
      }
    });
    await fetchTickets();
    editingTicket.value = null;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    alert('Erreur lors de la mise à jour du ticket');
  } finally {
    loading.value = false;
  }
};

// Delete ticket
const deleteTicket = async (id: string | undefined) => {
  if (!id) return;
  
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) return;
  
  try {
    loading.value = true;
    await $fetch(`/api/tickets/${id}`, {
      method: 'DELETE'
    });
    await fetchTickets();
  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error);
    alert('Erreur lors de la suppression du ticket');
  } finally {
    loading.value = false;
  }
};

// Open edit modal
const openEditModal = (ticket: Ticket) => {
  editingTicket.value = { ...ticket };
};

// Filtered tickets
const filteredTickets = computed(() => {
  if (!filterStatus.value) return tickets.value;
  return tickets.value.filter(t => t.status === filterStatus.value);
});
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
}

.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>
