import { ObjectId } from 'mongodb';

export interface Ticket {
  _id?: ObjectId;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  status?: 'open' | 'in-progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: 'open' | 'in-progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
}
