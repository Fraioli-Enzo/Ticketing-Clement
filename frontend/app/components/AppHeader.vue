<template>
  <header class="header">
    <nav class="navbar">
      <h1 class="logo">🎫 Ticketing System</h1>
      <div class="nav-info">
        <span class="tickets-count">{{ ticketsCount }} ticket(s)</span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  ticketsCount: number;
}>();
</script>

<style scoped>
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

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
