<template>
  <div class="app-container">
    <NuxtRouteAnnouncer />
    
    <!-- Header -->
    <header class="header">
      <nav class="navbar">
        <h1 class="logo">🎫 Ticketing System</h1>
        <div class="nav-info">
          <span class="tickets-count">{{ tickets.length }} ticket(s)</span>
        </div>
      </nav>
    </header>

    <!-- Main Container -->
    <main class="main-content">
      <!-- Create Ticket Form -->
      <section class="create-section">
        <h2 class="section-title">Créer un nouveau ticket</h2>
        <form @submit.prevent="createTicket" class="form-container">
          <div class="form-group">
            <label for="title" class="form-label">Titre *</label>
            <input
              id="title"
              v-model="newTicket.title"
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
              v-model="newTicket.description"
              placeholder="Décrivez le problème ou la demande"
              class="form-textarea"
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="priority" class="form-label">Priorité</label>
              <select id="priority" v-model="newTicket.priority" class="form-select">
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status" class="form-label">Statut</label>
              <select id="status" v-model="newTicket.status" class="form-select">
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

      <!-- Filters -->
      <section class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Filtrer par statut:</label>
          <div class="filter-buttons">
            <button
              @click="filterStatus = null"
              :class="['filter-btn', { active: filterStatus === null }]"
            >
              Tous
            </button>
            <button
              @click="filterStatus = 'open'"
              :class="['filter-btn', { active: filterStatus === 'open' }]"
            >
              Ouverts
            </button>
            <button
              @click="filterStatus = 'in-progress'"
              :class="['filter-btn', { active: filterStatus === 'in-progress' }]"
            >
              En cours
            </button>
            <button
              @click="filterStatus = 'closed'"
              :class="['filter-btn', { active: filterStatus === 'closed' }]"
            >
              Fermés
            </button>
          </div>
        </div>
      </section>

      <!-- Tickets List -->
      <section class="tickets-section">
        <h2 class="section-title">Mes Tickets</h2>
        
        <div v-if="filteredTickets.length === 0" class="empty-state">
          <p class="empty-message">Aucun ticket trouvé</p>
        </div>

        <!-- Tickets Grid -->
        <div v-else class="tickets-grid">
          <div
            v-for="ticket in filteredTickets"
            :key="ticket._id"
            class="ticket-card"
            :class="`priority-${ticket.priority}`"
          >
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
                @click="openEditModal(ticket)"
                class="btn btn-small btn-secondary"
              >
                ✏️ Modifier
              </button>
              <button
                @click="deleteTicket(ticket._id)"
                class="btn btn-small btn-danger"
                :disabled="loading"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Edit Modal -->
    <div v-if="editingTicket" class="modal-overlay" @click="editingTicket = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Modifier le ticket</h2>
          <button @click="editingTicket = null" class="modal-close">✕</button>
        </div>

        <form @submit.prevent="updateTicket" class="form-container">
          <div class="form-group">
            <label class="form-label">Titre</label>
            <input
              v-model="editingTicket.title"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              v-model="editingTicket.description"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Priorité</label>
              <select v-model="editingTicket.priority" class="form-select">
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Statut</label>
              <select v-model="editingTicket.status" class="form-select">
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
              @click="editingTicket = null"
              class="btn btn-secondary"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
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

const tickets = ref<Ticket[]>([]);
const loading = ref(false);
const filterStatus = ref<string | null>(null);
const editingTicket = ref<Ticket | null>(null);

const newTicket = reactive({
  title: '',
  description: '',
  priority: 'medium' as const,
  status: 'open' as const
});

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
const createTicket = async () => {
  if (!newTicket.title.trim() || !newTicket.description.trim()) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  try {
    loading.value = true;
    await $fetch('/api/tickets', {
      method: 'POST',
      body: newTicket
    });
    await fetchTickets();
    // Reset form
    newTicket.title = '';
    newTicket.description = '';
    newTicket.priority = 'medium';
    newTicket.status = 'open';
  } catch (error: any) {
    console.error('Erreur lors de la création:', error);
    alert('Erreur lors de la création du ticket');
  } finally {
    loading.value = false;
  }
};

// Update ticket
const updateTicket = async () => {
  if (!editingTicket.value || !editingTicket.value._id) return;
  
  try {
    loading.value = true;
    await $fetch(`/api/tickets/${editingTicket.value._id}`, {
      method: 'PUT',
      body: {
        title: editingTicket.value.title,
        description: editingTicket.value.description,
        priority: editingTicket.value.priority,
        status: editingTicket.value.status
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

// Helper functions
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

/* Header */
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.75rem;
  font-weight: bold;
  color: #4f46e5;
}

.nav-info {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.tickets-count {
  background: #f0f4ff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #4f46e5;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Section Title */
.section-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

/* Create Section */
.create-section {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* Form */
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

/* Buttons */
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

/* Filters */
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

/* Tickets Section */
.tickets-section {
  margin-bottom: 2rem;
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

/* Tickets Grid */
.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

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

/* Modal */
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

.modal > .form-container {
  padding: 2rem;
}

.modal-actions {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .navbar {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .tickets-grid {
    grid-template-columns: 1fr;
  }

  .filter-buttons {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }

  .ticket-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .modal {
    width: 95%;
    max-height: 95vh;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
