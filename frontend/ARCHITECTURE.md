# Architecture du Projet Nuxt + MongoDB

## Structure des Dossiers

```
frontend/
├── server/
│   ├── api/
│   │   └── tickets/
│   │       ├── index.get.ts          # GET /api/tickets - Liste tous les tickets
│   │       ├── index.post.ts         # POST /api/tickets - Créer un ticket
│   │       ├── [id].get.ts           # GET /api/tickets/:id - Récupérer un ticket
│   │       ├── [id].put.ts           # PUT /api/tickets/:id - Modifier un ticket
│   │       └── [id].delete.ts        # DELETE /api/tickets/:id - Supprimer un ticket
│   ├── models/
│   │   └── Ticket.ts                 # Types et interfaces pour les tickets
│   └── utils/
│       └── mongodb.ts                # Connexion et utilitaires MongoDB
├── app/
│   └── app.vue
├── public/
├── nuxt.config.ts
├── package.json
└── .env

```

## Routes API Disponibles

### GET /api/tickets

Récupère tous les tickets

```typescript
// Response
{
  success: true,
  data: Ticket[]
}
```

### POST /api/tickets

Crée un nouveau ticket

```typescript
// Body
{
  title: string,
  description: string,
  status?: 'open' | 'in-progress' | 'closed',
  priority?: 'low' | 'medium' | 'high'
}

// Response
{
  success: true,
  data: Ticket
}
```

### GET /api/tickets/:id

Récupère un ticket spécifique

```typescript
// Response
{
  success: true,
  data: Ticket
}
```

### PUT /api/tickets/:id

Modifie un ticket

```typescript
// Body
{
  title?: string,
  description?: string,
  status?: 'open' | 'in-progress' | 'closed',
  priority?: 'low' | 'medium' | 'high'
}

// Response
{
  success: true,
  data: Ticket
}
```

### DELETE /api/tickets/:id

Supprime un ticket

```typescript
// Response
{
  success: true,
  message: string
}
```

## Configuration

### Variables d'environnement (.env)

```
MONGODB_URI=mongodb://mongodb:27017/ticketing
```

### Installation

```bash
npm install mongodb
```

## Utilisation dans les composants

```vue
<script setup>
// Récupérer tous les tickets
const { data: tickets } = await useFetch("/api/tickets");

// Créer un ticket
const createTicket = async () => {
  await $fetch("/api/tickets", {
    method: "POST",
    body: {
      title: "Nouveau ticket",
      description: "Description du ticket",
      priority: "high",
    },
  });
};

// Modifier un ticket
const updateTicket = async (id) => {
  await $fetch(`/api/tickets/${id}`, {
    method: "PUT",
    body: {
      status: "closed",
    },
  });
};

// Supprimer un ticket
const deleteTicket = async (id) => {
  await $fetch(`/api/tickets/${id}`, {
    method: "DELETE",
  });
};
</script>
```
