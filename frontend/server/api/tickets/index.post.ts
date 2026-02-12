import { getCollection } from '../../utils/mongodb';
import type { CreateTicketInput, Ticket } from '../../models/Ticket';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreateTicketInput>(event);
    
    // Validation
    if (!body.title || !body.description) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le titre et la description sont requis'
      });
    }

    const collection = await getCollection('tickets');
    
    const newTicket: Omit<Ticket, '_id'> = {
      title: body.title,
      description: body.description,
      status: body.status || 'open',
      priority: body.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newTicket);
    
    return {
      success: true,
      data: {
        _id: result.insertedId,
        ...newTicket
      }
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la création du ticket',
      message: error.message
    });
  }
});
